import { UPLOAD_TYPES_FOR_IMPORT } from "./utils/constants.js";
import { fashionSearchIndex } from "./data/db-indexes/fashion-ds/search-index.js";
import { userSearchIndex } from "./data/db-indexes/user-ds/search-index.js";
import { bikeVssIndex } from "./data/db-indexes/bike-ds/vss-index.js";
import { bicycleSearchIndex } from "./data/db-indexes/bicycle-ds/search-index.js";

//#region interfaces and enums
enum DATA_SOURCE_ID {
  FASHION_DS = "FASHION_DS",
  USER_DS = "USER_DS",
  BIKE_DS = "BIKE_DS",
  BICYCLE_DS = "BICYCLE_DS",
  TEST_JSON_ARR_DS = "TEST_JSON_ARR_DS",
}
enum DB_INDEX_ID {
  FASHION_DS_SEARCH_INDEX = "FASHION_DS_SEARCH_INDEX",
  USER_DS_SEARCH_INDEX = "USER_DS_SEARCH_INDEX",
  BIKE_DS_VSS_INDEX = "BIKE_DS_VSS_INDEX",
  BICYCLE_DS_SEARCH_INDEX = "BICYCLE_DS_SEARCH_INDEX",
}

enum DATA_TYPES {
  HASH = "HASH",
  JSON = "JSON",

  VECTOR_FIELD = "VECTOR",
  TAG_FIELD = "TAG",
  NUMBER_FIELD = "NUMBER",
}

interface IDataSourceField {
  name: string;
  type: DATA_TYPES;
}

interface IDataSource {
  dataSourceId: DATA_SOURCE_ID;
  uploadType: string;
  uploadPath: string;
  idField?: string;
  keyPrefix?: string;
  jsFunctionString?: string;
  dataType?: DATA_TYPES;
  fields?: IDataSourceField[];
}

interface IDbIndex {
  dbIndexId: DB_INDEX_ID;
  dbIndexName: string;
  dbIndexQuery: string;
  dataSourceId: DATA_SOURCE_ID;
  keyPrefix: string;
}
interface IQueryViewData {
  query: string;
  queryFile?: string;
  queryId?: string;
  dbIndexId: string;
  dataSourceId: string;
}
//#endregion

//#region helper functions
const getKeyPrefix = (dataSourceId: DATA_SOURCE_ID) => {
  const dataSource = DATA_SOURCES.find(
    (ds) => ds.dataSourceId === dataSourceId
  );
  return dataSource?.keyPrefix || "";
};

/*
const getDbIndexes = () => {
  let retObj = DB_INDEXES_RAW;

  retObj = retObj.map((dbIndex) => {
    dbIndex.keyPrefix = getKeyPrefix(dbIndex.dataSourceId);

    let dbIndexQuery = dbIndex.dbIndexQuery;
    dbIndexQuery = dbIndexQuery.replace("{dbIndexName}", dbIndex.dbIndexName);
    dbIndexQuery = dbIndexQuery.replace("{keyPrefix}", dbIndex.keyPrefix);
    dbIndex.dbIndexQuery = dbIndexQuery;

    return dbIndex;
  });

  return retObj;
};
 */

const getFilteredDbIndexes = (
  dbIndexIds: DB_INDEX_ID[],
  isAll: boolean = false,
  globalPrefix: string = ""
) => {
  let filteredDbIndexes: IDbIndex[] = [];

  if (!dbIndexIds) {
    dbIndexIds = [];
  }
  globalPrefix = globalPrefix || "";

  if (isAll) {
    filteredDbIndexes = DB_INDEXES_RAW;
  } else if (dbIndexIds.length > 0) {
    filteredDbIndexes = DB_INDEXES_RAW.filter((di) =>
      dbIndexIds.includes(di.dbIndexId)
    );
  }

  if (filteredDbIndexes?.length > 0) {
    filteredDbIndexes = filteredDbIndexes.map((dbIndex) => {
      const newDbIndex = { ...dbIndex };
      if (globalPrefix) {
        newDbIndex.dbIndexName = globalPrefix + dbIndex.dbIndexName;
        newDbIndex.keyPrefix = globalPrefix + dbIndex.keyPrefix;
      }

      let dbIndexQuery = dbIndex.dbIndexQuery;
      dbIndexQuery = dbIndexQuery.replace(
        "{dbIndexName}",
        newDbIndex.dbIndexName
      );
      dbIndexQuery = dbIndexQuery.replace("{keyPrefix}", newDbIndex.keyPrefix);
      newDbIndex.dbIndexQuery = dbIndexQuery;

      return newDbIndex;
    });
  }

  return filteredDbIndexes;
};

