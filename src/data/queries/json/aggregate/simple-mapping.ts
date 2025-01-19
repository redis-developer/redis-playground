import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";

const queryViewData: IQueryViewData = {
  query: `FT.AGGREGATE '{dbIndexName}' '@condition:{new}' 
            LOAD 2 '__key' 'price' 
            APPLY '@price - (@price * 0.1)' AS 'discounted'`,
  dbIndexId: DB_INDEX_ID.BICYCLE_DS_SEARCH_INDEX,
  dataSourceId: DATA_SOURCE_ID.BICYCLE_DS,
};

export default queryViewData;
