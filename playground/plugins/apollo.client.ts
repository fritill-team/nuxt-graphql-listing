import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'

export default defineNuxtPlugin((_nuxtApp) => {
  const makeClient = (uri: string) =>
    new ApolloClient({
      link: new HttpLink({
        uri,
        fetch: globalThis.fetch.bind(globalThis), // works SSR & client
      }),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: { fetchPolicy: 'no-cache', errorPolicy: 'all' },
        query: { fetchPolicy: 'no-cache', errorPolicy: 'all' },
        mutate: { errorPolicy: 'all' },
      },
    })

  return {
    provide: {
      courses: makeClient('/api/courses/graphql'),
    },
  }
})
