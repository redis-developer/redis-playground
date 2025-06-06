import fs from "fs-extra";

import { socketState } from "../../state.js";

import * as JSON_GENERAL_MULTI_FIELD_AND_CONDITION from "./json/general/multi-field-and-condition.js";
import * as JSON_GENERAL_MULTI_FIELD_OR_CONDITION from "./json/general/multi-field-or-condition.js";
import * as JSON_GENERAL_NEGATIVE_CONDITION from "./json/general/negative-condition.js";
import * as JSON_GENERAL_NUMERIC_RANGE from "./json/general/numeric-range.js";

import * as JSON_TAG_FIELD_EXACT_MATCH from "./json/tag-field/exact-match.js";
import * as JSON_TAG_FIELD_PREFIX_MATCH from "./json/tag-field/prefix-match.js";
import * as JSON_TAG_FIELD_MULTI_VALUE_AND_MATCH from "./json/tag-field/multi-value-and-match.js";
import * as JSON_TAG_FIELD_MULTI_VALUE_OR_MATCH from "./json/tag-field/multi-value-or-match.js";

import * as JSON_AGGREGATE_SIMPLE_MAPPING from "./json/aggregate/simple-mapping.js";
import * as JSON_AGGREGATE_GROUPBY_REDUCE_SUM from "./json/aggregate/groupby-reduce-sum.js";
import * as JSON_AGGREGATE_GROUPBY_REDUCE_COUNT from "./json/aggregate/groupby-reduce-count.js";
import * as JSON_AGGREGATE_GROUPBY_REDUCE_TOLIST from "./json/aggregate/groupby-reduce-tolist.js";

import * as JSON_FULL_TEXT_ALL_TEXT_FIELDS from "./json/full-text/all-text-fields.js";
import * as JSON_FULL_TEXT_SPECIFIC_TEXT_FIELD from "./json/full-text/specific-text-field.js";
import * as JSON_FULL_TEXT_WILDCARD_SEARCH from "./json/full-text/wildcard-search.js";
import * as JSON_FULL_TEXT_FUZZY_SEARCH from "./json/full-text/fuzzy-search.js";

import * as VECTORS_KNN_QUERY1 from "./vectors/knn/query1.js";
import * as VECTORS_KNN_QUERY2 from "./vectors/knn/query2.js";
import * as VECTORS_KNN_QUERY3 from "./vectors/knn/query3.js";
import * as VECTORS_HYBRID_QUERY1 from "./vectors/hybrid/query1.js";

import { getFilteredDbIndexes } from "../../config.js";

const queryIdDataMap = {
  JSON_GENERAL_MULTI_FIELD_AND_CONDITION,
  JSON_GENERAL_MULTI_FIELD_OR_CONDITION,
  JSON_GENERAL_NEGATIVE_CONDITION,
  JSON_GENERAL_NUMERIC_RANGE,
  JSON_TAG_FIELD_EXACT_MATCH,
  JSON_TAG_FIELD_PREFIX_MATCH,
  JSON_TAG_FIELD_MULTI_VALUE_AND_MATCH,
  JSON_TAG_FIELD_MULTI_VALUE_OR_MATCH,
  JSON_AGGREGATE_SIMPLE_MAPPING,
  JSON_AGGREGATE_GROUPBY_REDUCE_SUM,
  JSON_AGGREGATE_GROUPBY_REDUCE_COUNT,
  JSON_AGGREGATE_GROUPBY_REDUCE_TOLIST,
  JSON_FULL_TEXT_ALL_TEXT_FIELDS,
  JSON_FULL_TEXT_SPECIFIC_TEXT_FIELD,
  JSON_FULL_TEXT_WILDCARD_SEARCH,
  JSON_FULL_TEXT_FUZZY_SEARCH,
  VECTORS_KNN_QUERY1,
  VECTORS_KNN_QUERY2,
  VECTORS_KNN_QUERY3,
  VECTORS_HYBRID_QUERY1,
};
type QueryIdType = keyof typeof queryIdDataMap;

