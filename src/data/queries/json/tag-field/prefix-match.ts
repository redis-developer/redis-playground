import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";

const queryViewData: IQueryViewData = {
  query: `//Search for products with brand name starting with 'tokyo'
FT.SEARCH '{dbIndexName}' '@brandName:{tokyo*}'`,
  dbIndexId: DB_INDEX_ID.FASHION_DS_SEARCH_INDEX,
  dataSourceId: DATA_SOURCE_ID.FASHION_DS,
};

export default queryViewData;
