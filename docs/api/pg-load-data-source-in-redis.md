# pgLoadDataSourceInRedis

## Request

```json
POST http://localhost:3001/api/pgLoadDataSourceInRedis
{
"isAll":false,
"ids":["fashion-ds"]
}
```

## Response

```json
{
  "data": [
    {
      "stats": {
        "totalFiles": 11111,
        "processed": 11111,
        "failed": 0,
        "totalTimeInMs": 10528
      },
      "importErrors": [],
      "currentStatus": "success",
      "id": "fashion-ds"
    },
    {
      "stats": {
        "totalFiles": 500,
        "processed": 500,
        "failed": 0,
        "totalTimeInMs": 398
      },
      "importErrors": [],
      "currentStatus": "success",
      "id": "test-csv-ds"
    }
  ],
  "error": null
}
```

Note: check `console logs` or `RedisInsight` or `application UI` for file import status.
