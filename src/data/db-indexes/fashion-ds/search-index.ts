let sampleProductJson = {
  productId: 45982,
  price: 399,
  brandName: "tokyo-talkies",
  gender: "women",
  masterCategoryType: "apparel",
  subCategoryType: "topwear",
  productColors: "Blue,NA",
  productDisplayName: "Tokyo Talkies Women Blue Top",
  displayCategories: "Sale and Clearance,Casual Wear,Sale",
  productDescription:
    "<p>Blue round neck top, has raglin sleeves, graphic print on the front and elastication at the sides of the hem</p>",

  imageLink:
    "http://assets.myntassets.com/v1/images/style/properties/Tokyo-Talkies-Women-Blue-Top_315ae0ca9c48b7cd4ab0278a743cb452_images.jpg",
  variantName: "UBT KT GR Solid/ ROUND NECK",
  ageGroup: "Adults-Women",
  season: "Fall",
  usage: "Casual",
};

const fashionSearchIndex = `
FT.CREATE {dbIndexName}
 ON JSON
 PREFIX 1 {keyPrefix}
 SCHEMA
 $.productId AS productId NUMERIC
 $.price AS price NUMERIC
 $.brandName AS brandName TAG 
 $.gender AS gender TAG 
 $.masterCategoryType AS masterCategoryType TAG 
 $.subCategoryType AS subCategoryType TAG 
 $.productColors AS productColors TAG  
 $.productDisplayName AS productDisplayName TAG  
 $.displayCategories AS displayCategories TAG SEPARATOR ,  
 $.productDescription AS productDescription TEXT
`;

export { fashionSearchIndex };
