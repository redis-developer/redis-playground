import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import * as InputSchemas from "../../../input-schema.js";
import { pgLoadDataSourceInRedis } from "../pg-load-data-source-in-redis.js";
import { pgCreateIndexInRedis } from "../pg-create-index-in-redis.js";
import { RedisWrapperST } from "../../../utils/redis.js";
import { USER_DATA_STATUS } from "../../../utils/constants.js";
import { getUserDataKeyPrefix, setUserDataInfo } from "./user-data-config.js";
import { REDIS_KEYS } from "../../../config.js";

const pgGenerateNewUserData = async (
  input: z.infer<typeof InputSchemas.pgGenerateNewUserDataSchema>
) => {
  InputSchemas.pgGenerateNewUserDataSchema.parse(input); // validate input

  const redisWrapperST = RedisWrapperST.getInstance();
  let userId = input.customUserId || uuidv4();
  let globalPrefix = getUserDataKeyPrefix(userId);

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

  await setUserDataInfo(userId, "userId", userId);

  await setUserDataInfo(
    userId,
    REDIS_KEYS.LABELS.USER_INFO_DATA_STATUS,
    USER_DATA_STATUS.UNUSED
  );

  return {
    pgLoadDataSourceInRedis: loadDataSourceObjArr,
    pgCreateIndexInRedis: createIndexObjArr,
    userId: userId,
  };
};

export { pgGenerateNewUserData };
