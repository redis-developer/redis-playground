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

import * as VECTOR_SETS_ELE_SIMILARITY_WITH_SCORES from "./vector-sets/ele-similarity/with-scores.js";
import * as VECTOR_SETS_ELE_SIMILARITY_WITH_SCORES_AND_COUNT from "./vector-sets/ele-similarity/with-scores-and-count.js";
import * as VECTOR_SETS_ELE_SIMILARITY_FILTER_BY_LOGICAL_OPERATOR from "./vector-sets/ele-similarity/filter-by-logical-operator.js";
import * as VECTOR_SETS_ELE_SIMILARITY_FILTER_BY_COMPARISON_OPERATOR from "./vector-sets/ele-similarity/filter-by-comparison-operator.js";
import * as VECTOR_SETS_ELE_SIMILARITY_FILTER_BY_CONTAINMENT_OPERATOR from "./vector-sets/ele-similarity/filter-by-containment-operator.js";
import * as VECTOR_SETS_ELE_SIMILARITY_FILTER_BY_ARITHMETIC_OPERATOR from "./vector-sets/ele-similarity/filter-by-arithmetic-operator.js";
import * as VECTOR_SETS_ELE_SIMILARITY_FILTER_GROUPING from "./vector-sets/ele-similarity/filter-grouping.js";

import * as VECTOR_SETS_VALUE_SIMILARITY_WITH_SCORES from "./vector-sets/value-similarity/with-scores.js";
import * as VECTOR_SETS_VALUE_SIMILARITY_WITH_SCORES_AND_COUNT from "./vector-sets/value-similarity/with-scores-and-count.js";
import * as VECTOR_SETS_VALUE_SIMILARITY_FILTER_BY_LOGICAL_OPERATOR from "./vector-sets/value-similarity/filter-by-logical-operator.js";
import * as VECTOR_SETS_VALUE_SIMILARITY_FILTER_BY_COMPARISON_OPERATOR from "./vector-sets/value-similarity/filter-by-comparison-operator.js";
import * as VECTOR_SETS_VALUE_SIMILARITY_FILTER_BY_CONTAINMENT_OPERATOR from "./vector-sets/value-similarity/filter-by-containment-operator.js";
import * as VECTOR_SETS_VALUE_SIMILARITY_FILTER_BY_ARITHMETIC_OPERATOR from "./vector-sets/value-similarity/filter-by-arithmetic-operator.js";
import * as VECTOR_SETS_VALUE_SIMILARITY_FILTER_GROUPING from "./vector-sets/value-similarity/filter-grouping.js";

import {
  DATA_SOURCE_ID,
  DB_INDEX_ID,
  getFilteredDataSources,
  getFilteredDbIndexes,
} from "../../config.js";

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
  VECTOR_SETS_ELE_SIMILARITY_WITH_SCORES,
  VECTOR_SETS_ELE_SIMILARITY_WITH_SCORES_AND_COUNT,
  VECTOR_SETS_ELE_SIMILARITY_FILTER_BY_LOGICAL_OPERATOR,
  VECTOR_SETS_ELE_SIMILARITY_FILTER_BY_COMPARISON_OPERATOR,
  VECTOR_SETS_ELE_SIMILARITY_FILTER_BY_CONTAINMENT_OPERATOR,
  VECTOR_SETS_ELE_SIMILARITY_FILTER_BY_ARITHMETIC_OPERATOR,
  VECTOR_SETS_ELE_SIMILARITY_FILTER_GROUPING,
  VECTOR_SETS_VALUE_SIMILARITY_WITH_SCORES,
  VECTOR_SETS_VALUE_SIMILARITY_WITH_SCORES_AND_COUNT,
  VECTOR_SETS_VALUE_SIMILARITY_FILTER_BY_LOGICAL_OPERATOR,
  VECTOR_SETS_VALUE_SIMILARITY_FILTER_BY_COMPARISON_OPERATOR,
  VECTOR_SETS_VALUE_SIMILARITY_FILTER_BY_CONTAINMENT_OPERATOR,
  VECTOR_SETS_VALUE_SIMILARITY_FILTER_BY_ARITHMETIC_OPERATOR,
  VECTOR_SETS_VALUE_SIMILARITY_FILTER_GROUPING,
};
type QueryIdType = keyof typeof queryIdDataMap;

