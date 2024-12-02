import type { IDbIndex } from "../../config.js";

import { z } from "zod";

import * as InputSchemas from "../../input-schema.js";
import { DATA_SOURCES, DB_INDEXES, REDIS_KEYS } from "../../config.js";
import { RedisWrapper } from "../../utils/redis.js";

const createDbIndex = async (dbIndex: IDbIndex, redisWrapper: RedisWrapper) => {
  let retObj: any = {};

  if (dbIndex && redisWrapper) {
    const dataSource = DATA_SOURCES.find(
      (ds) => ds.dataSourceId === dbIndex.dataSourceId
    );

    if (dataSource) {
      const keyPrefix = REDIS_KEYS.PREFIX.APP + (dataSource.keyPrefix || "");
      const dbIndexName = REDIS_KEYS.PREFIX.APP + dbIndex.dbIndexName;

      let dbIndexQuery = dbIndex.dbIndexQuery;
      dbIndexQuery = dbIndexQuery.replace("{dbIndexName}", dbIndexName);
      dbIndexQuery = dbIndexQuery.replace("{keyPrefix}", keyPrefix);

      await redisWrapper.dropIndex(dbIndexName);
      const status = await redisWrapper.rawCommandExecute(dbIndexQuery);

      retObj = {
        dbIndexId: dbIndex.dbIndexId,
        dbIndexStatus: status,
      };
    }
  }

  return retObj;
};

const pgCreateIndexInRedis = async (
  input: z.infer<typeof InputSchemas.pgCreateIndexInRedisSchema>
) => {
  InputSchemas.pgCreateIndexInRedisSchema.parse(input); // validate input

  let retObjArr: any[] = [];
  let filteredDbIndexes: typeof DB_INDEXES = [];
  const redisConUrl = process.env.REDIS_URL || "";

  if (!redisConUrl) {
    throw new Error("Redis connection URL is not set !");
  }

  if (!input.dbIndexIds) {
    input.dbIndexIds = [];
  }

  const redisWrapper = new RedisWrapper(redisConUrl);
  await redisWrapper.connect();

  try {
    if (input.isAll) {
      filteredDbIndexes = DB_INDEXES;
    } else if (input.dbIndexIds.length > 0) {
      filteredDbIndexes = DB_INDEXES.filter((dbIndex) =>
        input.dbIndexIds.includes(dbIndex.dbIndexId)
      );
    }

    if (filteredDbIndexes.length > 0) {
      for (const dbIndex of filteredDbIndexes) {
        const retObj = await createDbIndex(dbIndex, redisWrapper);
        retObjArr.push(retObj);
      }
    }
  } finally {
    await redisWrapper.disconnect();
  }

  return retObjArr;
};

export { pgCreateIndexInRedis };
