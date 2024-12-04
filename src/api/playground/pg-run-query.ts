import type { QueryIdType } from "../../data/queries/index.js";
import { z } from "zod";

import * as InputSchemas from "../../input-schema.js";
import { RedisWrapperST } from "../../utils/redis.js";
import { getQueryDataById } from "../../data/queries/index.js";
import { getFilteredDbIndexes } from "./pg-get-db-index-by-id.js";
import { REDIS_KEYS } from "../../config.js";

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
    if (queryData) {
      let query = queryData.query;

      const dbIndexes = await getFilteredDbIndexes([queryData.dbIndexId]);
      if (dbIndexes.length > 0) {
        const dbIndexName = REDIS_KEYS.PREFIX.APP + dbIndexes[0].dbIndexName;
        query = query.replace("{dbIndexName}", dbIndexName);
        result = redisWrapperST.rawCommandExecute(query);
      }
    }
  }
  return result;
};

export { pgRunQuery };
