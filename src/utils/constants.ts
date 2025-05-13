const HTTP_STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
};

const UPLOAD_TYPES_FOR_IMPORT = {
  JSON_FOLDER: "jsonFolder",
  JSON_ARRAY_FILE: "jsonArrayFile",
  CSV_FILE: "csvFile",
  REDIS_COMMANDS_FILE: "redisCommandsFile",
};
enum ImportStatus {
  IN_PROGRESS = "inProgress",
  ERROR_STOPPED = "errorStopped",
  PAUSED = "paused",
  SUCCESS = "success",
  PARTIAL_SUCCESS = "partialSuccess",
}

const DISABLE_JS_DATA = {
  NAMES_GLOBAL: ["window", "document", "global", "process"],
  NAMES_DANGEROUS: ["eval"],
  NAMES_TIME_INTERVALS: ["setTimeout", "setInterval"],
  NAMES_NETWORK: ["fetch", "XMLHttpRequest"],
  NAMES_MODULES: ["require", "module", "exports"],
  NAMES_CONSOLE: ["console"],

  CONSTRUCT_FUNCTIONS: [
    "FunctionDeclaration",
    "FunctionExpression",
    "ArrowFunctionExpression",
  ],

  CONSTRUCT_LOOPS: [
    "ForStatement",
    "WhileStatement",
    "DoWhileStatement",
    "ForInStatement",
    "ForOfStatement",
  ],

  CONSTRUCT_ASYNC: ["AwaitExpression", "ImportExpression"],

  CALL_EXPRESSION_ARRAY_LOOPS: [
    "forEach",
    "map",
    "filter",
    "reduce",
    "some",
    "every",
  ],
};

const DISABLE_JS_FLAGS = {
  NAMES_GLOBAL: true,
  NAMES_DANGEROUS: true,
  NAMES_TIME_INTERVALS: true,
  NAMES_NETWORK: true,
  NAMES_MODULES: true,
  NAMES_CONSOLE: true,
  NESTED_FUNCTIONS: true,
  LOOPS: true,
  ARRAY_LOOPS: true,
  ASYNC: true,
};

const REDIS_WRITE_COMMANDS = [
  // String commands
  "SET",
  "SETEX",
  "SETNX",
  "SETRANGE",
  "APPEND",
  "INCR",
  "INCRBY",
  "INCRBYFLOAT",
  "DECR",
  "DECRBY",
  "MSET",
  "MSETNX",
  "PSETEX",
  "GETSET",
  "STRALGO",

  // Hash commands
  "HSET",
  "HSETNX",
  "HMSET",
  "HDEL",
  "HINCRBY",
  "HINCRBYFLOAT",

  // List commands
  "LPUSH",
  "LPUSHX",
  "RPUSH",
  "RPUSHX",
  "LINSERT",
  "LPOP",
  "RPOP",
  "LREM",
  "LSET",
  "LTRIM",
  "RPOPLPUSH",
  "BLPOP",
  "BRPOP",
  "BRPOPLPUSH",

  // Set commands
  "SADD",
  "SREM",
  "SMOVE",
  "SPOP",
  "SDIFFSTORE",
  "SINTERSTORE",
  "SUNIONSTORE",

  // Sorted Set commands
  "ZADD",
  "ZINCRBY",
  "ZREM",
  "ZREMRANGEBYRANK",
  "ZREMRANGEBYSCORE",
  "ZREMRANGEBYLEX",
  "ZINTERSTORE",
  "ZUNIONSTORE",
  "BZPOPMIN",
  "BZPOPMAX",
  "ZPOPMIN",
  "ZPOPMAX",

  // HyperLogLog commands
  "PFADD",
  "PFMERGE",

  // Bitmap commands
  "SETBIT",
  "BITOP",

  // Stream commands
  "XADD",
  "XDEL",
  "XTRIM",
  "XGROUP CREATE",
  "XGROUP SETID",
  "XGROUP DESTROY",
  "XGROUP DELCONSUMER",
  "XACK",
  "XCLAIM",
  "XAUTOCLAIM",

  // Geo commands
  "GEOADD",
  "GEOHASH",
  "GEORADIUS",
  "GEORADIUSBYMEMBER",
  "GEOSEARCH",

  // Keyspace (generic) commands
  //"DEL",
  "EXPIRE",
  "EXPIREAT",
  "PERSIST",
  "PEXPIRE",
  "PEXPIREAT",
  "RENAME",
  "RENAMENX",
  //"UNLINK",
  //"MIGRATE",
  //"MOVE",
  //"RESTORE",
  //"TOUCH",

  // RedisJSON module commands
  "JSON.SET",
  "JSON.MSET",
  "JSON.MSETNX",
  "JSON.DEL",
  "JSON.NUMINCRBY",
  "JSON.NUMMULTBY",
  "JSON.STRAPPEND",
  "JSON.ARRAPPEND",
  "JSON.ARRINSERT",
  "JSON.ARRPOP",
  "JSON.ARRTRIM",
  //"JSON.CLEAR",
  "JSON.TOGGLE",
  "JSON.MERGE",
  "JSON.PATCH",

  // RediSearch module commands
  "FT.CREATE",
  "FT.ALTER",
  //"FT.DROPINDEX",
  "FT.ADD",
  //"FT.DEL",
  "FT.SUGADD",
  "FT.SUGDEL",
  "FT.SUGLEN",
  "FT.SUGGET",
  "FT.AGGREGATE",

  // TimeSeries module commands
  "TS.ADD",
  "TS.MADD",
  "TS.INCRBY",
  "TS.DECRBY",
  "TS.CREATE",
  "TS.ALTER",
  "TS.CREATERULE",
  "TS.DELETERULE",
];

