import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";

const queryViewData: IQueryViewData = {
  query: `// Retrieve elements similar to an existing element 's4' (sentence 4) and limit the results to 5
VSIM '{keyPrefix}' ELE 's4' WITHSCORES WITHATTRIBS COUNT 5`,
  queryFile: "",
  dbIndexId: "",
  dataSourceId: DATA_SOURCE_ID.STS_DEV_DS,
};

export default queryViewData;
