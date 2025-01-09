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

  let key = REDIS_KEYS.PREFIX.APP + REDIS_KEYS.PREFIX.SAVED_QUERIES + uuidv4();
  let expiry = 60 * 60 * 24 * 7; // 7 days

  let jsonVal = {
    _id: key,
    customQuery: input.customQuery,
    createdOn: new Date().toISOString(),
    title: input.title || "",
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
