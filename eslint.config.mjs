import {createConfigForNuxt} from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: false,
  },
  dirs: {
    src: [
      './playground',
    ],
  },
}).prepend({
  ignores: [
    'src/runtime/**/*.mjs',
    'src/runtime/**/*.js',
    'src/runtime/**/*.d.ts',
    'src/runtime/**/*.d.vue.ts',
    'src/runtime/**/*.vue.d.ts',
  ],
}).append({
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'vue/first-attribute-linebreak': 'off',
    'vue/attributes-order': 'off',
    'vue/require-default-prop': 'off',
    'vue/html-self-closing': 'off',
  },
})
