import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client/core'

export default defineNuxtPlugin((_nuxtApp) => {
  const makeClient = (uri: string) =>
    new ApolloClient({
      link: new HttpLink({
        uri,
        // Nitro/Node provide global fetch; bind for safety
        fetch: globalThis.fetch.bind(globalThis),
      }),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {fetchPolicy: 'no-cache', errorPolicy: 'all'},
        query: {fetchPolicy: 'no-cache', errorPolicy: 'all'},
        mutate: {errorPolicy: 'all'},
      },
    })


  return {
    provide: {
      courses: makeClient('/api/courses/graphql'),
    },
  }
})

