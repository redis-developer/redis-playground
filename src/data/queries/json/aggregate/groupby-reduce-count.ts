import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";

const queryViewData: IQueryViewData = {
  query: `// Count total documents after after adding a 'type' attribute to each document
FT.AGGREGATE '{dbIndexName}' '*'  
  APPLY '"bicycle"' AS type 
  GROUPBY 1 @type 
  REDUCE COUNT 0 AS num_total`,
  dbIndexId: DB_INDEX_ID.BICYCLE_DS_SEARCH_INDEX,
  dataSourceId: DATA_SOURCE_ID.BICYCLE_DS,
};

export default queryViewData;
