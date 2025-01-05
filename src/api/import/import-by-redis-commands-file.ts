import { z } from "zod";
import fs from "fs-extra";

import {
  getInitialImportState,
  setImportTimeAndStatus,
} from "./common-import.js";
import { getInputRedisConUrl } from "../common-api.js";
import * as InputSchemas from "../../input-schema.js";
import { RedisWrapper } from "../../utils/redis.js";
import { LoggerCls } from "../../utils/logger.js";

const importByRedisCommandsFile = async (
  input: z.infer<typeof InputSchemas.importDataToRedisSchema>
) => {
  // Validate input ----------------------
  InputSchemas.importDataToRedisSchema.parse(input);

  let importState = getInitialImportState(input);
  let startTimeInMs = performance.now();

  // Connect to Redis ----------------------
  let redisConUrl = getInputRedisConUrl(
    input.redisConUrl,
    input.redisConUrlEncrypted
  );
  const redisWrapper = new RedisWrapper(redisConUrl);
  await redisWrapper.connect();

  const content = await fs.readFile(input.uploadPath, "binary");
  const commands = content
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#")); // Remove empty lines and comments

  if (commands.length > 0 && importState?.stats && importState.importErrors) {
    importState.stats.totalFiles = commands.length;

    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];
      try {
        await redisWrapper.rawCommandExecute(cmd, true);

        importState.stats.processed++;
      } catch (error) {
        importState.stats.failed++;
        importState.importErrors.push({
          error: LoggerCls.getPureError(error),
          fileIndex: i,
        });
        break;
      }
    }
  }

  setImportTimeAndStatus(startTimeInMs, importState);

  await redisWrapper.disconnect();

  return {
    stats: importState.stats,
    importErrors: importState.importErrors,
    currentStatus: importState.currentStatus,
  };
};

export { importByRedisCommandsFile };
