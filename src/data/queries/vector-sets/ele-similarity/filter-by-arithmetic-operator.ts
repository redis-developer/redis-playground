import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";

const queryViewData: IQueryViewData = {
  query: `// Retrieve elements similar to an existing element 's4' (sentence 4) and filter the results by even word count
// Use dot notation to access attribute fields, 
// Arithmetic: +, -, *, /, %, ** 
VSIM '{keyPrefix}' ELE 's4' WITHSCORES WITHATTRIBS FILTER '.wordCount % 2 == 0'`,
  queryFile: "",
  dbIndexId: "",
  dataSourceId: DATA_SOURCE_ID.STS_DEV_DS,
};

export default queryViewData;
