let sampleBikeHash = {
  model: "Saturn",
  brand: "BikeShind",
  price: 3837,
  type: "Enduro bikes",
  material: "alloy",
  weight: 7.2,
  description:
    "This bike fills the space between a pure XC race bike, and a trail bike. It is light, with shorter travel (115mm rear and 120mm front), and quick handling. It has a lightweight frame and all-carbon fork, with cables routed internally. That said, we feel this bike is a fantastic option for the rider seeking the versatility that this highly adjustable bike provides.",
  description_embeddings: "p\xaa\xcb\xbc....",
};

const bikeVssIndex = `FT.CREATE {dbIndexName}
    ON HASH
        PREFIX 1 {keyPrefix}
 SCHEMA
   model TEXT NOSTEM SORTABLE
   brand TEXT NOSTEM SORTABLE
   price NUMERIC SORTABLE
   type TAG
   material TAG
   weight NUMERIC SORTABLE
   description_embeddings VECTOR FLAT 10
        TYPE FLOAT32
        DIM 768
        DISTANCE_METRIC L2
        INITIAL_CAP 111
        BLOCK_SIZE  111`;

export { bikeVssIndex };
``;
