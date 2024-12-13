import type { QueryIdType } from "../../data/queries/index.js";
import { z } from "zod";

import * as InputSchemas from "../../input-schema.js";
import { RedisWrapperST } from "../../utils/redis.js";
import { getQueryDataById } from "../../data/queries/index.js";

const pgRunQuery = async (
  input: z.infer<typeof InputSchemas.pgRunQuerySchema>
) => {
  InputSchemas.pgRunQuerySchema.parse(input); // validate input
  const redisWrapperST = RedisWrapperST.getInstance();
  let result: any = {};

  if (input.customQuery) {
    result = redisWrapperST.rawCommandExecute(input.customQuery);
  } else if (input.queryId) {
    const queryData = await getQueryDataById(input.queryId as QueryIdType);
    if (queryData?.query) {
      result = redisWrapperST.rawCommandExecute(queryData.query);
    }
  }
  return result;
};

export { pgRunQuery };
