import { z } from "zod";
import { DATA_SOURCE_ID, DB_INDEX_ID } from "./config.js";
import { queryIdDataMap } from "./data/queries/index.js";

const zodEncryptedData = z.object({
  encryptedData: z.string(),
  iv: z.string(),
  authTag: z.string(),
});
const zodQueryId = z.enum(Object.keys(queryIdDataMap) as [string, ...string[]]);

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

export const resumeImportDataToRedisSchema = z.object({
  socketId: z.string(),
  isStopOnError: z.boolean().optional(),

  uploadType: z.string().optional(),
  uploadPath: z.string(),
});

export const pgLoadDataSourceInRedisSchema = z.object({
  dataSourceIds: z.array(z.nativeEnum(DATA_SOURCE_ID)),
  isAll: z.boolean().optional(),
  globalPrefix: z.string().optional(),
});

export const pgCreateIndexInRedisSchema = z.object({
  dbIndexIds: z.array(z.nativeEnum(DB_INDEX_ID)),
  isAll: z.boolean().optional(),
  globalPrefix: z.string().optional(),
});

export const pgGenerateNewUserDataSchema = z.object({
  userId: z.string().optional(),
  isAll: z.boolean().optional(),
  dbIndexIds: z.array(z.nativeEnum(DB_INDEX_ID)).optional(),
  dataSourceIds: z.array(z.nativeEnum(DATA_SOURCE_ID)).optional(),
});

export const pgGetQueryDataByIdSchema = z.object({
  queryIds: z.array(zodQueryId),
});

export const pgGetSampleDataByDataSourceIdSchema = z.object({
  dataSourceId: z.nativeEnum(DATA_SOURCE_ID),
  dataCount: z.number().optional(),
});

export const pgGetDbIndexByIdSchema = z.object({
  dbIndexIds: z.array(z.nativeEnum(DB_INDEX_ID)),
  isAll: z.boolean().optional(),
});

export const pgRunQuerySchema = z.object({
  customQuery: z.string().optional(),
  queryId: zodQueryId.optional(),
});

export const pgSaveQuerySchema = z.object({
  partialId: z.string().optional(),
  title: z.string().optional(),
  customQuery: z.string(),
  categoryId: z.string().optional(),
  queryId: zodQueryId.optional(),
});

export const pgGetSavedQuerySchema = z.object({
  partialId: z.string(),
});

//--- types ---

interface IImportStats {
  totalFiles: number;
  processed: number;
  failed: number;
  totalTimeInMs: number;
}

export type { IImportStats };
