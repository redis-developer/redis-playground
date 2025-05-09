import type { QueryIdType } from "../../data/queries/index.js";
import { z } from "zod";

import * as InputSchemas from "../../input-schema.js";
import { RedisWrapperST } from "../../utils/redis.js";
import { getQueryDataById } from "../../data/queries/index.js";
import { MAX_CUSTOM_QUERY_SIZE } from "../../config.js";
import {
  replaceKeyPrefixInQuery,
  replaceKeyPrefixInResult,
} from "./new-user-data/user-data-config.js";
import { pgResetUserDataExpiry } from "./new-user-data/pg-reset-user-data-expiry.js";

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
  const checkUserDataExpiry = input.userId ? true : false;
  let genUserId = input.userId || "";

  //-----
  // if no userId, and write command passed , then getNewUserId()
  //------

  const redisWrapperST = RedisWrapperST.getInstance();
  let result: any = {};

  if (input.customQuery) {
    const runQuery = replaceKeyPrefixInQuery(input.customQuery, genUserId);
    result = await redisWrapperST.rawCommandExecute(runQuery);
  } else if (input.queryId) {
    const queryData = await getQueryDataById(input.queryId as QueryIdType);
    if (queryData?.query) {
      const runQuery = replaceKeyPrefixInQuery(queryData.query, genUserId);
      result = await redisWrapperST.rawCommandExecute(runQuery);
    }
  } else {
    throw new Error("No query provided!");
  }

  result = replaceKeyPrefixInResult(result, genUserId);

  if (checkUserDataExpiry) {
    //(async) check if expiry to be extended when a user query is run
    pgResetUserDataExpiry({
      userId: input.userId || "", //userId from input only
    });
  }

  return result;
};

export { pgRunQuery };
