import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  // 1) Where to get the schema
  //    - either a remote endpoint of your courses GraphQL API
  //    - or a local SDL file
  schema: 'http://localhost:8000/graphql',

  // 2) Where your queries live inside this layer
  documents: ['playground/graphql/**/*.graphql'],

  // 3) Where to output TS types
  generates: {
    'playground/types/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typed-document-node',
      ],
      config: {
        // good TS defaults
        avoidOptionals: true,
        maybeValue: 'T | null',
        enumsAsTypes: true,
        useTypeImports: true,
      },
    },
  },
}

export default config
