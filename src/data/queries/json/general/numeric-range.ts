import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";

const queryViewData: IQueryViewData = {
  query: `//Searches for products with price between 100 and 200
FT.SEARCH '{dbIndexName}' '@price:[100 200]'
//Note: other examples
// - '@price:[1000 +inf]'  == price >= 1000
// - '@price:[(1000 +inf]' == price > 1000
// - '@price:[-inf 1000]' == price <= 1000
// - '@price:[-inf (1000]' == price < 1000`,
  dbIndexId: DB_INDEX_ID.FASHION_DS_SEARCH_INDEX,
  dataSourceId: DATA_SOURCE_ID.FASHION_DS,
};

export default queryViewData;
