import { UPLOAD_TYPES_FOR_IMPORT } from "./utils/constants.js";

enum DATA_SOURCE_IDS {
  FASHION_DS = "fashion-ds",
}

const DATA_SOURCES = [
  {
    id: DATA_SOURCE_IDS.FASHION_DS,
    uploadType: UPLOAD_TYPES_FOR_IMPORT.JSON_FOLDER,
    uploadPath: "data/data-sources/fashion-ds",
    idField: "productId",
    keyPrefix: "fashion:",
  },
];

const REDIS_KEY_PREFIX = {
  APP: "pg:", //playground app
};

export { DATA_SOURCES, DATA_SOURCE_IDS, REDIS_KEY_PREFIX };
