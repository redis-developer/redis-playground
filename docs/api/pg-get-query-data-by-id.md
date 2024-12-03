# pgGetQueryDataById

## Request

```json
POST http://localhost:3001/api/pgGetQueryDataById
{
  "queryIds":["JSON_TAG_FIELD_EXACT_MATCH","JSON_TAG_FIELD_PREFIX_MATCH"]
}
```

## Response

```json
{
  "data": [
    {
      "query": "FT.SEARCH {dbIndexName} \"@brandName:{nike}\"",
      "dbIndexId": "FASHION_DS_SEARCH_INDEX",
      "dataSourceId": "FASHION_DS",
      "queryId": "JSON_TAG_FIELD_EXACT_MATCH"
    },
    {
      "query": "FT.SEARCH {dbIndexName} \"@brandName:{tokyo*}\"",
      "dbIndexId": "FASHION_DS_SEARCH_INDEX",
      "dataSourceId": "FASHION_DS",
      "queryId": "JSON_TAG_FIELD_PREFIX_MATCH"
    }
  ],
  "error": null
}
```
