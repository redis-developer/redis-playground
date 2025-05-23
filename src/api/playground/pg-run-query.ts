import type { QueryIdType } from "../../data/queries/index.js";
import { z } from "zod";

import * as InputSchemas from "../../input-schema.js";
import { RedisWrapperST } from "../../utils/redis.js";
import { CustomErrorCls } from "../../utils/logger.js";
import { getQueryDataById } from "../../data/queries/index.js";
import { MAX_CUSTOM_QUERY_SIZE, REDIS_KEYS } from "../../config.js";
import {
  replaceKeyPrefixInQuery,
  replaceKeyPrefixInResult,
  verifyCommandPrefix,
  isUserDataActive,
  getUserDataKeyPrefix,
} from "./new-user-data/user-data-config.js";
import { pgResetUserDataExpiry } from "./new-user-data/pg-reset-user-data-expiry.js";
import { pgGetNewUserId } from "./new-user-data/pg-get-new-user-id.js";

const pgRunQuery = async (
  input: z.infer<typeof InputSchemas.pgRunQuerySchema>
) => {
  /**
   *  - If userId is expired then make it empty
   *  - (validation) keys in query must have prefix eg: "pg:key"
   *  - if write command and no userId is passed then generate new userId
   *  - (before execution) modify keys in query to have userId prefix   (replaceKeyPrefixInQuery)
   *  - (after execution) modify keys in result to remove userId prefix  (replaceKeyPrefixInResult)
   *  - Add expiry to new write keys
   *  - (In background) if userId is passed then check and extend user data expiry for existing data
   */
  InputSchemas.pgRunQuerySchema.parse(input); // validate input

  if (input.customQuery && input.customQuery.length > MAX_CUSTOM_QUERY_SIZE) {
    // to prevent large query
    throw {
      userMessage: `Custom query size exceeds maximum limit!`,
      message: `Custom query size exceeds maximum limit ${MAX_CUSTOM_QUERY_SIZE} characters`,
    };
  }
  let runQuery = "";
  let genUserId = input.userId || "";

  if (genUserId) {
    const isActive = await isUserDataActive(genUserId);
    if (!isActive) {
      genUserId = "";
      input.userId = "";
    }
  }

  if (input.customQuery) {
    runQuery = input.customQuery;
  } else if (input.queryId) {
    const queryData = await getQueryDataById(input.queryId as QueryIdType);
    if (queryData?.query) {
      runQuery = queryData.query;
    }
  }

  if (!runQuery) {
    throw new CustomErrorCls(
      `No query provided!`,
      `Please provide a valid query.`
    );
  }

  const cmdDetails = verifyCommandPrefix(runQuery, REDIS_KEYS.PREFIX.APP);

  if (!cmdDetails.isPrefixExists) {
    throw new CustomErrorCls(
      `Command keys without prefix are not allowed!`,
      `Please add prefix ${REDIS_KEYS.PREFIX.APP} to the command keys.`
    );
  }

  if (cmdDetails.isWriteCmd && !genUserId) {
    genUserId = await pgGetNewUserId();
  }

  const redisWrapperST = RedisWrapperST.getInstance();
  let result: any = {};

  if (runQuery) {
    if (genUserId) {
      runQuery = replaceKeyPrefixInQuery(runQuery, genUserId);
    }

    result = await redisWrapperST.rawCommandExecute(runQuery);

    if (genUserId) {
      result = replaceKeyPrefixInResult(result, genUserId);
    }
  }

  if (
    genUserId &&
    cmdDetails.cmdPattern?.canDbInsert &&
    cmdDetails.checkedKeys.length > 0
  ) {
    // TTL to the new write keys
    let expiry = REDIS_KEYS.EXPIRY.USER_DATA_EXPIRY_IN_HOURS * 60 * 60; //seconds
    let keyPrefix = getUserDataKeyPrefix(genUserId);
    for (let key of cmdDetails.checkedKeys) {
      key = keyPrefix + key;
      await redisWrapperST.client?.expire(key, expiry);
    }
  }

  if (input.userId) {
    //userId from input only (not genUserId)
    //(async) check if expiry to be extended when a user query is run
    pgResetUserDataExpiry({
      userId: input.userId,
    });
  }

  return {
    queryResult: result,
    userId: genUserId,
  };
};

export { pgRunQuery };
