import { z } from "zod";

import * as InputSchemas from "../../input-schema.js";
import { RedisWrapperST } from "../../utils/redis.js";
import { REDIS_KEYS } from "../../config.js";
import {
  getUserDataKeyPrefix,
  isUserDataActive,
} from "./new-user-data/user-data-config.js";

const pgGetSavedQuery = async (
  input: z.infer<typeof InputSchemas.pgGetSavedQuerySchema>
) => {
  InputSchemas.pgGetSavedQuerySchema.parse(input); // validate input

  const redisWrapperST = RedisWrapperST.getInstance();
  let userId = input.userId || "";
  let globalPrefix = "";

  if (userId) {
    const isActive = await isUserDataActive(userId);
    if (!isActive) {
      throw {
        userMessage: `User ${userId} is not active`,
        message: `User ${userId} is not active`,
      };
    }

    globalPrefix = getUserDataKeyPrefix(userId);
  }

  let key =
    globalPrefix +
    REDIS_KEYS.PREFIX.APP +
    REDIS_KEYS.PREFIX.SAVED_QUERIES +
    input.partialId;

  let result = await redisWrapperST.client?.json.get(key);

  return result;
};

export { pgGetSavedQuery };