const getFilteredDataSources = (
  dataSourceIds: DATA_SOURCE_ID[],
  isAll: boolean = false,
  globalPrefix: string = ""
) => {
  let filteredDataSources: IDataSource[] = [];
  globalPrefix = globalPrefix || "";
  if (isAll) {
    filteredDataSources = DATA_SOURCES;
  } else if (dataSourceIds?.length > 0) {
    filteredDataSources = DATA_SOURCES.filter((ds) =>
      dataSourceIds.includes(ds.dataSourceId)
    );
  }

  if (globalPrefix && filteredDataSources?.length > 0) {
    filteredDataSources = filteredDataSources.map((ds) => {
      const newDs = { ...ds };
      newDs.keyPrefix = globalPrefix + ds.keyPrefix;
      return newDs;
    });
  }
  return filteredDataSources;
};

//#endregion

//#region config keys

const MAX_CUSTOM_QUERY_SIZE = 1024 * 30; // 30KB

const REDIS_KEYS = {
  PREFIX: {
    APP: "pg:", //playground app
    WRITABLE_APP: "pgWritable:", //playground writable user data app
    USER_DATA: "pgUser:",
    SAVED_QUERIES: "savedQuery:",
  },
};

const DATA_SOURCES: IDataSource[] = [
  {
    dataSourceId: DATA_SOURCE_ID.FASHION_DS,
    uploadType: UPLOAD_TYPES_FOR_IMPORT.JSON_FOLDER,
    uploadPath: "data/data-sources/fashion-ds",
    idField: "productId",
    keyPrefix: `${REDIS_KEYS.PREFIX.APP}fashion:`,
    jsFunctionString: `
        function formatter(jsonObj) { 

        jsonObj.productId = parseInt(jsonObj.productId);
        jsonObj.price = parseInt(jsonObj.price);

        jsonObj.brandName = jsonObj.brandName.trim().toLowerCase().replace(/ /g, '_');
        jsonObj.gender = jsonObj.gender.trim().toLowerCase();

        jsonObj.masterCategoryType = jsonObj.masterCategory_typeName.trim().toLowerCase().replace(/ /g, '_');
        delete jsonObj.masterCategory_typeName;

        jsonObj.subCategoryType = jsonObj.subCategory_typeName.trim().toLowerCase().replace(/ /g, '_');
        delete jsonObj.subCategory_typeName;

        jsonObj.productDescription = jsonObj.productDescriptors_description_value;
        delete jsonObj.productDescriptors_description_value;
        
        jsonObj.imageLink = jsonObj.styleImages_default_imageURL;
        delete jsonObj.styleImages_default_imageURL;

        return jsonObj; 
      }
    `,
    dataType: DATA_TYPES.JSON,
  },
  {
    dataSourceId: DATA_SOURCE_ID.USER_DS,
    uploadType: UPLOAD_TYPES_FOR_IMPORT.CSV_FILE,
    uploadPath: "data/data-sources/user-ds/user-data.csv",
    idField: "userId",
    keyPrefix: `${REDIS_KEYS.PREFIX.APP}user:`,
    jsFunctionString: `function formatter(jsonObj) { 

        let retObj = {};
        
        retObj.userId = parseInt(jsonObj.userId);
        retObj.firstName = jsonObj.firstName.trim();
        retObj.lastName = jsonObj.lastName.trim();
        retObj.email = jsonObj.email.trim().toLowerCase();
        retObj.phoneNumber = jsonObj.phoneNumber;

        retObj.address = jsonObj.address.trim();
        retObj.city = jsonObj.city.trim().toUpperCase();
        retObj.state = jsonObj.state.trim().toUpperCase();
        retObj.zipCode = parseInt(jsonObj.zipCode);  
        retObj.country = jsonObj.country.trim().toUpperCase();

        retObj.gender = jsonObj.gender.trim().toUpperCase();
        retObj.company = jsonObj.company.trim().toUpperCase();
        retObj.jobTitle = jsonObj.jobTitle.trim();

        return retObj; 
      }`,
    dataType: DATA_TYPES.JSON,
  },
  {
    dataSourceId: DATA_SOURCE_ID.TEST_JSON_ARR_DS,
    uploadType: UPLOAD_TYPES_FOR_IMPORT.JSON_ARRAY_FILE,
    uploadPath: "data/data-sources/test-json-arr-ds/ecommerce-test.json",
    idField: "productId",
    keyPrefix: `${REDIS_KEYS.PREFIX.APP}jsonArrSource:`,
    jsFunctionString: "",
    dataType: DATA_TYPES.JSON,
  },
  {
    dataSourceId: DATA_SOURCE_ID.BIKE_DS,
    uploadType: UPLOAD_TYPES_FOR_IMPORT.REDIS_COMMANDS_FILE,
    uploadPath: "data/data-sources/bike-ds/bike-data.redis",
    //idField: "",
    keyPrefix: `${REDIS_KEYS.PREFIX.APP}bike:`,
    //jsFunctionString: "",
    dataType: DATA_TYPES.HASH,
    fields: [
      {
        name: "description_embeddings",
        type: DATA_TYPES.VECTOR_FIELD,
      },
    ],
  },
  {
    dataSourceId: DATA_SOURCE_ID.BICYCLE_DS,
    uploadType: UPLOAD_TYPES_FOR_IMPORT.REDIS_COMMANDS_FILE,
    uploadPath: "data/data-sources/bicycle-ds/bicycle-data.redis",
    //idField: "",
    keyPrefix: `${REDIS_KEYS.PREFIX.APP}bicycle:`,
    //jsFunctionString: "",
    dataType: DATA_TYPES.JSON,
  },
];

