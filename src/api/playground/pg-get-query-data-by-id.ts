import type { QueryIdType } from "../../data/queries/index.js";

import { z } from "zod";

import * as InputSchemas from "../../input-schema.js";
import { getQueryDataById } from "../../data/queries/index.js";

const pgGetQueryDataById = async (
  input: z.infer<typeof InputSchemas.pgGetQueryDataByIdSchema>
) => {
  InputSchemas.pgGetQueryDataByIdSchema.parse(input); // validate input

  let retObjArr: any[] = [];

  if (input.queryIds.length > 0) {
    for (const queryId of input.queryIds) {
      const retObj = await getQueryDataById(queryId as QueryIdType);
      retObjArr.push(retObj);
    }
  }

  return retObjArr;
};

export { pgGetQueryDataById };
