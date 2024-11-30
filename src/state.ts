import type { IImportStats } from "./input-schema.js";

import { Socket } from "socket.io";
import { z } from "zod";

import * as InputSchemas from "./input-schema.js";
import { ImportStatus } from "./utils/constants.js";

//#region Import State types

interface IImportCommonState {
  socketClient?: Socket | null;
  stats?: IImportStats;
  input?: z.infer<typeof InputSchemas.importDataToRedisSchema>;
  currentStatus?: ImportStatus;
  importErrors?: any[];
  fileIndex?: number;
}

interface IImportFolderFilesState extends IImportCommonState {
  filePaths?: string[];
}
interface IImportStreamFileState extends IImportCommonState {
  stream?: any;
  isStreamStarted?: boolean;
  isStreamEnded?: boolean;
}

//#endregion

const socketState: {
  IMPORT_UPLOAD_DIR?: any;

  [socketId: string]: IImportFolderFilesState | IImportStreamFileState;
} = {};

export { socketState, ImportStatus };

export type {
  IImportFolderFilesState,
  IImportCommonState,
  IImportStreamFileState,
};