const DB_INDEXES_RAW: IDbIndex[] = [
  {
    dbIndexId: DB_INDEX_ID.FASHION_DS_SEARCH_INDEX,
    dbIndexName: `${REDIS_KEYS.PREFIX.APP}fashionSearchIndex`,
    dbIndexQuery: fashionSearchIndex,
    dataSourceId: DATA_SOURCE_ID.FASHION_DS,
    keyPrefix: getKeyPrefix(DATA_SOURCE_ID.FASHION_DS),
  },
  {
    dbIndexId: DB_INDEX_ID.USER_DS_SEARCH_INDEX,
    dbIndexName: `${REDIS_KEYS.PREFIX.APP}userSearchIndex`,
    dbIndexQuery: userSearchIndex,
    dataSourceId: DATA_SOURCE_ID.USER_DS,
    keyPrefix: getKeyPrefix(DATA_SOURCE_ID.USER_DS),
  },
  {
    dbIndexId: DB_INDEX_ID.BIKE_DS_VSS_INDEX,
    dbIndexName: `${REDIS_KEYS.PREFIX.APP}bikeVssIndex`,
    dbIndexQuery: bikeVssIndex,
    dataSourceId: DATA_SOURCE_ID.BIKE_DS,
    keyPrefix: getKeyPrefix(DATA_SOURCE_ID.BIKE_DS),
  },
  {
    dbIndexId: DB_INDEX_ID.BICYCLE_DS_SEARCH_INDEX,
    dbIndexName: `${REDIS_KEYS.PREFIX.APP}bicycleSearchIndex`,
    dbIndexQuery: bicycleSearchIndex,
    dataSourceId: DATA_SOURCE_ID.BICYCLE_DS,
    keyPrefix: getKeyPrefix(DATA_SOURCE_ID.BICYCLE_DS),
  },
];
//const DB_INDEXES = getDbIndexes();

const MIN_REDIS_SAMPLE_DATA_COUNT = 1;
const MAX_REDIS_SAMPLE_DATA_COUNT = 1000;

//#endregion

export {
  // DATA_SOURCES,
  DATA_SOURCE_ID,
  //DB_INDEXES,
  DB_INDEX_ID,
  DATA_TYPES,
  MIN_REDIS_SAMPLE_DATA_COUNT,
  MAX_REDIS_SAMPLE_DATA_COUNT,
  getFilteredDbIndexes,
  getFilteredDataSources,
  REDIS_KEYS,
  MAX_CUSTOM_QUERY_SIZE,
};

export type { IDataSource, IDbIndex, IQueryViewData };
