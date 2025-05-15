interface IRedisCommandPattern {
  command: string;
  category: string;
  keyPattern?: {
    type: "step" | "from" | "indexes" | "none";
    start?: number;
    step?: number;
    indexes?: number[];
  };
  matchPatternToStop?: (string | RegExp)[];
  canDbInsert?: boolean;
}

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

const REDIS_WRITE_COMMANDS: IRedisCommandPattern[] = [
  // String commands
  { command: "SET", category: "string", canDbInsert: true },
  { command: "SETEX", category: "string", canDbInsert: true },
  { command: "SETNX", category: "string", canDbInsert: true },
  { command: "SETRANGE", category: "string" },
  { command: "APPEND", category: "string" },
  { command: "INCR", category: "string", canDbInsert: true },
  { command: "INCRBY", category: "string", canDbInsert: true },
  { command: "INCRBYFLOAT", category: "string", canDbInsert: true },
  { command: "DECR", category: "string", canDbInsert: true },
  { command: "DECRBY", category: "string", canDbInsert: true },
  {
    command: "MSET",
    category: "string",
    keyPattern: { type: "step", start: 1, step: 2 },
    canDbInsert: true,
  },
  {
    command: "MSETNX",
    category: "string",
    keyPattern: { type: "step", start: 1, step: 2 },
    canDbInsert: true,
  },
  { command: "PSETEX", category: "string", canDbInsert: true },
  { command: "GETSET", category: "string", canDbInsert: true },
  {
    command: "STRALGO",
    category: "string",
    keyPattern: { type: "indexes", indexes: [2, 3] },
  },

  // Hash commands
  { command: "HSET", category: "hash", canDbInsert: true },
  { command: "HSETNX", category: "hash", canDbInsert: true },
  { command: "HMSET", category: "hash", canDbInsert: true },
  { command: "HDEL", category: "hash" },
  { command: "HINCRBY", category: "hash", canDbInsert: true },
  { command: "HINCRBYFLOAT", category: "hash", canDbInsert: true },

  // List commands
  { command: "LPUSH", category: "list", canDbInsert: true },
  { command: "LPUSHX", category: "list" },
  { command: "RPUSH", category: "list", canDbInsert: true },
  { command: "RPUSHX", category: "list" },
  { command: "LINSERT", category: "list" },
  { command: "LPOP", category: "list" },
  { command: "RPOP", category: "list" },
  { command: "LREM", category: "list" },
  { command: "LSET", category: "list" },
  { command: "LTRIM", category: "list" },
  {
    command: "RPOPLPUSH",
    category: "list",
    keyPattern: { type: "indexes", indexes: [1, 2] },
    canDbInsert: true,
  },
  { command: "BLPOP", category: "list" },
  { command: "BRPOP", category: "list" },
  {
    command: "BRPOPLPUSH",
    category: "list",
    keyPattern: { type: "indexes", indexes: [1, 2] },
    canDbInsert: true,
  },

  // Set commands
  { command: "SADD", category: "set", canDbInsert: true },
  { command: "SREM", category: "set" },
  {
    command: "SMOVE",
    category: "set",
    keyPattern: { type: "indexes", indexes: [1, 2] },
    canDbInsert: true,
  },
  { command: "SPOP", category: "set" },
  {
    command: "SDIFFSTORE",
    category: "set",
    keyPattern: { type: "from", start: 2 },
    canDbInsert: true,
  },
  {
    command: "SINTERSTORE",
    category: "set",
    keyPattern: { type: "from", start: 2 },
    canDbInsert: true,
  },
  {
    command: "SUNIONSTORE",
    category: "set",
    keyPattern: { type: "from", start: 2 },
    canDbInsert: true,
  },

  // Sorted Set commands
  { command: "ZADD", category: "zset", canDbInsert: true },
  { command: "ZINCRBY", category: "zset", canDbInsert: true },
  { command: "ZREM", category: "zset" },
  { command: "ZREMRANGEBYRANK", category: "zset" },
  { command: "ZREMRANGEBYSCORE", category: "zset" },
  { command: "ZREMRANGEBYLEX", category: "zset" },
  {
    command: "ZINTERSTORE",
    category: "zset",
    keyPattern: { type: "from", start: 3 },
    canDbInsert: true,
  },
  {
    command: "ZUNIONSTORE",
    category: "zset",
    keyPattern: { type: "from", start: 3 },
    canDbInsert: true,
  },
  { command: "BZPOPMIN", category: "zset" },
  { command: "BZPOPMAX", category: "zset" },
  { command: "ZPOPMIN", category: "zset" },
  { command: "ZPOPMAX", category: "zset" },

  // HyperLogLog commands
  { command: "PFADD", category: "hyperloglog", canDbInsert: true },
  {
    command: "PFMERGE",
    category: "hyperloglog",
    keyPattern: { type: "from", start: 1 },
    canDbInsert: true,
  },

  // Bitmap commands
  { command: "SETBIT", category: "bitmap", canDbInsert: true },
  {
    command: "BITOP",
    category: "bitmap",
    keyPattern: { type: "from", start: 2 },
    canDbInsert: true,
  },

  // Stream commands
  { command: "XADD", category: "stream", canDbInsert: true },
  { command: "XDEL", category: "stream" },
  { command: "XTRIM", category: "stream" },
  {
    command: "XGROUP CREATE",
    category: "stream",
    keyPattern: { type: "indexes", indexes: [2] },
    canDbInsert: true,
  },
  {
    command: "XGROUP SETID",
    category: "stream",
    keyPattern: { type: "indexes", indexes: [2] },
  },
  {
    command: "XGROUP DESTROY",
    category: "stream",
    keyPattern: { type: "indexes", indexes: [2] },
  },
  {
    command: "XGROUP DELCONSUMER",
    category: "stream",
    keyPattern: { type: "indexes", indexes: [2] },
  },
  { command: "XACK", category: "stream" },
  { command: "XCLAIM", category: "stream" },
  { command: "XAUTOCLAIM", category: "stream" },

  // Geo commands
  { command: "GEOADD", category: "geo", canDbInsert: true },
  { command: "GEOHASH", category: "geo" },
  { command: "GEORADIUS", category: "geo" },
  { command: "GEORADIUSBYMEMBER", category: "geo" },
  { command: "GEOSEARCH", category: "geo" },

  // Keyspace (generic) commands
  //"DEL",
  { command: "EXPIRE", category: "keyspace" },
  { command: "EXPIREAT", category: "keyspace" },
  { command: "PERSIST", category: "keyspace" },
  { command: "PEXPIRE", category: "keyspace" },
  { command: "PEXPIREAT", category: "keyspace" },
  {
    command: "RENAME",
    category: "keyspace",
    keyPattern: { type: "indexes", indexes: [1, 2] },
  },
  {
    command: "RENAMENX",
    category: "keyspace",
    keyPattern: { type: "indexes", indexes: [1, 2] },
  },
  //"UNLINK",
  //"MIGRATE",
  //"MOVE",
  //"RESTORE",
  //"TOUCH",

  // RedisJSON module commands
  { command: "JSON.SET", category: "json", canDbInsert: true },
  {
    command: "JSON.MSET",
    category: "json",
    keyPattern: { type: "step", start: 1, step: 3 },
    canDbInsert: true,
  },
  {
    command: "JSON.MSETNX",
    category: "json",
    keyPattern: { type: "step", start: 1, step: 3 },
    canDbInsert: true,
  },
  { command: "JSON.DEL", category: "json" },
  { command: "JSON.NUMINCRBY", category: "json", canDbInsert: true },
  { command: "JSON.NUMMULTBY", category: "json", canDbInsert: true },
  { command: "JSON.STRAPPEND", category: "json", canDbInsert: true },
  { command: "JSON.ARRAPPEND", category: "json", canDbInsert: true },
  { command: "JSON.ARRINSERT", category: "json", canDbInsert: true },
  { command: "JSON.ARRPOP", category: "json" },
  { command: "JSON.ARRTRIM", category: "json" },
  //"JSON.CLEAR",
  { command: "JSON.TOGGLE", category: "json", canDbInsert: true },
  { command: "JSON.MERGE", category: "json", canDbInsert: true },
  { command: "JSON.PATCH", category: "json", canDbInsert: true },

  // RediSearch module commands
  { command: "FT.CREATE", category: "search" },
  { command: "FT.ALTER", category: "search" },
  //"FT.DROPINDEX",
  { command: "FT.ADD", category: "search" },
  //"FT.DEL",
  { command: "FT.SUGADD", category: "search", canDbInsert: true },
  { command: "FT.SUGDEL", category: "search" },
  { command: "FT.SUGLEN", category: "search" },
  { command: "FT.SUGGET", category: "search" },
  { command: "FT.AGGREGATE", category: "search" },

  // TimeSeries module commands
  { command: "TS.ADD", category: "timeseries", canDbInsert: true },
  {
    command: "TS.MADD",
    category: "timeseries",
    keyPattern: { type: "step", start: 1, step: 3 },
    canDbInsert: true,
  },
  { command: "TS.INCRBY", category: "timeseries", canDbInsert: true },
  { command: "TS.DECRBY", category: "timeseries", canDbInsert: true },
  { command: "TS.CREATE", category: "timeseries", canDbInsert: true },
  { command: "TS.ALTER", category: "timeseries" },
  {
    command: "TS.CREATERULE",
    category: "timeseries",
    keyPattern: { type: "indexes", indexes: [1, 2] },
    canDbInsert: true,
  },
  {
    command: "TS.DELETERULE",
    category: "timeseries",
    keyPattern: { type: "indexes", indexes: [1, 2] },
  },
];