const queryNavbarData = [
  {
    category: "JSON General",
    categoryId: "JSON_GENERAL",
    items: [
      {
        queryId: "JSON_GENERAL_MULTI_FIELD_AND_CONDITION",
        label: "Multi Field AND Condition",
        description: "Search different fields using AND condition",
      },
      {
        queryId: "JSON_GENERAL_MULTI_FIELD_OR_CONDITION",
        label: "Multi Field OR Condition",
        description: "Search different (optional) fields using OR condition",
      },
      {
        queryId: "JSON_GENERAL_NEGATIVE_CONDITION",
        label: "Negative Condition",
        description: "Search for a field that does not contain a value",
      },
      {
        queryId: "JSON_GENERAL_NUMERIC_RANGE",
        label: "Numeric Range",
        description: "Search for a numeric field within a range",
      },
    ],
  },
  {
    category: "JSON Tag Field",
    categoryId: "JSON_TAG_FIELD",
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
    category: "JSON Full Text",
    categoryId: "JSON_FULL_TEXT",
    items: [
      {
        queryId: "JSON_FULL_TEXT_ALL_TEXT_FIELDS",
        label: "All Text Fields",
        description:
          "To search for a word (or word stem) across all text fields",
      },
      {
        queryId: "JSON_FULL_TEXT_SPECIFIC_TEXT_FIELD",
        label: "Specific Text Field",
        description: "To search for a word in a specific text field",
      },
      {
        queryId: "JSON_FULL_TEXT_WILDCARD_SEARCH",
        label: "Wildcard Search",
        description: "To search for a word pattern in a text field",
      },
      {
        queryId: "JSON_FULL_TEXT_FUZZY_SEARCH",
        label: "Fuzzy Search",
        description: "To search for a word with spelling variations",
      },
    ],
  },
  {
    category: "JSON Aggregate",
    categoryId: "JSON_AGGREGATE",
    items: [
      {
        queryId: "JSON_AGGREGATE_SIMPLE_MAPPING",
        label: "New field using APPLY",
        description: "Creating a new field using APPLY",
      },
      {
        queryId: "JSON_AGGREGATE_GROUPBY_REDUCE_SUM",
        label: "Group By Reduce Sum",
        description:
          "Group by a field and reduce the values using SUM function",
      },
      {
        queryId: "JSON_AGGREGATE_GROUPBY_REDUCE_COUNT",
        label: "Group By Reduce Count",
        description:
          "Group by a field and reduce the values using COUNT function",
      },
      {
        queryId: "JSON_AGGREGATE_GROUPBY_REDUCE_TOLIST",
        label: "Group By Reduce To List",
        description:
          "Group by a field and reduce the values using TOLIST function",
      },
    ],
  },
  {
    category: "Vectors",
    categoryId: "VECTORS",
    items: [
      {
        queryId: "VECTORS_KNN_QUERY1",
        label: "KNN Query 1",
        description: "Run a vector search for 'Comfortable commuter bike'",
      },
      {
        queryId: "VECTORS_KNN_QUERY2",
        label: "KNN Query 2",
        description:
          "Run a vector search for 'Commuter bike for people over 60'",
      },
      {
        queryId: "VECTORS_KNN_QUERY3",
        label: "KNN Query 3",
        description: "Run a vector search for 'Female specific mountain bike'",
      },
      {
        queryId: "VECTORS_HYBRID_QUERY1",
        label: "Hybrid Query",
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

    if (!query && retObj.queryFile) {
      query = fs.readFileSync(
        socketState.APP_ROOT_DIR + retObj.queryFile,
        "binary"
      );
    }

    query = query.replace("{dbIndexName}", dbIndexName);
    retObj.query = query;
  }

  return retObj;
};

export { queryNavbarData, queryIdDataMap, getQueryDataById };

export type { QueryIdType };
