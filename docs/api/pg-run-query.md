# pgRunQuery

## Request

```json
POST http://localhost:3001/api/pgRunQuery
{
  "customQuery":"",
  "queryId":"JSON_TAG_FIELD_EXACT_MATCH",
  "userId":"user_123"
}
```

## Response

```json
{
  "queryResult": "query result",
  "userId": "user_123"
}
```
