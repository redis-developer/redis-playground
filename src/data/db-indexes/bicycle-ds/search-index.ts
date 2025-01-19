let sampleBicycleJson = {
  model: "ThrillCycle",
  brand: "BikeShind",
  price: 815,
  description:
    "An artsy, retro-inspired bicycle that's as functional as it is pretty: The ThrillCycle steel frame offers a smooth ride. A 9-speed drivetrain has enough gears for coasting in the city, but we wouldn't suggest taking it to the mountains. Fenders protect you from mud, and a rear basket lets you transport groceries, flowers and books. The ThrillCycle comes with a limited lifetime warranty, so this little guy will last you long past graduation.",
  condition: "refurbished",
};

const bicycleSearchIndex = `FT.CREATE {dbIndexName}
 ON JSON
 PREFIX 1 {keyPrefix}
 SCHEMA
 $.brand AS brand TEXT WEIGHT 1.0     
 $.model AS model TEXT WEIGHT 1.0              
 $.description AS description TEXT WEIGHT 1.0  
 $.price AS price NUMERIC                     
 $.condition AS condition TAG SEPARATOR ,      
`;

export { bicycleSearchIndex };
