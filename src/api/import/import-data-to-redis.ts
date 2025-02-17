import { z } from "zod";
import * as InputSchemas from "../../input-schema.js";

import { getDefaultUploadType } from "../common-api.js";
import { UPLOAD_TYPES_FOR_IMPORT } from "../../utils/constants.js";
import { importJSONFilesToRedis } from "./import-json-files-to-redis.js";
import { importStreamFileToRedis } from "./import-stream-file-to-redis.js";
import { importByRedisCommandsFile } from "./import-by-redis-commands-file.js";

const importDataToRedis = async (
  input: z.infer<typeof InputSchemas.importDataToRedisSchema>
) => {
  InputSchemas.importDataToRedisSchema.parse(input); // validate input
  let retObj: any = {};

  if (!input.uploadType) {
    input.uploadType = getDefaultUploadType(input.uploadPath);
  }

  if (input.uploadType == UPLOAD_TYPES_FOR_IMPORT.JSON_FOLDER) {
    retObj = await importJSONFilesToRedis(input);
  } else if (
    input.uploadType == UPLOAD_TYPES_FOR_IMPORT.JSON_ARRAY_FILE ||
    input.uploadType == UPLOAD_TYPES_FOR_IMPORT.CSV_FILE
  ) {
    retObj = await importStreamFileToRedis(input);
  } else if (input.uploadType == UPLOAD_TYPES_FOR_IMPORT.REDIS_COMMANDS_FILE) {
    retObj = await importByRedisCommandsFile(input);
  }

  return retObj;
};

export { importDataToRedis };
