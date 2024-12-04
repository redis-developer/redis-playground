import type { IDbIndex } from "../../config.js";

import { z } from "zod";

import * as InputSchemas from "../../input-schema.js";
import { DATA_SOURCES, DB_INDEXES, REDIS_KEYS } from "../../config.js";
import { RedisWrapperST } from "../../utils/redis.js";
import { getFilteredDbIndexes } from "./pg-get-db-index-by-id.js";

const createDbIndex = async (dbIndex: IDbIndex) => {
  let retObj: any = {};
  const redisWrapperST = RedisWrapperST.getInstance();

  if (dbIndex) {
    const dataSource = DATA_SOURCES.find(
      (ds) => ds.dataSourceId === dbIndex.dataSourceId
    );

    if (dataSource) {
      const keyPrefix = REDIS_KEYS.PREFIX.APP + (dataSource.keyPrefix || "");
      const dbIndexName = REDIS_KEYS.PREFIX.APP + dbIndex.dbIndexName;

      let dbIndexQuery = dbIndex.dbIndexQuery;
      dbIndexQuery = dbIndexQuery.replace("{dbIndexName}", dbIndexName);
      dbIndexQuery = dbIndexQuery.replace("{keyPrefix}", keyPrefix);

      await redisWrapperST.dropIndex(dbIndexName);
      const status = await redisWrapperST.rawCommandExecute(dbIndexQuery);

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
  let filteredDbIndexes = getFilteredDbIndexes(input.dbIndexIds, input.isAll);

  if (filteredDbIndexes.length > 0) {
    for (const dbIndex of filteredDbIndexes) {
      const retObj = await createDbIndex(dbIndex);
      retObjArr.push(retObj);
    }
  }

  return retObjArr;
};

export { pgCreateIndexInRedis };
