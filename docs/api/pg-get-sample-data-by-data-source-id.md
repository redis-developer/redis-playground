# pgGetSampleDataByDataSourceId

## Request

```json
POST http://localhost:3001/api/pgGetSampleDataByDataSourceId
{
  "dataSourceId":"FASHION_DS",
  "dataCount":10
}
```

## Response

```json
{
  "data": [
    {
      "productId": 55925,
      "price": 110,
      "productDisplayName": "Colorbar Flirty Mauve Nail Lacquer 49",
      "variantName": "Nail Polish",
      "brandName": "colorbar",
      "ageGroup": "Adults-Women",
      "gender": "women",
      "productColors": "Mauve,NA",
      "season": "Spring",
      "usage": "Casual",
      "masterCategoryType": "personal-care",
      "subCategoryType": "nails",
      "productDescription": "<p>Chip-resistant and prevents yellowing of nails<br />Fast drying and long wearing<br />Simple one stroke application</p>",
      "imageLink": "http://assets.myntassets.com/assets/images/55925/2019/1/11/191becd2-ccdd-48b1-8b0f-32b620b531731547188206086-Colorbar-Flirty-Mauve-Nail-Lacquer-49-6341547188205790-1.jpg"
    }
    //...
  ],
  "error": null
}
```
