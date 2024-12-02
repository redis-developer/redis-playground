# pgLoadDataSourceInRedis

## Request

```json
POST http://localhost:3001/api/pgLoadDataSourceInRedis
{
  "isAll":false,
  "dataSourceIds":["FASHION_DS"]
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
        "totalTimeInMs": 10235
      },
      "importErrors": [],
      "currentStatus": "success",
      "dataSourceId": "FASHION_DS"
    },
    {
      "stats": {
        "totalFiles": 500,
        "processed": 500,
        "failed": 0,
        "totalTimeInMs": 394
      },
      "importErrors": [],
      "currentStatus": "success",
      "dataSourceId": "TEST_CSV_DS"
    }
  ],
  "error": null
}
```

Note: check `console logs` or `RedisInsight` or `application UI` for file import status.
