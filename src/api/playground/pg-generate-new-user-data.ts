import type { IDbIndex } from "../../config.js";

import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import * as InputSchemas from "../../input-schema.js";
import { pgLoadDataSourceInRedis } from "./pg-load-data-source-in-redis.js";
import { pgCreateIndexInRedis } from "./pg-create-index-in-redis.js";
import { REDIS_KEYS } from "../../config.js";

const pgGenerateNewUserData = async (
  input: z.infer<typeof InputSchemas.pgGenerateNewUserDataSchema>
) => {
  InputSchemas.pgGenerateNewUserDataSchema.parse(input); // validate input

  let userId = input.userId || uuidv4();
  let globalPrefix =
    REDIS_KEYS.PREFIX.WRITABLE_APP + REDIS_KEYS.PREFIX.USER_DATA + userId + ":";

  let loadDataSourceObjArr = await pgLoadDataSourceInRedis({
    dataSourceIds: input.dataSourceIds || [],
    isAll: input.isAll,
    globalPrefix: globalPrefix,
  });

  let createIndexObjArr = await pgCreateIndexInRedis({
    dbIndexIds: input.dbIndexIds || [],
    isAll: input.isAll,
    globalPrefix: globalPrefix,
  });

  return {
    pgLoadDataSourceInRedis: loadDataSourceObjArr,
    pgCreateIndexInRedis: createIndexObjArr,
  };
};

export { pgGenerateNewUserData };
