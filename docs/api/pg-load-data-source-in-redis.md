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
      "id": "fashion-ds",
      "stats": {
        "totalFiles": 11111,
        "processed": 11111,
        "failed": 0,
        "totalTimeInMs": 12661
      },
      "importErrors": [],
      "currentStatus": "success"
    }
  ],
  "error": null
}
```

Note: check `console logs` or `RedisInsight` or `application UI` for file import status.
