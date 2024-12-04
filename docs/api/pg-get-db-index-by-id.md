# pgGetDbIndexById

## Request

```json
POST http://localhost:3001/api/pgGetDbIndexById
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
      "dbIndexName": "fashionSearchIndex",
      "dbIndexQuery": "\nFT.CREATE ...\n",
      "dataSourceId": "FASHION_DS"
    }
  ],
  "error": null
}
```
