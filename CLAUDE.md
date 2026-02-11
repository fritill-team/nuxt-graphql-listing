## Memory Protocol

- **Before starting work**: Call `recall()` to load relevant context
- **After decisions**: Call `remember()` with category "decision" and your reasoning
- **When you find a gotcha**: Call `remember()` with category "gotcha"
- **After completing a feature**: Summarize what was built and `remember()` it
- **When patterns emerge**: Call `remember()` with category "convention"


## Nuxt Module Production Reference

This module follows the Fritill Nuxt module production pattern established in `@fritill-team/nuxt-graphql-listing`.

To recall the full guide, use the MCP memory tool:
- `mcp__memory__search` with query: "Nuxt Module Production Guide"
- `mcp__memory__recall` with tags: ["nuxt-module", "fritill"]

Key topics available:
- "Nuxt Module Production Guide - Project Structure" (ID 9309)
- "Nuxt Module Production Guide - package.json Configuration" (ID 9310)
- "Nuxt Module Production Guide - module.ts Definition Pattern" (ID 9311)
- "Nuxt Module Production Guide - Standalone i18n Pattern" (ID 9312)
- "Nuxt Module Production Guide - CI/CD Pipeline" (ID 9313)
- "Nuxt Module Production Guide - Common Gotchas and Fixes" (ID 9314)
- "Nuxt Module Production Guide - Production Checklist" (ID 9315)

Full guide file: ~/.claude/memory/nuxt-module-guide.md

When preparing this module for production, recall the checklist first:
mcp__memory__recall with topic: "Nuxt Module Production Guide - Production Checklist"
