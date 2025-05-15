import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import * as InputSchemas from "../../input-schema.js";
import { RedisWrapperST } from "../../utils/redis.js";
import { REDIS_KEYS, MAX_CUSTOM_QUERY_SIZE } from "../../config.js";
import { getUserDataKeyPrefix } from "./new-user-data/user-data-config.js";

const pgSaveQuery = async (
  input: z.infer<typeof InputSchemas.pgSaveQuerySchema>
) => {
  InputSchemas.pgSaveQuerySchema.parse(input); // validate input

  if (input.customQuery.length > MAX_CUSTOM_QUERY_SIZE) {
    throw {
      userMessage: `Custom query size exceeds maximum limit!`,
      message: `Custom query size exceeds maximum limit ${MAX_CUSTOM_QUERY_SIZE} characters`,
    };
  }

  const redisWrapperST = RedisWrapperST.getInstance();
  let result: any = {};
  let userId = input.userId || "";
  let globalPrefix = "";

  if (userId) {
    globalPrefix = getUserDataKeyPrefix(userId);
  }

  const partialId = input.partialId || uuidv4();

  let key =
    globalPrefix +
    REDIS_KEYS.PREFIX.APP +
    REDIS_KEYS.PREFIX.SAVED_QUERIES +
    partialId;

  let jsonVal = {
    _id: key,
    customQuery: input.customQuery,
    createdOn: new Date().toISOString(),
    title: input.title || "",
    categoryId: input.categoryId || "",
    queryId: input.queryId || "",
  };

  await redisWrapperST.client?.json.set(key, ".", jsonVal);

  let expiry = 0;
  if (!userId) {
    expiry = REDIS_KEYS.EXPIRY.NON_USER_SAVED_QUERY_EXPIRY_IN_HOURS * 60 * 60; //seconds
  } else {
    expiry = REDIS_KEYS.EXPIRY.USER_DATA_EXPIRY_IN_HOURS * 60 * 60; //seconds
  }

  if (expiry) {
    await redisWrapperST.client?.expire(key, expiry);
  }

  result = {
    _id: key,
  };

  return result;
};

export { pgSaveQuery };
