import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        navTitle: z.string().optional(),
        order: z.number().default(99)
      })
    })
  }
})
