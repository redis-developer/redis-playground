import * as JSON_GENERAL_MULTI_FIELD_AND_CONDITION from "./json/general/multi-field-and-condition.js";
import * as JSON_GENERAL_MULTI_FIELD_OR_CONDITION from "./json/general/multi-field-or-condition.js";
import * as JSON_GENERAL_NEGATIVE_CONDITION from "./json/general/negative-condition.js";
import * as JSON_TAG_FIELD_EXACT_MATCH from "./json/tag-field/exact-match.js";
import * as JSON_TAG_FIELD_PREFIX_MATCH from "./json/tag-field/prefix-match.js";
import * as JSON_TAG_FIELD_MULTI_VALUE_AND_MATCH from "./json/tag-field/multi-value-and-match.js";
import * as JSON_TAG_FIELD_MULTI_VALUE_OR_MATCH from "./json/tag-field/multi-value-or-match.js";

import * as VECTORS_KNN_SAMPLE1 from "./vectors/knn/sample1.js";
import * as VECTORS_KNN_SAMPLE2 from "./vectors/knn/sample2.js";
import * as VECTORS_KNN_SAMPLE3 from "./vectors/knn/sample3.js";
import * as VECTORS_HYBRID_SAMPLE1 from "./vectors/hybrid/sample1.js";
import { getFilteredDbIndexes } from "../../config.js";

const queryIdDataMap = {
  JSON_GENERAL_MULTI_FIELD_AND_CONDITION,
  JSON_GENERAL_MULTI_FIELD_OR_CONDITION,
  JSON_GENERAL_NEGATIVE_CONDITION,
  JSON_TAG_FIELD_EXACT_MATCH,
  JSON_TAG_FIELD_PREFIX_MATCH,
  JSON_TAG_FIELD_MULTI_VALUE_AND_MATCH,
  JSON_TAG_FIELD_MULTI_VALUE_OR_MATCH,
  VECTORS_KNN_SAMPLE1,
  VECTORS_KNN_SAMPLE2,
  VECTORS_KNN_SAMPLE3,
  VECTORS_HYBRID_SAMPLE1,
};
type QueryIdType = keyof typeof queryIdDataMap;

const queryNavbarData = [
  {
    category: "JSON General",
    items: [
      {
        queryId: "JSON_GENERAL_MULTI_FIELD_AND_CONDITION",
        label: "JSON Multi Field AND Condition",
        description: "Search different fields using AND condition",
      },
      {
        queryId: "JSON_GENERAL_MULTI_FIELD_OR_CONDITION",
        label: "JSON Multi Field OR Condition",
        description: "Search different (optional) fields using OR condition",
      },
      {
        queryId: "JSON_GENERAL_NEGATIVE_CONDITION",
        label: "JSON Negative Condition",
        description: "Search for a field that does not contain a value",
      },
    ],
  },
  {
    category: "JSON Tag Field",
    items: [
      {
        queryId: "JSON_TAG_FIELD_EXACT_MATCH",
        label: "Tag Field Exact Match",
        description: "Search for an exact match of a tag field value",
      },
      {
        queryId: "JSON_TAG_FIELD_PREFIX_MATCH",
        label: "Tag Field Prefix Match",
        description: "Search for a prefix match of a tag field value",
      },
      {
        queryId: "JSON_TAG_FIELD_MULTI_VALUE_AND_MATCH",
        label: "Tag Field Multi Value AND Match",
        description:
          "Search for multiple values of a tag field using AND condition",
      },
      {
        queryId: "JSON_TAG_FIELD_MULTI_VALUE_OR_MATCH",
        label: "Tag Field Multi Value OR Match",
        description:
          "Search for multiple (optional) values of a tag field using OR condition",
      },
    ],
  },
  {
    category: "Vectors",
    items: [
      {
        queryId: "VECTORS_KNN_SAMPLE1",
        label: "Vectors KNN Sample 1",
        description: "Run a vector search for 'Comfortable commuter bike'",
      },
      {
        queryId: "VECTORS_KNN_SAMPLE2",
        label: "Vectors KNN Sample 2",
        description:
          "Run a vector search for 'Commuter bike for people over 60'",
      },
      {
        queryId: "VECTORS_KNN_SAMPLE3",
        label: "Vectors KNN Sample 3",
        description: "Run a vector search for 'Female specific mountain bike'",
      },
      {
        queryId: "VECTORS_HYBRID_SAMPLE1",
        label: "Vectors Hybrid Sample 1",
        description:
          "Run a vector search for 'Female specific mountain bike' for bikes type 'Mountain bikes' and with price between $3500 and $3500",
      },
    ],
  },
];

const getQueryDataById = (queryId: QueryIdType) => {
  const retObj: any = queryIdDataMap[queryId].default;
  retObj.queryId = queryId;

  const dbIndexes = getFilteredDbIndexes([retObj.dbIndexId]);
  if (dbIndexes.length > 0) {
    const dbIndexName = dbIndexes[0].dbIndexName;
    let query = retObj.query;
    query = query.replace("{dbIndexName}", dbIndexName);
    retObj.query = query;
  }

  return retObj;
};

export { queryNavbarData, queryIdDataMap, getQueryDataById };

export type { QueryIdType };
