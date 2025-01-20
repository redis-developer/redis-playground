import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";

const queryViewData: IQueryViewData = {
  query: `// Search for bicycles that have the word 'kids' in the description field
FT.SEARCH '{dbIndexName}' '@description: kids'`,
  dbIndexId: DB_INDEX_ID.BICYCLE_DS_SEARCH_INDEX,
  dataSourceId: DATA_SOURCE_ID.BICYCLE_DS,
};

export default queryViewData;
