import type { IDataSource } from "../../config.js";

import { z } from "zod";

import * as InputSchemas from "../../input-schema.js";
import { DATA_SOURCES, REDIS_KEYS } from "../../config.js";
import { importDataToRedis } from "../import/import-data-to-redis.js";
import { socketState } from "../../state.js";

const loadDataSource = async (ds: IDataSource, redisConUrl: string) => {
  let retObj: any = {};

  if (ds && redisConUrl) {
    const dsKeyPrefix = REDIS_KEYS.PREFIX.APP + ds.keyPrefix;
    const dsUploadPath = socketState.APP_ROOT_DIR + ds.uploadPath;

    const input: z.infer<typeof InputSchemas.importDataToRedisSchema> = {
      redisConUrl: redisConUrl,
      idField: ds.idField,
      keyPrefix: dsKeyPrefix,

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
  let filteredDataSources: IDataSource[] = [];
  const redisConUrl = process.env.REDIS_URL || "";

  if (!redisConUrl) {
    throw new Error("Redis connection URL is not set !");
  }

  if (!input.dataSourceIds) {
    input.dataSourceIds = [];
  }

  if (input.isAll) {
    filteredDataSources = DATA_SOURCES;
  } else if (input.dataSourceIds.length > 0) {
    filteredDataSources = DATA_SOURCES.filter((ds) =>
      input.dataSourceIds.includes(ds.dataSourceId)
    );
  }

  if (filteredDataSources.length > 0) {
    for (const ds of filteredDataSources) {
      const retObj = await loadDataSource(ds, redisConUrl);
      retObjArr.push(retObj);
    }
  }

  return retObjArr;
};

export { pgLoadDataSourceInRedis };
