import type { IDbIndex } from "../../config.js";
import { z } from "zod";

import * as InputSchemas from "../../input-schema.js";
import { DB_INDEXES, DB_INDEX_ID } from "../../config.js";

const getFilteredDbIndexes = (
  dbIndexIds: DB_INDEX_ID[],
  isAll: boolean = false
) => {
  let filteredDbIndexes: IDbIndex[] = [];

  if (!dbIndexIds) {
    dbIndexIds = [];
  }

  if (isAll) {
    filteredDbIndexes = DB_INDEXES;
  } else if (dbIndexIds.length > 0) {
    filteredDbIndexes = DB_INDEXES.filter((dbIndex) =>
      dbIndexIds.includes(dbIndex.dbIndexId)
    );
  }

  return filteredDbIndexes;
};

const pgGetDbIndexById = async (
  input: z.infer<typeof InputSchemas.pgGetDbIndexByIdSchema>
) => {
  InputSchemas.pgGetDbIndexByIdSchema.parse(input); // validate input

  const filteredDbIndexes = getFilteredDbIndexes(input.dbIndexIds, input.isAll);

  return filteredDbIndexes;
};

export { pgGetDbIndexById, getFilteredDbIndexes };
