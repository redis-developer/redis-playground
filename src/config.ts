import { fashionSearchIndex } from "./data/db-indexes/fashion-ds/search-index.js";
import { UPLOAD_TYPES_FOR_IMPORT } from "./utils/constants.js";

enum DATA_SOURCE_ID {
  FASHION_DS = "FASHION_DS",
  TEST_CSV_DS = "TEST_CSV_DS",
  TEST_JSON_ARR_DS = "TEST_JSON_ARR_DS",
}
enum DB_INDEX_ID {
  FASHION_DS_SEARCH_INDEX = "FASHION_DS_SEARCH_INDEX",
}

interface IDataSource {
  dataSourceId: DATA_SOURCE_ID;
  uploadType: string;
  uploadPath: string;
  idField?: string;
  keyPrefix?: string;
  jsFunctionString?: string;
}

interface IDbIndex {
  dbIndexId: DB_INDEX_ID;
  dbIndexName: string;
  dbIndexQuery: string;
  dataSourceId: DATA_SOURCE_ID;
}

const DATA_SOURCES: IDataSource[] = [
  {
    dataSourceId: DATA_SOURCE_ID.FASHION_DS,
    uploadType: UPLOAD_TYPES_FOR_IMPORT.JSON_FOLDER,
    uploadPath: "data/data-sources/fashion-ds",
    idField: "productId",
    keyPrefix: "fashion:",
    jsFunctionString: `
        function formatter(jsonObj) { 

        jsonObj.productId = parseInt(jsonObj.productId);
        jsonObj.price = parseInt(jsonObj.price);

        jsonObj.brandName = jsonObj.brandName.trim().toLowerCase().replace(/ /g, '-');
        jsonObj.gender = jsonObj.gender.trim().toLowerCase().replace(/ /g, '-');

        jsonObj.masterCategoryType = jsonObj.masterCategory_typeName.trim().toLowerCase().replace(/ /g, '-');
        delete jsonObj.masterCategory_typeName;

        jsonObj.subCategoryType = jsonObj.subCategory_typeName.trim().toLowerCase().replace(/ /g, '-');
        delete jsonObj.subCategory_typeName;

        jsonObj.productDescription = jsonObj.productDescriptors_description_value;
        delete jsonObj.productDescriptors_description_value;
        
        jsonObj.imageLink = jsonObj.styleImages_default_imageURL;
        delete jsonObj.styleImages_default_imageURL;

        return jsonObj; 
      }
    `,
  },
  {
    dataSourceId: DATA_SOURCE_ID.TEST_CSV_DS,
    uploadType: UPLOAD_TYPES_FOR_IMPORT.CSV_FILE,
    uploadPath: "data/data-sources/test-csv-ds/ecommerce-test.csv",
    idField: "productId",
    keyPrefix: "csvSource:",
    jsFunctionString: "",
  },
  {
    dataSourceId: DATA_SOURCE_ID.TEST_JSON_ARR_DS,
    uploadType: UPLOAD_TYPES_FOR_IMPORT.JSON_ARRAY_FILE,
    uploadPath: "data/data-sources/test-json-arr-ds/ecommerce-test.json",
    idField: "productId",
    keyPrefix: "jsonArrSource:",
    jsFunctionString: "",
  },
];

const DB_INDEXES: IDbIndex[] = [
  {
    dbIndexId: DB_INDEX_ID.FASHION_DS_SEARCH_INDEX,
    dbIndexName: "fashionSearchIndex",
    dbIndexQuery: fashionSearchIndex,
    dataSourceId: DATA_SOURCE_ID.FASHION_DS,
  },
];

const REDIS_KEYS = {
  PREFIX: {
    APP: "pg:", //playground app
  },
};

export { DATA_SOURCES, DATA_SOURCE_ID, REDIS_KEYS, DB_INDEXES, DB_INDEX_ID };

export type { IDataSource, IDbIndex };
