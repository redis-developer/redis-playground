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

const REDIS_ALLOWED_COMMANDS = [
  // RediSearch commands
  "FT.INFO",
  "FT.SEARCH",
  "FT._LIST",
  "FT.EXPLAIN",

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

type DisableJsFlagsType = {
  [key in keyof typeof DISABLE_JS_FLAGS]: boolean;
};

export {
  HTTP_STATUS_CODES,
  DISABLE_JS_DATA,
  DISABLE_JS_FLAGS,
  UPLOAD_TYPES_FOR_IMPORT,
  ImportStatus,
  REDIS_ALLOWED_COMMANDS,
};

export type { DisableJsFlagsType };
