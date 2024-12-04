import { z } from "zod";

import * as InputSchemas from "../../input-schema.js";
import { DB_INDEXES } from "../../config.js";

const pgGetDbIndexById = async (
  input: z.infer<typeof InputSchemas.pgGetDbIndexByIdSchema>
) => {
  InputSchemas.pgGetDbIndexByIdSchema.parse(input); // validate input

  let filteredDbIndexes: typeof DB_INDEXES = [];

  if (!input.dbIndexIds) {
    input.dbIndexIds = [];
  }

  if (input.isAll) {
    filteredDbIndexes = DB_INDEXES;
  } else if (input.dbIndexIds.length > 0) {
    filteredDbIndexes = DB_INDEXES.filter((dbIndex) =>
      input.dbIndexIds.includes(dbIndex.dbIndexId)
    );
  }

  return filteredDbIndexes;
};

export { pgGetDbIndexById };
