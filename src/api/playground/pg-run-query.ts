import type { QueryIdType } from "../../data/queries/index.js";
import { z } from "zod";

import * as InputSchemas from "../../input-schema.js";
import { RedisWrapperST } from "../../utils/redis.js";
import { getQueryDataById } from "../../data/queries/index.js";
import { MAX_CUSTOM_QUERY_SIZE } from "../../config.js";

const pgRunQuery = async (
  input: z.infer<typeof InputSchemas.pgRunQuerySchema>
) => {
  InputSchemas.pgRunQuerySchema.parse(input); // validate input

  if (input.customQuery && input.customQuery.length > MAX_CUSTOM_QUERY_SIZE) {
    throw {
      userMessage: `Custom query size exceeds maximum limit!`,
      message: `Custom query size exceeds maximum limit ${MAX_CUSTOM_QUERY_SIZE} characters`,
    };
  }

  const redisWrapperST = RedisWrapperST.getInstance();
  let result: any = {};

  if (input.customQuery) {
    result = redisWrapperST.rawCommandExecute(input.customQuery);
  } else if (input.queryId) {
    const queryData = await getQueryDataById(input.queryId as QueryIdType);
    if (queryData?.query) {
      result = redisWrapperST.rawCommandExecute(queryData.query);
    }
  } else {
    throw new Error("No query provided!");
  }
  return result;
};

export { pgRunQuery };
