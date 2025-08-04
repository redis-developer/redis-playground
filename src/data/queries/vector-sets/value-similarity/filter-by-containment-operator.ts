import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";
import { QUERY_COMMENTS } from "../../../../utils/constants.js";

const queryViewData: IQueryViewData = {
  query: `// Retrieve elements with embedding values similar to the phrase "She is playing a guitar" and filter the results by matching activity types
// Use dot notation to access attribute fields, 
// Containment: in
VSIM '{keyPrefix}' $embed("She is playing a guitar") WITHSCORES WITHATTRIBS FILTER '.activityType in ["people", "animals"]'
${QUERY_COMMENTS.VECTOR_SETS_VALUE_SIMILARITY}
// VSIM 'pg:sts' VALUES 1536 0.000534 0.034054 ... WITHSCORES WITHATTRIBS FILTER '.activityType in ["people", "animals"]'
`,
  queryFile: "",
  dbIndexId: "",
  dataSourceId: DATA_SOURCE_ID.STS_DEV_DS,
};

export default queryViewData;
