import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";

const queryViewData: IQueryViewData = {
  query: `// Retrieve elements similar to an existing element 's4' (sentence 4) and filter the results by word count
// Use dot notation to access attribute fields, 
// Logical: and, or, not (&&, ||, !)
VSIM '{keyPrefix}' ELE 's4' WITHSCORES WITHATTRIBS FILTER '.wordCount >= 5 and .wordCount < 8'`,
  queryFile: "",
  dbIndexId: "",
  dataSourceId: DATA_SOURCE_ID.STS_DEV_DS,
};

export default queryViewData;
