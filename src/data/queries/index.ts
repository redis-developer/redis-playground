import * as JSON_GENERAL_MULTI_FIELD_AND_CONDITION from "./json/general/multi-field-and-condition.js";
import * as JSON_GENERAL_MULTI_FIELD_OR_CONDITION from "./json/general/multi-field-or-condition.js";
import * as JSON_GENERAL_NEGATIVE_CONDITION from "./json/general/negative-condition.js";
import * as JSON_TAG_FIELD_EXACT_MATCH from "./json/tag-field/exact-match.js";
import * as JSON_TAG_FIELD_PREFIX_MATCH from "./json/tag-field/prefix-match.js";
import * as JSON_TAG_FIELD_MULTI_VALUE_AND_MATCH from "./json/tag-field/multi-value-and-match.js";
import * as JSON_TAG_FIELD_MULTI_VALUE_OR_MATCH from "./json/tag-field/multi-value-or-match.js";

const queryIdDataMap = {
  JSON_GENERAL_MULTI_FIELD_AND_CONDITION,
  JSON_GENERAL_MULTI_FIELD_OR_CONDITION,
  JSON_GENERAL_NEGATIVE_CONDITION,
  JSON_TAG_FIELD_EXACT_MATCH,
  JSON_TAG_FIELD_PREFIX_MATCH,
  JSON_TAG_FIELD_MULTI_VALUE_AND_MATCH,
  JSON_TAG_FIELD_MULTI_VALUE_OR_MATCH,
};
type QueryIdType = keyof typeof queryIdDataMap;

const queryNavbarData = [
  {
    category: "JSON General",
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
    ],
  },
  {
    category: "JSON Tag Field",
    items: [
      {
        queryId: "JSON_TAG_FIELD_EXACT_MATCH",
        label: "Exact Match",
        description: "Search for an exact match of a tag field value",
      },
      {
        queryId: "JSON_TAG_FIELD_PREFIX_MATCH",
        label: "Prefix Match",
        description: "Search for a prefix match of a tag field value",
      },
      {
        queryId: "JSON_TAG_FIELD_MULTI_VALUE_AND_MATCH",
        label: "Multi Value AND Match",
        description:
          "Search for multiple values of a tag field using AND condition",
      },
      {
        queryId: "JSON_TAG_FIELD_MULTI_VALUE_OR_MATCH",
        label: "Multi Value OR Match",
        description:
          "Search for multiple (optional) values of a tag field using OR condition",
      },
    ],
  },
];

const getQueryDataById = (queryId: QueryIdType) => {
  const retObj: any = queryIdDataMap[queryId].default;
  retObj.queryId = queryId;
  return retObj;
};

export { queryNavbarData, queryIdDataMap, getQueryDataById };

export type { QueryIdType };
