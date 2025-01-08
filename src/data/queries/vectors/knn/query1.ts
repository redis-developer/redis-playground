import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";

// Run a vector search for 'Comfortable commuter bike'
const queryViewData: IQueryViewData = {
  query: "",
  queryFile: "data/queries/vectors/knn/query1.redis",
  dbIndexId: DB_INDEX_ID.BIKE_DS_VSS_INDEX,
  dataSourceId: DATA_SOURCE_ID.BIKE_DS,
};

export default queryViewData;
