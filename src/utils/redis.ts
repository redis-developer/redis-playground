import { createClient } from "redis";

import { LoggerCls } from "./logger.js";

type RedisClientType = ReturnType<typeof createClient>;

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

  public async rawCommandExecute(_command: string) {
    const commandArray = _command.trim().split(/\s+/);
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
