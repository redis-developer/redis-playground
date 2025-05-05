import { z } from "zod";

import * as InputSchemas from "../../../input-schema.js";
import { resetUserDataExpiry } from "./user-data-config.js";

const pgResetUserDataExpiry = async (
  input: z.infer<typeof InputSchemas.pgResetUserDataExpirySchema>
) => {
  InputSchemas.pgResetUserDataExpirySchema.parse(input); // validate input

  const userId = input.userId;
  const isReset = await resetUserDataExpiry(userId);

  return {
    isReset,
  };
};

export { pgResetUserDataExpiry };
