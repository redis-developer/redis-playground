let sampleUserJson = {
  userId: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "1234567890",
  address: "123 Main St",
  city: "NEW YORK",
  state: "NY",
  zipCode: 10001,
  country: "USA",
  gender: "M",
  company: "ABC",
  jobTitle: "Software Engineer",
};

const userSearchIndex = `FT.CREATE {dbIndexName}
 ON JSON
 PREFIX 1 {keyPrefix}
 SCHEMA
 $.userId AS userId NUMERIC
 $.firstName AS firstName TAG
 $.lastName AS lastName TAG
 $.email AS email TAG
 $.phoneNumber AS phoneNumber TAG
 $.address AS address TAG
 $.city AS city TAG
 $.state AS state TAG
 $.zipCode AS zipCode NUMERIC
 $.country AS country TAG
 $.gender AS gender TAG
 $.company AS company TAG
 $.jobTitle AS jobTitle TAG
`;

export { userSearchIndex };