const REDIS_READ_COMMANDS: IRedisCommandPattern[] = [
  // RediSearch commands
  { command: "FT.INFO", category: "search" },
  { command: "FT.SEARCH", category: "search" },
  { command: "FT._LIST", category: "search", keyPattern: { type: "none" } },
  { command: "FT.EXPLAIN", category: "search" },
  { command: "FT.AGGREGATE", category: "search" },

  // RedisJSON commands
  { command: "JSON.GET", category: "json" },
  {
    command: "JSON.MGET",
    category: "json",
    keyPattern: { type: "from", start: 1 },
    matchPatternToStop: ["$", /^\$/],
  },
  { command: "JSON.TYPE", category: "json" },
  { command: "JSON.STRLEN", category: "json" },
  { command: "JSON.OBJKEYS", category: "json" },
  { command: "JSON.OBJLEN", category: "json" },
  {
    command: "JSON.DEBUG",
    category: "json",
    keyPattern: { type: "from", start: 2 },
    matchPatternToStop: ["$", /^\$/],
  },
  { command: "JSON.RESP", category: "json" },

  // Redis Core read commands
  { command: "GET", category: "core" },
  { command: "MGET", category: "core", keyPattern: { type: "from", start: 1 } },
  {
    command: "EXISTS",
    category: "core",
    keyPattern: { type: "from", start: 1 },
  },
  { command: "TYPE", category: "core" },
  { command: "STRLEN", category: "core" },
  { command: "LLEN", category: "core" },
  { command: "SCARD", category: "core" },
  { command: "ZCARD", category: "core" },
  { command: "HLEN", category: "core" },
  { command: "HGET", category: "core" },
  { command: "HMGET", category: "core" },
  { command: "HGETALL", category: "core" },
  { command: "HEXISTS", category: "core" },
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
  REDIS_WRITE_COMMANDS,
  REDIS_READ_COMMANDS,
};

export type { DisableJsFlagsType, IRedisCommandPattern };
