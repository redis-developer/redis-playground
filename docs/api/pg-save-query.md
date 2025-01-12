# pgSaveQuery

## Request

```json
POST http://localhost:3001/api/pgSaveQuery
{
  "customQuery":"FT.SEARCH 'pg:userSearchIndex' '@country:{AUSTRALIA} @gender:{F}'",
  "title":"User Search Query",
  "categoryId":"001",
  "queryId":"JSON_GENERAL_MULTI_FIELD_OR_CONDITION"
}
```

## Response

```json
{
  "data": {
    "_id": "pg:savedQueries:7a428c70-8745-41f8-8dc7-6076fe4defcf"
  },
  "error": null
}
```
