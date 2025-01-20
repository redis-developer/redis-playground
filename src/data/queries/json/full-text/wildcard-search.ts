import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";

const queryViewData: IQueryViewData = {
  query: `// Search for bicycles that contain the word pattern 'fort' anywhere in the description
FT.SEARCH {dbIndexName} '@description: *fort*'
//Note: Wildcard patterns:
//- *fort = ends with 'fort'
//- fort* = starts with 'fort'
//- *fort* = contains 'fort'`,
  dbIndexId: DB_INDEX_ID.BICYCLE_DS_SEARCH_INDEX,
  dataSourceId: DATA_SOURCE_ID.BICYCLE_DS,
};

export default queryViewData;
