import { computed } from 'vue'
import { useNuxtApp, useAppConfig } from '#imports'
import en from '../i18n/locales/en'
import ar from '../i18n/locales/ar'

type Messages = Record<string, any>
type Params = Record<string, string | number>

const defaultMessages: Record<string, Messages> = {
  en,
  ar,
}

function isPlainObject(val: unknown): val is Messages {
  return !!val && typeof val === 'object' && !Array.isArray(val)
}

function deepMerge(target: Messages, source?: Messages): Messages {
  const result: Messages = { ...target }
  if (!source) return result
  for (const key in source) {
    const srcVal = source[key]
    if (isPlainObject(srcVal)) {
      const tgtVal = isPlainObject(result[key]) ? (result[key] as Messages) : {}
      result[key] = deepMerge(tgtVal, srcVal)
    } else {
      result[key] = srcVal
    }
  }
  return result
}

function resolvePath(obj: Messages, path: string): string | undefined {
  const value = path.split('.').reduce<any>((acc, key) => (acc ? acc[key] : undefined), obj)
  return typeof value === 'string' ? value : undefined
}

function formatMessage(template: string, params?: Params): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_match, key) => {
    if (params[key] === undefined || params[key] === null) return `{${key}}`
    return String(params[key])
  })
}

export function useListingI18n() {
  const nuxtApp = useNuxtApp()
  const appConfig = useAppConfig() as any
  const i18n = (nuxtApp as any).$i18n

  // Get locale: prefer i18n, fallback to appConfig, default to 'en'
  const locale = computed(() => {
    // Try @nuxtjs/i18n first
    if (i18n?.locale) {
      const rawLocale = i18n.locale
      if (typeof rawLocale === 'string') return rawLocale
      if (rawLocale && typeof rawLocale === 'object' && 'value' in rawLocale) {
        return (rawLocale as { value: string }).value
      }
    }
    // Fallback to app.config
    return appConfig?.listing?.locale || 'en'
  })

  const getMessages = (): Messages => {
    const localeCode = locale.value
    const base = defaultMessages[localeCode] ?? defaultMessages.en

    // Merge with app.config overrides if provided
    const overrides: Messages = appConfig?.listing?.messages?.[localeCode] ?? {}
    return deepMerge(base as Messages, overrides)
  }

  const t = (key: string, params?: Params) => {
    const resolved = resolvePath(getMessages(), key)
    return resolved ? formatMessage(resolved, params) : key
  }

  return { t, locale }
}
