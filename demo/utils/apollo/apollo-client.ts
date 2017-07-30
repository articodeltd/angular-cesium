import { ApolloClient, createNetworkInterface } from 'apollo-client';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: process.env.SERVER + '/graphql',
  }),
});

export function getApolloClient(): ApolloClient {
  return client;
}