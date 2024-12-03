import { z } from "zod";

import * as InputSchemas from "../../input-schema.js";
import { RedisWrapperST } from "../../utils/redis.js";
import {
  MIN_REDIS_SAMPLE_DATA_COUNT,
  MAX_REDIS_SAMPLE_DATA_COUNT,
  DATA_SOURCES,
  REDIS_KEYS,
} from "../../config.js";

const pgGetSampleDataByDataSourceId = async (
  input: z.infer<typeof InputSchemas.pgGetSampleDataByDataSourceIdSchema>
) => {
  InputSchemas.pgGetSampleDataByDataSourceIdSchema.parse(input); // validate input
  let retObjArr: any[] = [];
  const redisWrapperST = RedisWrapperST.getInstance();

  let dataCount = input.dataCount || MIN_REDIS_SAMPLE_DATA_COUNT;
  if (dataCount > MAX_REDIS_SAMPLE_DATA_COUNT) {
    dataCount = MAX_REDIS_SAMPLE_DATA_COUNT;
  }
  if (input.dataSourceId) {
    const dataSource = DATA_SOURCES.find(
      (ds) => ds.dataSourceId === input.dataSourceId
    );
    if (dataSource) {
      const dsKeyPrefix = REDIS_KEYS.PREFIX.APP + dataSource.keyPrefix;
      const pattern = dsKeyPrefix + "*";
      const keys = await redisWrapperST.getKeys(dataCount, pattern);
      const values = await redisWrapperST.jsonMGet(keys);
      if (values?.length) {
        retObjArr = values;
      }
    }
  }

  return retObjArr;
};

export { pgGetSampleDataByDataSourceId };
