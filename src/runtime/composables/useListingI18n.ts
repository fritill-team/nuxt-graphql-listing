import en from '#listing/i18n/locales/en'
import ar from '#listing/i18n/locales/ar'

type Messages = Record<string, any>
type Params = Record<string, string | number>

const messages: Record<string, Messages> = {
  en,
  ar,
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
  const i18n = (nuxtApp as any).$i18n

  const locale = computed(() => {
    const rawLocale = i18n?.locale
    if (typeof rawLocale === 'string') return rawLocale
    if (rawLocale && typeof rawLocale === 'object' && 'value' in rawLocale) {
      return (rawLocale as { value: string }).value
    }
    return 'en'
  })

  const t = (key: string, params?: Params) => {
    if (typeof i18n?.t === 'function') {
      return i18n.t(key, params)
    }
    const active = messages[locale.value] ?? messages.en
    const resolved = resolvePath(active, key)
    return resolved ? formatMessage(resolved, params) : key
  }

  return { t, locale }
}