// Commands where the key is NOT at position 1 (0-based index)
// Format: { command: string, keyPattern: { type: string, start: number, step?: number, indexes?: number[] } }
const REDIS_WRITE_SPECIAL_COMMANDS = [
  // MSET, MSETNX: keys at even indexes (1, 3, 5, ...)
  { command: "MSET", keyPattern: { type: "step", start: 1, step: 2 } },
  { command: "MSETNX", keyPattern: { type: "step", start: 1, step: 2 } },
  // keys from index 2 onwards
  { command: "BITOP", keyPattern: { type: "from", start: 2 } },
  { command: "SDIFFSTORE", keyPattern: { type: "from", start: 2 } },
  { command: "SINTERSTORE", keyPattern: { type: "from", start: 2 } },
  { command: "SUNIONSTORE", keyPattern: { type: "from", start: 2 } },
  // keys from index 3 onwards
  { command: "ZINTERSTORE", keyPattern: { type: "from", start: 3 } },
  { command: "ZUNIONSTORE", keyPattern: { type: "from", start: 3 } },
  // keys at index 1 and 2
  { command: "RPOPLPUSH", keyPattern: { type: "indexes", indexes: [1, 2] } },
  { command: "BRPOPLPUSH", keyPattern: { type: "indexes", indexes: [1, 2] } },
  { command: "SMOVE", keyPattern: { type: "indexes", indexes: [1, 2] } },
  { command: "RENAME", keyPattern: { type: "indexes", indexes: [1, 2] } },
  { command: "RENAMENX", keyPattern: { type: "indexes", indexes: [1, 2] } },
  {
    command: "TS.CREATERULE",
    keyPattern: { type: "indexes", indexes: [1, 2] },
  },
  {
    command: "TS.DELETERULE",
    keyPattern: { type: "indexes", indexes: [1, 2] },
  },
  //  key at index 2
  { command: "XGROUP CREATE", keyPattern: { type: "indexes", indexes: [2] } },
  { command: "XGROUP SETID", keyPattern: { type: "indexes", indexes: [2] } },
  { command: "XGROUP DESTROY", keyPattern: { type: "indexes", indexes: [2] } },
  {
    command: "XGROUP DELCONSUMER",
    keyPattern: { type: "indexes", indexes: [2] },
  },
  // others
  { command: "STRALGO", keyPattern: { type: "indexes", indexes: [2, 3] } },
  { command: "JSON.MSET", keyPattern: { type: "step", start: 1, step: 3 } },
  { command: "JSON.MSETNX", keyPattern: { type: "step", start: 1, step: 3 } },
  { command: "TS.MADD", keyPattern: { type: "step", start: 1, step: 3 } },
  { command: "PFMERGE", keyPattern: { type: "from", start: 1 } },
];

const REDIS_READ_COMMANDS = [
  // RediSearch commands
  "FT.INFO",
  "FT.SEARCH",
  "FT._LIST",
  "FT.EXPLAIN",
  "FT.AGGREGATE",

  // RedisJSON commands
  "JSON.GET",
  "JSON.MGET",
  "JSON.TYPE",
  "JSON.STRLEN",
  "JSON.OBJKEYS",
  "JSON.OBJLEN",
  "JSON.DEBUG",
  "JSON.RESP",

  // Redis Core read commands
  "GET",
  "MGET",
  "EXISTS",
  "TYPE",
  "STRLEN",
  "LLEN",
  "SCARD",
  "ZCARD",
  "HLEN",
  "HGET",
  "HMGET",
  "HGETALL",
  "HEXISTS",
];

const REDIS_ALLOWED_COMMANDS = [
  ...REDIS_WRITE_COMMANDS,
  ...REDIS_READ_COMMANDS,
];

type DisableJsFlagsType = {
  [key in keyof typeof DISABLE_JS_FLAGS]: boolean;
};

enum USER_DATA_STATUS {
  UNUSED = "UNUSED",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  TO_BE_DELETED = "TO_BE_DELETED",
}

export {
  HTTP_STATUS_CODES,
  DISABLE_JS_DATA,
  DISABLE_JS_FLAGS,
  UPLOAD_TYPES_FOR_IMPORT,
  ImportStatus,
  REDIS_ALLOWED_COMMANDS,
  USER_DATA_STATUS,
  REDIS_WRITE_SPECIAL_COMMANDS,
  REDIS_WRITE_COMMANDS,
};

export type { DisableJsFlagsType };
