import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";

const queryViewData: IQueryViewData = {
  query: `// Fuzzy search to find bicycles with words similar to 'optimized', allowing for spelling variations
FT.SEARCH '{dbIndexName}' '%optamized%'
//Note :
// - Fuzzy search finds approximate word matches using Levenshtein distance
// - Use % pairs to control match tolerance: %word% (±1), %%word%% (±2), %%%word%%% (±3 max) Eg: '%%optamised%%'`,
  dbIndexId: DB_INDEX_ID.BICYCLE_DS_SEARCH_INDEX,
  dataSourceId: DATA_SOURCE_ID.BICYCLE_DS,
};

export default queryViewData;
