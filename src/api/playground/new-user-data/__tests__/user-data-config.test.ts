import { describe, it, expect } from "vitest";
import { isRedisCommandHasPrefix } from "../user-data-config.js";
import { splitQuery } from "../../../../utils/redis.js";

const PREFIX = "pg:";

const realTestCases: Record<
  string,
  { query: string; expectAnswer: boolean; desc?: string }[]
> = {
  // String commands
  SET: [
    { query: "SET pg:key value", expectAnswer: true },
    { query: "SET other:key value", expectAnswer: false },
  ],
  SETEX: [
    { query: "SETEX pg:key 60 value", expectAnswer: true },
    { query: "SETEX other:key 60 value", expectAnswer: false },
  ],
  SETNX: [
    { query: "SETNX pg:key value", expectAnswer: true },
    { query: "SETNX other:key value", expectAnswer: false },
  ],
  SETRANGE: [
    { query: "SETRANGE pg:key 0 value", expectAnswer: true },
    { query: "SETRANGE other:key 0 value", expectAnswer: false },
  ],
  APPEND: [
    { query: "APPEND pg:key value", expectAnswer: true },
    { query: "APPEND other:key value", expectAnswer: false },
  ],
  INCR: [
    { query: "INCR pg:key", expectAnswer: true },
    { query: "INCR other:key", expectAnswer: false },
  ],
  INCRBY: [
    { query: "INCRBY pg:key 1", expectAnswer: true },
    { query: "INCRBY other:key 1", expectAnswer: false },
  ],
  INCRBYFLOAT: [
    { query: "INCRBYFLOAT pg:key 1.1", expectAnswer: true },
    { query: "INCRBYFLOAT other:key 1.1", expectAnswer: false },
  ],
  DECR: [
    { query: "DECR pg:key", expectAnswer: true },
    { query: "DECR other:key", expectAnswer: false },
  ],
  DECRBY: [
    { query: "DECRBY pg:key 1", expectAnswer: true },
    { query: "DECRBY other:key 1", expectAnswer: false },
  ],
  MSET: [
    { query: "MSET pg:k1 v1 pg:k2 v2", expectAnswer: true },
    { query: "MSET pg:k1 v1 other:k2 v2", expectAnswer: false },
  ],
  MSETNX: [
    { query: "MSETNX pg:k1 v1 pg:k2 v2", expectAnswer: true },
    { query: "MSETNX pg:k1 v1 other:k2 v2", expectAnswer: false },
  ],
  PSETEX: [
    { query: "PSETEX pg:key 1000 value", expectAnswer: true },
    { query: "PSETEX other:key 1000 value", expectAnswer: false },
  ],
  GETSET: [
    { query: "GETSET pg:key value", expectAnswer: true },
    { query: "GETSET other:key value", expectAnswer: false },
  ],
  STRALGO: [
    { query: "STRALGO LCS pg:key other:key", expectAnswer: false },
    { query: "STRALGO LCS pg:key pg:key2", expectAnswer: true },
    { query: "STRALGO LCS other:key pg:key", expectAnswer: false },
  ],
  // Hash commands
  HSET: [
    { query: "HSET pg:hash field value", expectAnswer: true },
    { query: "HSET other:hash field value", expectAnswer: false },
  ],
  HSETNX: [
    { query: "HSETNX pg:hash field value", expectAnswer: true },
    { query: "HSETNX other:hash field value", expectAnswer: false },
  ],
  HMSET: [
    { query: "HMSET pg:hash field value", expectAnswer: true },
    { query: "HMSET other:hash field value", expectAnswer: false },
  ],
  HDEL: [
    { query: "HDEL pg:hash field", expectAnswer: true },
    { query: "HDEL other:hash field", expectAnswer: false },
  ],
  HINCRBY: [
    { query: "HINCRBY pg:hash field 1", expectAnswer: true },
    { query: "HINCRBY other:hash field 1", expectAnswer: false },
  ],
  HINCRBYFLOAT: [
    { query: "HINCRBYFLOAT pg:hash field 1.1", expectAnswer: true },
    { query: "HINCRBYFLOAT other:hash field 1.1", expectAnswer: false },
  ],
  // List commands
  LPUSH: [
    { query: "LPUSH pg:list a b c", expectAnswer: true },
    { query: "LPUSH other:list a b c", expectAnswer: false },
  ],
  LPUSHX: [
    { query: "LPUSHX pg:list a", expectAnswer: true },
    { query: "LPUSHX other:list a", expectAnswer: false },
  ],
  RPUSH: [
    { query: "RPUSH pg:list a b c", expectAnswer: true },
    { query: "RPUSH other:list a b c", expectAnswer: false },
  ],
  RPUSHX: [
    { query: "RPUSHX pg:list a", expectAnswer: true },
    { query: "RPUSHX other:list a", expectAnswer: false },
  ],
  LINSERT: [
    { query: "LINSERT pg:list BEFORE a b", expectAnswer: true },
    { query: "LINSERT other:list BEFORE a b", expectAnswer: false },
  ],
  LPOP: [
    { query: "LPOP pg:list", expectAnswer: true },
    { query: "LPOP other:list", expectAnswer: false },
  ],
  RPOP: [
    { query: "RPOP pg:list", expectAnswer: true },
    { query: "RPOP other:list", expectAnswer: false },
  ],
  LREM: [
    { query: "LREM pg:list 0 a", expectAnswer: true },
    { query: "LREM other:list 0 a", expectAnswer: false },
  ],
  LSET: [
    { query: "LSET pg:list 0 a", expectAnswer: true },
    { query: "LSET other:list 0 a", expectAnswer: false },
  ],
  LTRIM: [
    { query: "LTRIM pg:list 0 1", expectAnswer: true },
    { query: "LTRIM other:list 0 1", expectAnswer: false },
  ],
  RPOPLPUSH: [
    { query: "RPOPLPUSH pg:src pg:dest", expectAnswer: true },
    { query: "RPOPLPUSH other:src pg:dest", expectAnswer: false },
    { query: "RPOPLPUSH pg:src other:dest", expectAnswer: false },
  ],
  BLPOP: [
    { query: "BLPOP pg:list 0", expectAnswer: true },
    { query: "BLPOP other:list 0", expectAnswer: false },
  ],
  BRPOP: [
    { query: "BRPOP pg:list 0", expectAnswer: true },
    { query: "BRPOP other:list 0", expectAnswer: false },
  ],
  BRPOPLPUSH: [
    { query: "BRPOPLPUSH pg:src pg:dest", expectAnswer: true },
    { query: "BRPOPLPUSH other:src pg:dest", expectAnswer: false },
    { query: "BRPOPLPUSH pg:src other:dest", expectAnswer: false },
  ],
  // Set commands
  SADD: [
    { query: "SADD pg:set a b c", expectAnswer: true },
    { query: "SADD other:set a b c", expectAnswer: false },
  ],
  SREM: [
    { query: "SREM pg:set a b c", expectAnswer: true },
    { query: "SREM other:set a b c", expectAnswer: false },
  ],
  SMOVE: [
    { query: "SMOVE pg:src pg:dest a", expectAnswer: true },
    { query: "SMOVE other:src pg:dest a", expectAnswer: false },
    { query: "SMOVE pg:src other:dest a", expectAnswer: false },
  ],
  SPOP: [
    { query: "SPOP pg:set", expectAnswer: true },
    { query: "SPOP other:set", expectAnswer: false },
  ],
  SDIFFSTORE: [
    { query: "SDIFFSTORE pg:dest pg:k1 pg:k2", expectAnswer: true },
    { query: "SDIFFSTORE pg:dest other:k1 pg:k2", expectAnswer: false },
  ],
  SINTERSTORE: [
    { query: "SINTERSTORE pg:dest pg:k1 pg:k2", expectAnswer: true },
    { query: "SINTERSTORE pg:dest other:k1 pg:k2", expectAnswer: false },
  ],
  SUNIONSTORE: [
    { query: "SUNIONSTORE pg:dest pg:k1 pg:k2", expectAnswer: true },
    { query: "SUNIONSTORE pg:dest other:k1 pg:k2", expectAnswer: false },
  ],
  // Sorted Set commands
  ZADD: [
    { query: "ZADD pg:zset 1 a 2 b", expectAnswer: true },
    { query: "ZADD other:zset 1 a 2 b", expectAnswer: false },
  ],
  ZINCRBY: [
    { query: "ZINCRBY pg:zset 1 a", expectAnswer: true },
    { query: "ZINCRBY other:zset 1 a", expectAnswer: false },
  ],
  ZREM: [
    { query: "ZREM pg:zset a b", expectAnswer: true },
    { query: "ZREM other:zset a b", expectAnswer: false },
  ],
  ZREMRANGEBYRANK: [
    { query: "ZREMRANGEBYRANK pg:zset 0 1", expectAnswer: true },
    { query: "ZREMRANGEBYRANK other:zset 0 1", expectAnswer: false },
  ],
  ZREMRANGEBYSCORE: [
    { query: "ZREMRANGEBYSCORE pg:zset 0 1", expectAnswer: true },
    { query: "ZREMRANGEBYSCORE other:zset 0 1", expectAnswer: false },
  ],
  ZREMRANGEBYLEX: [
    { query: "ZREMRANGEBYLEX pg:zset [a [b", expectAnswer: true },
    { query: "ZREMRANGEBYLEX other:zset [a [b", expectAnswer: false },
  ],
  ZINTERSTORE: [
    { query: "ZINTERSTORE pg:dest 2 pg:k1 pg:k2", expectAnswer: true },
    { query: "ZINTERSTORE pg:dest 2 other:k1 pg:k2", expectAnswer: false },
  ],
  ZUNIONSTORE: [
    { query: "ZUNIONSTORE pg:dest 2 pg:k1 pg:k2", expectAnswer: true },
    { query: "ZUNIONSTORE pg:dest 2 other:k1 pg:k2", expectAnswer: false },
  ],
  BZPOPMIN: [
    { query: "BZPOPMIN pg:zset 0", expectAnswer: true },
    { query: "BZPOPMIN other:zset 0", expectAnswer: false },
  ],
  BZPOPMAX: [
    { query: "BZPOPMAX pg:zset 0", expectAnswer: true },
    { query: "BZPOPMAX other:zset 0", expectAnswer: false },
  ],
  ZPOPMIN: [
    { query: "ZPOPMIN pg:zset", expectAnswer: true },
    { query: "ZPOPMIN other:zset", expectAnswer: false },
  ],
  ZPOPMAX: [
    { query: "ZPOPMAX pg:zset", expectAnswer: true },
    { query: "ZPOPMAX other:zset", expectAnswer: false },
  ],
  // HyperLogLog commands
  PFADD: [
    { query: "PFADD pg:hll a b", expectAnswer: true },
    { query: "PFADD other:hll a b", expectAnswer: false },
  ],
  PFMERGE: [
    { query: "PFMERGE pg:hll1 pg:hll2", expectAnswer: true },
    { query: "PFMERGE other:hll1 pg:hll2", expectAnswer: false },
  ],
  // Bitmap commands
  SETBIT: [
    { query: "SETBIT pg:key 7 1", expectAnswer: true },
    { query: "SETBIT other:key 7 1", expectAnswer: false },
  ],
  BITOP: [
    { query: "BITOP AND pg:dest pg:k1 pg:k2", expectAnswer: true },
    { query: "BITOP AND pg:dest other:k1 pg:k2", expectAnswer: false },
  ],
  // Stream commands
  XADD: [
    { query: "XADD pg:stream * field value", expectAnswer: true },
    { query: "XADD other:stream * field value", expectAnswer: false },
  ],
  XDEL: [
    { query: "XDEL pg:stream id1 id2", expectAnswer: true },
    { query: "XDEL other:stream id1 id2", expectAnswer: false },
  ],
  XTRIM: [
    { query: "XTRIM pg:stream MAXLEN 1000", expectAnswer: true },
    { query: "XTRIM other:stream MAXLEN 1000", expectAnswer: false },
  ],
  "XGROUP CREATE": [
    { query: "XGROUP CREATE pg:stream $ mkstream", expectAnswer: true },
    { query: "XGROUP CREATE other:stream $ mkstream", expectAnswer: false },
  ],
  "XGROUP SETID": [
    { query: "XGROUP SETID pg:stream $", expectAnswer: true },
    { query: "XGROUP SETID other:stream $", expectAnswer: false },
  ],
  "XGROUP DESTROY": [
    { query: "XGROUP DESTROY pg:stream group", expectAnswer: true },
    { query: "XGROUP DESTROY other:stream group", expectAnswer: false },
  ],
  "XGROUP DELCONSUMER": [
    {
      query: "XGROUP DELCONSUMER pg:stream group consumer",
      expectAnswer: true,
    },
    {
      query: "XGROUP DELCONSUMER other:stream group consumer",
      expectAnswer: false,
    },
  ],
  XACK: [
    { query: "XACK pg:stream group id1", expectAnswer: true },
    { query: "XACK other:stream group id1", expectAnswer: false },
  ],
  XCLAIM: [
    { query: "XCLAIM pg:stream group consumer 0 id1", expectAnswer: true },
    { query: "XCLAIM other:stream group consumer 0 id1", expectAnswer: false },
  ],
  XAUTOCLAIM: [
    { query: "XAUTOCLAIM pg:stream group 0 id1", expectAnswer: true },
    { query: "XAUTOCLAIM other:stream group 0 id1", expectAnswer: false },
  ],
  // Geo commands
  GEOADD: [
    { query: "GEOADD pg:geo 13.361389 38.115556 Palermo", expectAnswer: true },
    {
      query: "GEOADD other:geo 13.361389 38.115556 Palermo",
      expectAnswer: false,
    },
  ],
  GEOHASH: [
    { query: "GEOHASH pg:geo member1", expectAnswer: true },
    { query: "GEOHASH other:geo member1", expectAnswer: false },
  ],
  GEORADIUS: [
    { query: "GEORADIUS pg:geo 15 37 200 km", expectAnswer: true },
    { query: "GEORADIUS other:geo 15 37 200 km", expectAnswer: false },
  ],
  GEORADIUSBYMEMBER: [
    { query: "GEORADIUSBYMEMBER pg:geo member 200 km", expectAnswer: true },
    { query: "GEORADIUSBYMEMBER other:geo member 200 km", expectAnswer: false },
  ],
  GEOSEARCH: [
    {
      query: "GEOSEARCH pg:geo FROMMEMBER member BYRADIUS 10 km",
      expectAnswer: true,
    },
    {
      query: "GEOSEARCH other:geo FROMMEMBER member BYRADIUS 10 km",
      expectAnswer: false,
    },
    {
      query: "GEOSEARCH pg:geo FROMLONLAT 15 37 BYRADIUS 10 km",
      expectAnswer: true,
    },
    {
      query: "GEOSEARCH other:geo FROMLONLAT 15 37 BYRADIUS 10 km",
      expectAnswer: false,
    },
    {
      query: "GEOSEARCH pg:geo FROMMEMBER member BYBOX 10 10 km",
      expectAnswer: true,
    },
    {
      query: "GEOSEARCH other:geo FROMMEMBER member BYBOX 10 10 km",
      expectAnswer: false,
    },
  ],
  // Keyspace (generic) commands
  EXPIRE: [
    { query: "EXPIRE pg:key 60", expectAnswer: true },
    { query: "EXPIRE other:key 60", expectAnswer: false },
  ],
  EXPIREAT: [
    { query: "EXPIREAT pg:key 1620000000", expectAnswer: true },
    { query: "EXPIREAT other:key 1620000000", expectAnswer: false },
  ],
  PERSIST: [
    { query: "PERSIST pg:key", expectAnswer: true },
    { query: "PERSIST other:key", expectAnswer: false },
  ],
  PEXPIRE: [
    { query: "PEXPIRE pg:key 60000", expectAnswer: true },
    { query: "PEXPIRE other:key 60000", expectAnswer: false },
  ],
  PEXPIREAT: [
    { query: "PEXPIREAT pg:key 1620000000000", expectAnswer: true },
    { query: "PEXPIREAT other:key 1620000000000", expectAnswer: false },
  ],
  RENAME: [
    { query: "RENAME pg:foo pg:bar", expectAnswer: true },
    { query: "RENAME other:foo pg:bar", expectAnswer: false },
  ],
  RENAMENX: [
    { query: "RENAMENX pg:foo pg:bar", expectAnswer: true },
    { query: "RENAMENX other:foo pg:bar", expectAnswer: false },
  ],
  // RedisJSON module commands
  "JSON.SET": [
    { query: "JSON.SET pg:doc $ '{}'", expectAnswer: true },
    { query: "JSON.SET other:doc $ '{}'", expectAnswer: false },
  ],
  "JSON.MSET": [
    { query: "JSON.MSET pg:doc1 $ '{}' pg:doc2 $ '{}'", expectAnswer: true },
    {
      query: "JSON.MSET pg:doc1 $ '{}' other:doc2 $ '{}'",
      expectAnswer: false,
    },
  ],
  "JSON.MSETNX": [
    { query: "JSON.MSETNX pg:doc1 $ '{}' pg:doc2 $ '{}'", expectAnswer: true },
    {
      query: "JSON.MSETNX pg:doc1 $ '{}' other:doc2 $ '{}'",
      expectAnswer: false,
    },
  ],
  "JSON.DEL": [
    { query: "JSON.DEL pg:doc $", expectAnswer: true },
    { query: "JSON.DEL other:doc $", expectAnswer: false },
  ],
  "JSON.NUMINCRBY": [
    { query: "JSON.NUMINCRBY pg:doc $ 1", expectAnswer: true },
    { query: "JSON.NUMINCRBY other:doc $ 1", expectAnswer: false },
  ],
  "JSON.NUMMULTBY": [
    { query: "JSON.NUMMULTBY pg:doc $ 2", expectAnswer: true },
    { query: "JSON.NUMMULTBY other:doc $ 2", expectAnswer: false },
  ],
  "JSON.STRAPPEND": [
    { query: 'JSON.STRAPPEND pg:doc $ "foo"', expectAnswer: true },
    { query: 'JSON.STRAPPEND other:doc $ "foo"', expectAnswer: false },
  ],
  "JSON.ARRAPPEND": [
    { query: "JSON.ARRAPPEND pg:doc $ 1", expectAnswer: true },
    { query: "JSON.ARRAPPEND other:doc $ 1", expectAnswer: false },
  ],
  "JSON.ARRINSERT": [
    { query: "JSON.ARRINSERT pg:doc $ 0 1", expectAnswer: true },
    { query: "JSON.ARRINSERT other:doc $ 0 1", expectAnswer: false },
  ],
  "JSON.ARRPOP": [
    { query: "JSON.ARRPOP pg:doc $", expectAnswer: true },
    { query: "JSON.ARRPOP other:doc $", expectAnswer: false },
  ],
  "JSON.ARRTRIM": [
    { query: "JSON.ARRTRIM pg:doc $ 0 1", expectAnswer: true },
    { query: "JSON.ARRTRIM other:doc $ 0 1", expectAnswer: false },
  ],
  "JSON.TOGGLE": [
    { query: "JSON.TOGGLE pg:doc $", expectAnswer: true },
    { query: "JSON.TOGGLE other:doc $", expectAnswer: false },
  ],
  "JSON.MERGE": [
    { query: "JSON.MERGE pg:doc $ '{}'", expectAnswer: true },
    { query: "JSON.MERGE other:doc $ '{}'", expectAnswer: false },
  ],
  "JSON.PATCH": [
    { query: "JSON.PATCH pg:doc $ '{}'", expectAnswer: true },
    { query: "JSON.PATCH other:doc $ '{}'", expectAnswer: false },
  ],
  // RediSearch module commands
  "FT.CREATE": [
    { query: "FT.CREATE pg:index ON HASH PREFIX 1 pg:", expectAnswer: true },
    {
      query: "FT.CREATE other:index ON HASH PREFIX 1 other:",
      expectAnswer: false,
    },
  ],
  "FT.ALTER": [
    { query: "FT.ALTER pg:index SCHEMA ADD field TEXT", expectAnswer: true },
    {
      query: "FT.ALTER other:index SCHEMA ADD field TEXT",
      expectAnswer: false,
    },
  ],
  "FT.ADD": [
    {
      query: "FT.ADD pg:index doc1 1.0 FIELDS field value",
      expectAnswer: true,
    },
    {
      query: "FT.ADD other:index doc1 1.0 FIELDS field value",
      expectAnswer: false,
    },
  ],
  "FT.SUGADD": [
    { query: "FT.SUGADD pg:sug foo 1", expectAnswer: true },
    { query: "FT.SUGADD other:sug foo 1", expectAnswer: false },
  ],
  "FT.SUGDEL": [
    { query: "FT.SUGDEL pg:sug foo", expectAnswer: true },
    { query: "FT.SUGDEL other:sug foo", expectAnswer: false },
  ],
  "FT.SUGLEN": [
    { query: "FT.SUGLEN pg:sug", expectAnswer: true },
    { query: "FT.SUGLEN other:sug", expectAnswer: false },
  ],
  "FT.SUGGET": [
    { query: "FT.SUGGET pg:sug foo", expectAnswer: true },
    { query: "FT.SUGGET other:sug foo", expectAnswer: false },
  ],
  "FT.AGGREGATE": [
    { query: 'FT.AGGREGATE pg:index "*"', expectAnswer: true },
    { query: 'FT.AGGREGATE other:index "*"', expectAnswer: false },
  ],
  // TimeSeries module commands
  "TS.ADD": [
    { query: "TS.ADD pg:ts * 1", expectAnswer: true },
    { query: "TS.ADD other:ts * 1", expectAnswer: false },
  ],
  "TS.MADD": [
    { query: "TS.MADD pg:ts * 1 pg:ts2 * 2", expectAnswer: true },
    { query: "TS.MADD pg:ts * 1 other:ts2 * 2", expectAnswer: false },
  ],
  "TS.INCRBY": [
    { query: "TS.INCRBY pg:ts 1", expectAnswer: true },
    { query: "TS.INCRBY other:ts 1", expectAnswer: false },
  ],
  "TS.DECRBY": [
    { query: "TS.DECRBY pg:ts 1", expectAnswer: true },
    { query: "TS.DECRBY other:ts 1", expectAnswer: false },
  ],
  "TS.CREATE": [
    { query: "TS.CREATE pg:ts", expectAnswer: true },
    { query: "TS.CREATE other:ts", expectAnswer: false },
  ],
  "TS.ALTER": [
    { query: "TS.ALTER pg:ts LABELS foo bar", expectAnswer: true },
    { query: "TS.ALTER other:ts LABELS foo bar", expectAnswer: false },
  ],
  "TS.CREATERULE": [
    {
      query: "TS.CREATERULE pg:src pg:dest AGGREGATION avg 60",
      expectAnswer: true,
    },
    {
      query: "TS.CREATERULE other:src pg:dest AGGREGATION avg 60",
      expectAnswer: false,
    },
    {
      query: "TS.CREATERULE pg:src other:dest AGGREGATION avg 60",
      expectAnswer: false,
    },
  ],
  "TS.DELETERULE": [
    { query: "TS.DELETERULE pg:src pg:dest", expectAnswer: true },
    { query: "TS.DELETERULE other:src pg:dest", expectAnswer: false },
    { query: "TS.DELETERULE pg:src other:dest", expectAnswer: false },
  ],
};

function runRealTestCases() {
  Object.entries(realTestCases).forEach(([cmd, cases]) => {
    describe(cmd, () => {
      cases.forEach(({ query, expectAnswer, desc }) => {
        it(desc || `returns ${expectAnswer} for: ${query}`, () => {
          const result = isRedisCommandHasPrefix(query, PREFIX);
          if (!result === expectAnswer) {
            // Debug output for failing cases
            // eslint-disable-next-line no-console
            console.log(
              `DEBUG: cmd=${cmd}, query='${query}', splitQuery=`,
              splitQuery(query)
            );
          }
          expect(result).toBe(expectAnswer);
        });
      });
    });
  });
}

describe("isRedisCommandHasPrefix (real queries)", () => {
  runRealTestCases();

  it("returns false for empty command", () => {
    expect(isRedisCommandHasPrefix("", PREFIX)).toBe(false);
  });
  it("returns false for empty prefix", () => {
    expect(isRedisCommandHasPrefix("SET pg:key value", "")).toBe(false);
  });
  it("returns false for non-write command", () => {
    expect(isRedisCommandHasPrefix("GET pg:key", PREFIX)).toBe(false);
  });
});