const vectorSetsNavBarData = [
  {
    category: "VectorSets ELE Similarity",
    categoryId: "VECTOR_SETS_ELE_SIMILARITY",
    items: [
      {
        queryId: "VECTOR_SETS_ELE_SIMILARITY_WITH_SCORES",
        label: "With Scores",
        description: "Retrieve elements similar to an existing element 's4'",
      },
      {
        queryId: "VECTOR_SETS_ELE_SIMILARITY_WITH_SCORES_AND_COUNT",
        label: "With Scores And Count",
        description:
          "Retrieve elements similar to an existing element 's4' and limit the results to 5",
      },
      {
        queryId: "VECTOR_SETS_ELE_SIMILARITY_FILTER_BY_LOGICAL_OPERATOR",
        label: "Filter By Logical Operator",
        description:
          "Retrieve elements similar to an existing element 's4' and filter the results by word count",
      },
      {
        queryId: "VECTOR_SETS_ELE_SIMILARITY_FILTER_BY_COMPARISON_OPERATOR",
        label: "Filter By Comparison Operator",
        description:
          "Retrieve elements similar to an existing element 's4' and filter the results by activity type",
      },
      {
        queryId: "VECTOR_SETS_ELE_SIMILARITY_FILTER_BY_CONTAINMENT_OPERATOR",
        label: "Filter By Containment Operator",
        description:
          "Retrieve elements similar to an existing element 's4' and filter the results by matching activity types",
      },
      {
        queryId: "VECTOR_SETS_ELE_SIMILARITY_FILTER_BY_ARITHMETIC_OPERATOR",
        label: "Filter By Arithmetic Operator",
        description:
          "Retrieve elements similar to an existing element 's4' and filter the results by even word count",
      },
      {
        queryId: "VECTOR_SETS_ELE_SIMILARITY_FILTER_GROUPING",
        label: "Filter Grouping",
        description:
          "Retrieve elements similar to an existing element 's4' , filter the results to include only those with an even word count and a combined word and character count greater than 30",
      },
    ],
  },
  {
    category: "VectorSets Value Similarity",
    categoryId: "VECTOR_SETS_VALUE_SIMILARITY",
    items: [
      {
        queryId: "VECTOR_SETS_VALUE_SIMILARITY_WITH_SCORES",
        label: "With Scores",
        description:
          "Retrieve elements with embedding values similar to the phrase 'She is playing a guitar'",
      },
      {
        queryId: "VECTOR_SETS_VALUE_SIMILARITY_WITH_SCORES_AND_COUNT",
        label: "With Scores And Count",
        description:
          "Retrieve elements with embedding values similar to the phrase 'She is playing a guitar' and limit the results to 5",
      },
      {
        queryId: "VECTOR_SETS_VALUE_SIMILARITY_FILTER_BY_LOGICAL_OPERATOR",
        label: "Filter By Logical Operator",
        description:
          "Retrieve elements with embedding values similar to the phrase 'She is playing a guitar' and filter the results by word count",
      },
      {
        queryId: "VECTOR_SETS_VALUE_SIMILARITY_FILTER_BY_COMPARISON_OPERATOR",
        label: "Filter By Comparison Operator",
        description:
          "Retrieve elements with embedding values similar to the phrase 'She is playing a guitar' and filter the results by activity type",
      },
      {
        queryId: "VECTOR_SETS_VALUE_SIMILARITY_FILTER_BY_CONTAINMENT_OPERATOR",
        label: "Filter By Containment Operator",
        description:
          "Retrieve elements with embedding values similar to the phrase 'She is playing a guitar' and filter the results by matching activity types",
      },
      {
        queryId: "VECTOR_SETS_VALUE_SIMILARITY_FILTER_BY_ARITHMETIC_OPERATOR",
        label: "Filter By Arithmetic Operator",
        description:
          "Retrieve elements with embedding values similar to the phrase 'She is playing a guitar' and filter the results by even word count",
      },
      {
        queryId: "VECTOR_SETS_VALUE_SIMILARITY_FILTER_GROUPING",
        label: "Filter Grouping",
        description:
          "Retrieve elements with embedding values similar to the phrase 'She is playing a guitar' , filter the results to include only those with an even word count and a combined word and character count greater than 30",
      },
    ],
  },
];

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
        label: "New field Using APPLY",
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
  //...vectorSetsNavBarData,
];

const getQueryDataById = (queryId: QueryIdType) => {
  const retObj = queryIdDataMap[queryId].default;
  retObj.queryId = queryId;
  let keyPrefix = "";
  let dbIndexName = "";

  if (retObj.dbIndexId) {
    const dbIndexes = getFilteredDbIndexes([retObj.dbIndexId as DB_INDEX_ID]);
    if (dbIndexes.length > 0) {
      dbIndexName = dbIndexes[0].dbIndexName;
      keyPrefix = dbIndexes[0].keyPrefix;
      let query = retObj.query;

      if (!query && retObj.queryFile) {
        query = fs.readFileSync(
          socketState.APP_ROOT_DIR + retObj.queryFile,
          "binary"
        );
      }

      if (dbIndexName) {
        query = query.replace(/{dbIndexName}/g, dbIndexName);
      }
      if (keyPrefix) {
        query = query.replace(/{keyPrefix}/g, keyPrefix);
      }
      retObj.query = query;
    }
  }

  if (!keyPrefix && retObj.query.includes("{keyPrefix}")) {
    // like vector set queries without dbIndexId
    let filteredDataSources = getFilteredDataSources(
      [retObj.dataSourceId as DATA_SOURCE_ID],
      false,
      ""
    );
    if (filteredDataSources.length > 0) {
      const dataSource = filteredDataSources[0];
      keyPrefix = dataSource.keyPrefix || "";

      if (keyPrefix) {
        retObj.query = retObj.query.replace(/{keyPrefix}/g, keyPrefix);
      }
    }
  }

  return retObj;
};

export { queryNavbarData, queryIdDataMap, getQueryDataById };

export type { QueryIdType };
