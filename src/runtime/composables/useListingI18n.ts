import en from '../i18n/locales/en'
import ar from '../i18n/locales/ar'

type Messages = Record<string, any>
type Params = Record<string, string | number>

const defaultMessages: Record<string, Messages> = {
  en,
  ar,
}

function deepMerge(target: Messages, source: Messages): Messages {
  const result = { ...target }
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key])
    } else {
      result[key] = source[key]
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
    const overrides = appConfig?.listing?.messages?.[localeCode]
    if (overrides) {
      return deepMerge(base, overrides)
    }

    return base
  }

  const t = (key: string, params?: Params) => {
    const resolved = resolvePath(getMessages(), key)
    return resolved ? formatMessage(resolved, params) : key
  }

  return { t, locale }
}
