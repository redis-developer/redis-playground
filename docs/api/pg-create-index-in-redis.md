# pgCreateIndexInRedis

## Request

```json
POST http://localhost:3001/api/pgCreateIndexInRedis
{
  "isAll":false,
  "dbIndexIds":["FASHION_DS_SEARCH_INDEX"]
}
```

## Response

```json
{
  "data": [
    {
      "dbIndexId": "FASHION_DS_SEARCH_INDEX",
      "dbIndexStatus": "OK"
    }
  ],
  "error": null
}
```
