import { z } from "zod";

const zodEncryptedData = z.object({
  encryptedData: z.string(),
  iv: z.string(),
  authTag: z.string(),
});

export const importDataToRedisSchema = z.object({
  redisConUrl: z.string().optional(),
  redisConUrlEncrypted: zodEncryptedData.optional(),

  socketId: z.string().optional(),
  idField: z.string().optional(),
  keyPrefix: z.string().optional(),
  isStopOnError: z.boolean().optional(),
  jsFunctionString: z.string().optional(),

  uploadType: z.string().optional(),
  uploadPath: z.string(),
});

//--- types ---

interface IImportStats {
  totalFiles: number;
  processed: number;
  failed: number;
  totalTimeInMs: number;
}

export type { IImportStats };
