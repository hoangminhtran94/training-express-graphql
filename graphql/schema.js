import { buildSchema } from "graphql";
export const schema = buildSchema(`#graphql
  type TestData {
    text: String!
    views: Int!
  }

  type RootQuery {
    hello: TestData!
  } 

  schema {
  query: RootQuery
  }
`);
