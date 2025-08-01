import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";

const queryViewData: IQueryViewData = {
  query: `// Retrieve elements similar to an existing element 's4' (sentence 4) , filter the results to include only those with an even word count and a combined word and character count greater than 30
// Use dot notation to access attribute fields, 
// Grouping: Parentheses ()
VSIM '{keyPrefix}' ELE 's4' WITHSCORES WITHATTRIBS FILTER '.wordCount % 2 == 0 and (.wordCount + .charCount) > 30'`,
  queryFile: "",
  dbIndexId: "",
  dataSourceId: DATA_SOURCE_ID.STS_DEV_DS,
};

export default queryViewData;
