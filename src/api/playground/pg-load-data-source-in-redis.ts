import { z } from "zod";

import * as InputSchemas from "../../input-schema.js";
import { DATA_SOURCES, REDIS_KEY_PREFIX } from "../../config.js";
import { importDataToRedis } from "../import/import-data-to-redis.js";
import { socketState } from "../../state.js";

const pgLoadDataSourceInRedis = async (
  input: z.infer<typeof InputSchemas.pgLoadDataSourceInRedisSchema>
) => {
  InputSchemas.pgLoadDataSourceInRedisSchema.parse(input); // validate input

  let retObjArr: any[] = [];

  const redisConUrl = process.env.REDIS_URL || "";

  if (!redisConUrl) {
    throw new Error("Redis connection URL is not set !");
  }

  const filteredDataSources = input.isAll
    ? DATA_SOURCES
    : DATA_SOURCES.filter((ds) => input.ids.includes(ds.id));

  for (const ds of filteredDataSources) {
    const dsKeyPrefix = REDIS_KEY_PREFIX.APP + ds.keyPrefix;
    const dsUploadPath = socketState.APP_ROOT_DIR + ds.uploadPath;

    const input: z.infer<typeof InputSchemas.importDataToRedisSchema> = {
      redisConUrl: redisConUrl,
      idField: ds.idField,
      keyPrefix: dsKeyPrefix,

      uploadType: ds.uploadType,
      uploadPath: dsUploadPath,
    };
    const retObj = await importDataToRedis(input);
    retObj.id = ds.id;
    retObjArr.push(retObj);
  }

  return retObjArr;
};

export { pgLoadDataSourceInRedis };
