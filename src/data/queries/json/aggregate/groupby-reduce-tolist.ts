import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";

const queryViewData: IQueryViewData = {
  query: `// Group bicycle IDs by condition (new/used) using TOLIST
FT.AGGREGATE '{dbIndexName}' '*'  
  LOAD 1 '__key' 
  GROUPBY 1 '@condition' 
  REDUCE TOLIST 1 '__key' AS bicycles`,
  dbIndexId: DB_INDEX_ID.BICYCLE_DS_SEARCH_INDEX,
  dataSourceId: DATA_SOURCE_ID.BICYCLE_DS,
};

export default queryViewData;
