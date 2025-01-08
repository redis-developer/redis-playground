import { createClient } from "redis";

import { LoggerCls } from "./logger.js";
import { REDIS_ALLOWED_COMMANDS } from "./constants.js";
type RedisClientType = ReturnType<typeof createClient>;

function isCommandAllowed(_commandKeyword: string) {
  let isAllowed = false;

  if (_commandKeyword && REDIS_ALLOWED_COMMANDS.includes(_commandKeyword)) {
    isAllowed = true;
  }

  return isAllowed;
}

function splitQuery(query: string) {
  /**
       inputQuery = "FT.SEARCH '{dbIndexName}' '@brandName:{nike} @gender:{men}'";
       output = ["FT.SEARCH", "{dbIndexName}", "@brandName:{nike} @gender:{men}"]
       */
  let retArr: string[] = [];

  //remove all empty lines and comments starting with # or //
  query = query
    .split("\n")
    .filter((line) => {
      const trimmedLine = line.trim();
      return (
        trimmedLine &&
        !(trimmedLine.startsWith("#") || trimmedLine.startsWith("//"))
      );
    })
    .join("\n");

  // replace all escape characters with placeholders
  query = query.replace(/\\"/g, "ESCAPED_D_QUOTE");
  query = query.replace(/\\'/g, "ESCAPED_S_QUOTE");
  query = query.replace(/\\t/g, "ESCAPED_T");
  query = query.replace(/\\n/g, "ESCAPED_N");
  query = query.replace(/\\r/g, "ESCAPED_R");
  query = query.replace(/\\\\/g, "ESCAPED_B");

  // Match either:
  // 1. A sequence of characters between quotes
  // 2. A sequence of non-space characters

  //const regex = /'[^']*'|\S+/g;
  const regex = /('[^']*'|"[^"]*"|\S+)/g;

  const matches = query.match(regex);

  if (matches) {
    retArr = matches.map((_match) => {
      // Remove surrounding quotes if they exist
      //_match = _match.replace(/^'|'$/g, "");
      _match = _match.replace(/^['"]|['"]$/g, "");

      _match = _match.replace(/ESCAPED_D_QUOTE/g, '"');
      _match = _match.replace(/ESCAPED_S_QUOTE/g, "'");
      _match = _match.replace(/ESCAPED_T/g, "\t");
      _match = _match.replace(/ESCAPED_N/g, "\n");
      _match = _match.replace(/ESCAPED_R/g, "\r");
      _match = _match.replace(/ESCAPED_B/g, "\\");

      return _match;
    });
  }

  // Convert binary strings back to proper format
  //@ts-ignore
  retArr = retArr.map((part) => {
    if (part.includes("\\x")) {
      return Buffer.from(
        part.replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) =>
          String.fromCharCode(parseInt(hex, 16))
        ),
        "binary"
      );
    }
    return part;
  });

  return retArr;
}

class RedisWrapper {
  client: RedisClientType | null = null;

  constructor(connectionURL?: string) {
    this.client = createClient({
      url: connectionURL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            // Limit to 3 retry attempts
            return new Error("Retry attempts exhausted.");
          }
          // Retry after ms
          return 10;
        },
      },
    });
    this.client.on("error", (err) => {
      LoggerCls.error("Redis Client Error", err);
    });
  }

  public async connect() {
    await this.client?.connect();
    LoggerCls.info("Connected successfully to Redis !");
  }

  public async disconnect() {
    await this.client?.disconnect();
    LoggerCls.info("Disconnected from Redis.");
  }

  public async set(_key: string, _value: string) {
    const result = await this.client?.set(_key, _value);
    return result;
  }

  public async get(_key: string) {
    const result = await this.client?.get(_key);
    return result;
  }

  public async getAllKeys(_pattern?: string) {
    _pattern = _pattern || "*";
    const result = await this.client?.keys(_pattern);
    return result;
  }

  public async getKeys(fetchLimit: number, _pattern?: string) {
    let keys: string[] = [];

    if (fetchLimit > 0) {
      _pattern = _pattern || "*";
      let cursor = 0;
      let scanIterationCount = 100;
      if (scanIterationCount > fetchLimit) {
        scanIterationCount = fetchLimit;
      }

      do {
        // SCAN returns [cursor, keys] array
        const result = await this.client?.scan(cursor, {
          MATCH: _pattern,
          COUNT: scanIterationCount, //soft limit
        });

        if (result) {
          const { cursor: newCursor, keys: scanKeys } = result;
          cursor = newCursor;
          if (scanKeys?.length) {
            keys.push(...scanKeys);
          }

          if (keys.length >= fetchLimit) {
            break;
          } else if (fetchLimit - keys.length < scanIterationCount) {
            // last iteration
            scanIterationCount = fetchLimit - keys.length;
          }
        } else {
          break;
        }
      } while (cursor !== 0);
    } else {
      throw new Error(
        "fetchLimit must be greater than 0 or use getAllKeys instead!"
      );
    }

    if (keys.length > fetchLimit) {
      keys = keys.slice(0, fetchLimit);
    }

    return keys;
  }

  public async mGet(_keys: string[]) {
    const result = await this.client?.mGet(_keys);
    return result;
  }

  public async jsonMGet(_keys: string[]) {
    const result = await this.client?.json.mGet(_keys, ".");
    return result;
  }

  public async rawCommandExecute(
    _command: string,
    _skipCmdCheck: boolean = false
  ) {
    // const commandArray = _command.trim().split(/\s+/);
    const commandArray = splitQuery(_command);
    if (
      commandArray?.length &&
      !_skipCmdCheck &&
      !isCommandAllowed(commandArray[0])
    ) {
      throw new Error("Command not allowed");
    }
    const result = await this.client?.sendCommand(commandArray);
    return result;
  }

  public async dropIndex(_indexName: string) {
    let result: any;
    try {
      result = await this.client?.ft.dropIndex(_indexName);
    } catch (err) {
      LoggerCls.error("Error in dropIndex", err);
    }
    return result;
  }
}

// Singleton class to wrap the Redis client
class RedisWrapperST extends RedisWrapper {
  private static instance: RedisWrapperST;

  private constructor(connectionURL?: string) {
    super(connectionURL);
  }

  public static setInstance(connectionURL: string) {
    RedisWrapperST.instance = new RedisWrapperST(connectionURL);
    return RedisWrapperST.instance;
  }

  public static getInstance(): RedisWrapperST {
    return RedisWrapperST.instance;
  }
}

export { RedisWrapper, RedisWrapperST };

/** Example Usage (RedisWrapper)
 
const redisWrapper = new RedisWrapper("redis://localhost:6379");
await redisWrapper.connect(); 
// perform redis operations
await redisWrapper.disconnect();
//--------------------------------

** Example Usage (RedisWrapperST)

// on app start
const redisWrapperST = RedisWrapperST.setInstance("redis://localhost:6379");
await redisWrapperST.connect(); 

// on app usage
const redisWrapperST = RedisWrapperST.getInstance();
await redisWrapperST.set("key", "value");
await redisWrapperST.client.set("key", "value"); // direct access to client 

*/
