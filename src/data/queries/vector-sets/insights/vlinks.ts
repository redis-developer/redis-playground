import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";

const queryViewData: IQueryViewData = {
  query: `// Retrieve the neighbors of a specified element in a vector set. The command shows the connections for each layer of the HNSW graph.
VLINKS '{keyPrefix}' 's4' WITHSCORES`,
  queryFile: "",
  dbIndexId: "",
  dataSourceId: DATA_SOURCE_ID.STS_DEV_DS,
};

export default queryViewData;
