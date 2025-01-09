# pgGetSavedQuery

## Request

```json
POST http://localhost:3001/api/pgGetSavedQuery
{
  "partialId":"7a428c70-8745-41f8-8dc7-6076fe4defcf"
}
```

## Response

```json
{
  "data": {
    "_id": "pg:savedQueries:7a428c70-8745-41f8-8dc7-6076fe4defcf",
    "customQuery": "FT.SEARCH 'pg:userSearchIndex' '@country:{INDIA} @gender:{F}'",
    "createdOn": "2025-01-09T10:30:14.477Z",
    "title": "User Search Query",
    "queryId": "JSON_GENERAL_MULTI_FIELD_OR_CONDITION"
  },
  "error": null
}
```
