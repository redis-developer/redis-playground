import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";

const queryViewData: IQueryViewData = {
  query: `// Count affordable bikes with price<1000 per condition like  new/used 
FT.AGGREGATE '{dbIndexName}' '*' 
  LOAD 1 price 
// Note: (price_category=1 if price<1000, else 0)
  APPLY '@price<1000' AS price_category 
  GROUPBY 1 @condition 
  REDUCE SUM 1 '@price_category' AS 'num_affordable'`,
  dbIndexId: DB_INDEX_ID.BICYCLE_DS_SEARCH_INDEX,
  dataSourceId: DATA_SOURCE_ID.BICYCLE_DS,
};

export default queryViewData;
