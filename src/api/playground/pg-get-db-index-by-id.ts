import type { IDbIndex } from "../../config.js";
import { z } from "zod";

import * as InputSchemas from "../../input-schema.js";
import { getFilteredDbIndexes } from "../../config.js";

const pgGetDbIndexById = async (
  input: z.infer<typeof InputSchemas.pgGetDbIndexByIdSchema>
) => {
  InputSchemas.pgGetDbIndexByIdSchema.parse(input); // validate input

  const filteredDbIndexes = getFilteredDbIndexes(input.dbIndexIds, input.isAll);

  return filteredDbIndexes;
};

export { pgGetDbIndexById };
