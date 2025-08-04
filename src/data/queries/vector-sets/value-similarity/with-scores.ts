import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";

const queryViewData: IQueryViewData = {
  query: `// Retrieve elements with embedding values similar to the phrase "She is playing a guitar"
// Note: The $embed(...) placeholder is sandbox utility that automatically injects the text's vector embedding.
// Example of the original query with the replaced vector values: 
// VSIM 'pg:sts' VALUES 1536 0.000534 0.034054 ... WITHSCORES WITHATTRIBS
VSIM '{keyPrefix}' $embed("She is playing a guitar") WITHSCORES WITHATTRIBS`,
  queryFile: "",
  dbIndexId: "",
  dataSourceId: DATA_SOURCE_ID.STS_DEV_DS,
};

export default queryViewData;
