import type { IDataSource } from "../../config.js";

import { z } from "zod";

import * as InputSchemas from "../../input-schema.js";
import { getFilteredDataSources } from "../../config.js";
import { importDataToRedis } from "../import/import-data-to-redis.js";
import { socketState } from "../../state.js";

const loadDataSource = async (ds: IDataSource, redisConUrl: string) => {
  let retObj: any = {};

  if (ds && redisConUrl) {
    const dsUploadPath = socketState.APP_ROOT_DIR + ds.uploadPath;

    const input: z.infer<typeof InputSchemas.importDataToRedisSchema> = {
      redisConUrl: redisConUrl,
      idField: ds.idField,
      keyPrefix: ds.keyPrefix,

      uploadType: ds.uploadType,
      uploadPath: dsUploadPath,
      jsFunctionString: ds.jsFunctionString,
    };
    retObj = await importDataToRedis(input);
    retObj.dataSourceId = ds.dataSourceId;
  }
  return retObj;
};

const pgLoadDataSourceInRedis = async (
  input: z.infer<typeof InputSchemas.pgLoadDataSourceInRedisSchema>
) => {
  InputSchemas.pgLoadDataSourceInRedisSchema.parse(input); // validate input

  let retObjArr: any[] = [];
  const redisConUrl = process.env.REDIS_URL || "";

  if (!redisConUrl) {
    throw new Error("Redis connection URL is not set !");
  }

  if (!input.dataSourceIds) {
    input.dataSourceIds = [];
  }

  let filteredDataSources = getFilteredDataSources(
    input.dataSourceIds,
    input.isAll
  );

  if (filteredDataSources.length > 0) {
    for (const ds of filteredDataSources) {
      const retObj = await loadDataSource(ds, redisConUrl);
      retObjArr.push(retObj);
    }
  }

  return retObjArr;
};

export { pgLoadDataSourceInRedis };
