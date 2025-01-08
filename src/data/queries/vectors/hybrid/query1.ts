import {
  DB_INDEX_ID,
  DATA_SOURCE_ID,
  IQueryViewData,
} from "../../../../config.js";

// Run a vector search for 'Female specific mountain bike' for bikes type "Mountain bikes" and with price between $3500 and $3500
const queryViewData: IQueryViewData = {
  query: "",
  queryFile: "data/queries/vectors/hybrid/query1.redis",
  dbIndexId: DB_INDEX_ID.BIKE_DS_VSS_INDEX,
  dataSourceId: DATA_SOURCE_ID.BIKE_DS,
};

export default queryViewData;
