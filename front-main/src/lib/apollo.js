import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
    uri: 'https://api.ccef.com.br/graphql',
    cache: new InMemoryCache(),
});
