import type { IDataSource } from "../../config.js";

import { z } from "zod";

import * as InputSchemas from "../../input-schema.js";
import { RedisWrapperST } from "../../utils/redis.js";
import {
  MIN_REDIS_SAMPLE_DATA_COUNT,
  MAX_REDIS_SAMPLE_DATA_COUNT,
  DATA_TYPES,
  getFilteredDataSources,
} from "../../config.js";
import {
  getUserDataKeyPrefix,
  isUserDataActive,
} from "./new-user-data/user-data-config.js";

const removeVectorFieldsFromList = (list: any[], dataSource: IDataSource) => {
  let retObjArr: any[] = [];

  if (list?.length && dataSource.fields?.length) {
    const vectorFieldNames = dataSource.fields
      .filter((field) => field.type === DATA_TYPES.VECTOR_FIELD)
      .map((field) => field.name);

    for (let i = 0; i < list.length; i++) {
      const obj = list[i];
      const newObj: any = {};

      for (const [key, value] of Object.entries(obj)) {
        const isVectorField = vectorFieldNames.indexOf(key) >= 0;

        if (!isVectorField) {
          newObj[key] = value;
        }
        // else {
        //   newObj[key] = "---VECTOR---";
        // }
      }

      retObjArr.push(newObj);
    }
  } else {
    retObjArr = list;
  }

  return retObjArr;
};

const pgGetSampleDataByDataSourceId = async (
  input: z.infer<typeof InputSchemas.pgGetSampleDataByDataSourceIdSchema>
) => {
  InputSchemas.pgGetSampleDataByDataSourceIdSchema.parse(input); // validate input
  let retObjArr: any[] = [];
  const redisWrapperST = RedisWrapperST.getInstance();

  let dataCount = input.dataCount || MIN_REDIS_SAMPLE_DATA_COUNT;
  if (dataCount > MAX_REDIS_SAMPLE_DATA_COUNT) {
    dataCount = MAX_REDIS_SAMPLE_DATA_COUNT;
  }
  let userId = input.userId || "";
  let globalPrefix = "";

  if (userId) {
    const isActive = await isUserDataActive(userId);
    if (!isActive) {
      userId = "";
    } else {
      globalPrefix = getUserDataKeyPrefix(userId);
    }
  }

  if (input.dataSourceId) {
    let filteredDataSources = getFilteredDataSources(
      [input.dataSourceId],
      false,
      globalPrefix
    );

    const dataSource =
      filteredDataSources.length > 0 ? filteredDataSources[0] : null;

    if (dataSource) {
      const pattern = dataSource.keyPrefix + "*";
      const keys = await redisWrapperST.getKeys(dataCount, pattern);
      const dataType = dataSource.dataType || DATA_TYPES.JSON;
      let values: any;

      if (dataType === DATA_TYPES.JSON) {
        values = await redisWrapperST.jsonMGet(keys);
      } else if (dataType === DATA_TYPES.HASH) {
        values = await redisWrapperST.hashMGet(keys);
      }

      if (values?.length) {
        retObjArr = values;

        if (dataSource.fields?.length) {
          retObjArr = removeVectorFieldsFromList(values, dataSource);
        }
      }
    }
  }

  return retObjArr;
};

export { pgGetSampleDataByDataSourceId };
