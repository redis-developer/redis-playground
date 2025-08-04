import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";
import { QUERY_COMMENTS } from "../../../../utils/constants.js";

const queryViewData: IQueryViewData = {
  query: `// Retrieve elements with embedding values similar to the phrase "She is playing a guitar" , filter the results to include only those with an even word count and a combined word and character count greater than 30
// Use dot notation to access attribute fields, 
// Grouping: Parentheses ()
VSIM '{keyPrefix}' $embed("She is playing a guitar") WITHSCORES WITHATTRIBS FILTER '.wordCount % 2 == 0 and (.wordCount + .charCount) > 30'
${QUERY_COMMENTS.VECTOR_SETS_VALUE_SIMILARITY}
// VSIM 'pg:sts' VALUES 1536 0.000534 0.034054 ... WITHSCORES WITHATTRIBS FILTER '.wordCount % 2 == 0 and (.wordCount + .charCount) > 30'
`,
  queryFile: "",
  dbIndexId: "",
  dataSourceId: DATA_SOURCE_ID.STS_DEV_DS,
};

export default queryViewData;
