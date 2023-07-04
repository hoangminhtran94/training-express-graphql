import { buildSchema } from "graphql";
import { query } from "./../../node_modules/@types/express/index.d";
export const schema = buildSchema(`#graphql
type TestData {
  text:String!
  views:Int!
}

type RootQuery {
    hello:TestData!
}

schema {
  query:RootQuery
}


`);
