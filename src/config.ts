import { UPLOAD_TYPES_FOR_IMPORT } from "./utils/constants.js";

enum DATA_SOURCE_IDS {
  FASHION_DS = "fashion-ds",
  TEST_CSV_DS = "test-csv-ds",
  TEST_JSON_ARR_DS = "test-json-arr-ds",
}

const DATA_SOURCES = [
  {
    id: DATA_SOURCE_IDS.FASHION_DS,
    uploadType: UPLOAD_TYPES_FOR_IMPORT.JSON_FOLDER,
    uploadPath: "data/data-sources/fashion-ds",
    idField: "productId",
    keyPrefix: "fashion:",
  },
  {
    id: DATA_SOURCE_IDS.TEST_CSV_DS,
    uploadType: UPLOAD_TYPES_FOR_IMPORT.CSV_FILE,
    uploadPath: "data/data-sources/test-csv-ds/ecommerce-test.csv",
    idField: "productId",
    keyPrefix: "testCsv:",
  },
  {
    id: DATA_SOURCE_IDS.TEST_JSON_ARR_DS,
    uploadType: UPLOAD_TYPES_FOR_IMPORT.JSON_ARRAY_FILE,
    uploadPath: "data/data-sources/test-json-arr-ds/ecommerce-test.json",
    idField: "productId",
    keyPrefix: "testJsonArr:",
  },
];

const REDIS_KEY_PREFIX = {
  APP: "pg:", //playground app
};

export { DATA_SOURCES, DATA_SOURCE_IDS, REDIS_KEY_PREFIX };
