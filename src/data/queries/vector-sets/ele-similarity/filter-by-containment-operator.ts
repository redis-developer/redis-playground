import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";

const queryViewData: IQueryViewData = {
  query: `// Retrieve elements similar to an existing element 's4' (sentence 4) and filter the results by matching activity types
// Use dot notation to access attribute fields, 
// Containment: in
VSIM '{keyPrefix}' ELE 's4' WITHSCORES WITHATTRIBS FILTER '.activityType in ["people", "animals"]'`,
  queryFile: "",
  dbIndexId: "",
  dataSourceId: DATA_SOURCE_ID.STS_DEV_DS,
};

export default queryViewData;
