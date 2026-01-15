import en from '../i18n/locales/en.json'
import ar from '../i18n/locales/ar.json'

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

  const getMessages = (): Messages =>
    (messages[locale.value] ?? messages.en) as Messages

  const t = (key: string, params?: Params) => {
    if (typeof i18n?.t === 'function') {
      return i18n.t(key, params)
    }
    const resolved = resolvePath(getMessages(), key)
    return resolved ? formatMessage(resolved, params) : key
  }

  return { t, locale }
}
