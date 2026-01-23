<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'


const {locale} = useI18n()
const lang = computed(() => locales[locale.value].code)
const dir = computed(() => locales[locale.value].dir)
const fontClass = computed(() =>
  ['ar', 'fa', 'ur'].includes(locale.value) ? 'font-arabic' : 'font-english'
)

// Keep <html> dir/lang aligned with current locale reactively
useHead({
  htmlAttrs: {
    lang: computed(() => lang.value || 'en'),
    dir: computed(() => (dir.value as 'ltr' | 'rtl') || 'ltr'),
  },
})
</script>

<template>
  <UApp
    :locale="locales[locale]"
    :class="[fontClass, 'min-h-screen duration-300']">
    <AppHeader/>
    <UMain>
      <div
        class="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-full py-7 sm:max-w-(--ui-container) sm:mx-auto">
        <slot/>
      </div>
    </UMain>
  </UApp>
</template>
