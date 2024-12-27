import type { IDbIndex } from "../../config.js";

import { z } from "zod";

import * as InputSchemas from "../../input-schema.js";
import { RedisWrapperST } from "../../utils/redis.js";
import { getFilteredDbIndexes } from "../../config.js";

const createDbIndex = async (dbIndex: IDbIndex) => {
  let retObj: any = {};
  const redisWrapperST = RedisWrapperST.getInstance();

  if (dbIndex) {
    await redisWrapperST.dropIndex(dbIndex.dbIndexName);
    const status = await redisWrapperST.rawCommandExecute(
      dbIndex.dbIndexQuery,
      true
    );

    retObj = {
      dbIndexId: dbIndex.dbIndexId,
      dbIndexStatus: status,
    };
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
