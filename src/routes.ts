import express, { Request, Response } from "express";

import { HTTP_STATUS_CODES } from "./utils/constants.js";
import { LoggerCls } from "./utils/logger.js";
import { pgLoadDataSourceInRedis } from "./api/playground/pg-load-data-source-in-redis.js";
import { pgCreateIndexInRedis } from "./api/playground/pg-create-index-in-redis.js";
import { pgGetQueryDataById } from "./api/playground/pg-get-query-data-by-id.js";
import { pgGetQueryNavbarData } from "./api/playground/pg-get-query-navbar-data.js";
import { pgGetSampleDataByDataSourceId } from "./api/playground/pg-get-sample-data-by-data-source-id.js";
import { pgGetDbIndexById } from "./api/playground/pg-get-db-index-by-id.js";
import { pgRunQuery } from "./api/playground/pg-run-query.js";
import { pgSaveQuery } from "./api/playground/pg-save-query.js";
import { pgGetSavedQuery } from "./api/playground/pg-get-saved-query.js";
import { pgGenerateNewUserData } from "./api/playground/new-user-data/pg-generate-new-user-data.js";

const router = express.Router();

router.post("/pgLoadDataSourceInRedis", async (req: Request, res: Response) => {
  const result: any = {
    data: null,
    error: null,
  };
  const input = req.body;

  try {
    result.data = await pgLoadDataSourceInRedis(input);
  } catch (err) {
    err = LoggerCls.getPureError(err);
    LoggerCls.error("/pgLoadDataSourceInRedis API failed !", err);
    result.error = err;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

  res.send(result);
});

router.post("/pgCreateIndexInRedis", async (req: Request, res: Response) => {
  const result: any = {
    data: null,
    error: null,
  };
  const input = req.body;

  try {
    result.data = await pgCreateIndexInRedis(input);
  } catch (err) {
    err = LoggerCls.getPureError(err);
    LoggerCls.error("/pgCreateIndexInRedis API failed !", err);
    result.error = err;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

  res.send(result);
});

router.post("/pgGetQueryDataById", async (req: Request, res: Response) => {
  const result: any = {
    data: null,
    error: null,
  };
  const input = req.body;

  try {
    result.data = await pgGetQueryDataById(input);
  } catch (err) {
    err = LoggerCls.getPureError(err);
    LoggerCls.error("/pgGetQueryDataById API failed !", err);
    result.error = err;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

  res.send(result);
});

router.post("/pgGetQueryNavbarData", async (req: Request, res: Response) => {
  const result: any = {
    data: null,
    error: null,
  };
  const input = req.body;

  try {
    result.data = await pgGetQueryNavbarData();
  } catch (err) {
    err = LoggerCls.getPureError(err);
    LoggerCls.error("/pgGetQueryNavbarData API failed !", err);
    result.error = err;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

  res.send(result);
});

router.post(
  "/pgGetSampleDataByDataSourceId",
  async (req: Request, res: Response) => {
    const result: any = {
      data: null,
      error: null,
    };
    const input = req.body;

    try {
      result.data = await pgGetSampleDataByDataSourceId(input);
    } catch (err) {
      err = LoggerCls.getPureError(err);
      LoggerCls.error("/pgGetSampleDataByDataSourceId API failed !", err);
      result.error = err;
      res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }

    res.send(result);
  }
);

router.post("/pgGetDbIndexById", async (req: Request, res: Response) => {
  const result: any = {
    data: null,
    error: null,
  };
  const input = req.body;

  try {
    result.data = await pgGetDbIndexById(input);
  } catch (err) {
    err = LoggerCls.getPureError(err);
    LoggerCls.error("/pgGetDbIndexById API failed !", err);
    result.error = err;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

  res.send(result);
});

router.post("/pgRunQuery", async (req: Request, res: Response) => {
  const result: any = {
    data: null,
    error: null,
  };
  const input = req.body;

  try {
    result.data = await pgRunQuery(input);
  } catch (err) {
    err = LoggerCls.getPureError(err);
    LoggerCls.error("/pgRunQuery API failed !", err);
    result.error = err;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

  res.send(result);
});

router.post("/pgSaveQuery", async (req: Request, res: Response) => {
  const result: any = {
    data: null,
    error: null,
  };
  const input = req.body;

  try {
    result.data = await pgSaveQuery(input);
  } catch (err) {
    err = LoggerCls.getPureError(err);
    LoggerCls.error("/pgSaveQuery API failed !", err);
    result.error = err;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

  res.send(result);
});

router.post("/pgGetSavedQuery", async (req: Request, res: Response) => {
  const result: any = {
    data: null,
    error: null,
  };
  const input = req.body;

  try {
    result.data = await pgGetSavedQuery(input);
  } catch (err) {
    err = LoggerCls.getPureError(err);
    LoggerCls.error("/pgGetSavedQuery API failed !", err);
    result.error = err;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

  res.send(result);
});

router.post("/pgGenerateNewUserData", async (req: Request, res: Response) => {
  const result: any = {
    data: null,
    error: null,
  };
  const input = req.body;

  try {
    result.data = await pgGenerateNewUserData(input);
  } catch (err) {
    err = LoggerCls.getPureError(err);
    LoggerCls.error("/pgGenerateNewUserData API failed !", err);
    result.error = err;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }

  res.send(result);
});

export { router };
