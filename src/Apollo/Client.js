import ApolloClient from "apollo-boost";
import { defaults, resolvers } from "./LocalState";

export default new ApolloClient({
  uri: "http://localhost:1234",
  clientState: {
    defaults,
    resolvers
  }
});
