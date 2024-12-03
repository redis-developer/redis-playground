import express, { Request, Response } from "express";

import { HTTP_STATUS_CODES } from "./utils/constants.js";
import { LoggerCls } from "./utils/logger.js";
import { pgLoadDataSourceInRedis } from "./api/playground/pg-load-data-source-in-redis.js";
import { pgCreateIndexInRedis } from "./api/playground/pg-create-index-in-redis.js";
import { pgGetQueryDataById } from "./api/playground/pg-get-query-data-by-id.js";
import { pgGetQueryNavbarData } from "./api/playground/pg-get-query-navbar-data.js";

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

export { router };
