import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import * as InputSchemas from "../../input-schema.js";
import { RedisWrapperST } from "../../utils/redis.js";
import { REDIS_KEYS } from "../../config.js";

const pgSaveQuery = async (
  input: z.infer<typeof InputSchemas.pgSaveQuerySchema>
) => {
  InputSchemas.pgSaveQuerySchema.parse(input); // validate input

  const redisWrapperST = RedisWrapperST.getInstance();
  let result: any = {};

  const partialId = input.partialId || uuidv4();

  let key = REDIS_KEYS.PREFIX.APP + REDIS_KEYS.PREFIX.SAVED_QUERIES + partialId;
  let expiry = 60 * 60 * 24 * 30; // 30 days

  let jsonVal = {
    _id: key,
    customQuery: input.customQuery,
    createdOn: new Date().toISOString(),
    title: input.title || "",
    categoryId: input.categoryId || "",
    queryId: input.queryId || "",
  };

  await redisWrapperST.client?.json.set(key, ".", jsonVal);
  await redisWrapperST.client?.expire(key, expiry);

  result = {
    _id: key,
  };

  return result;
};

export { pgSaveQuery };
