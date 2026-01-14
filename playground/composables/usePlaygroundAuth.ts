import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type TokenPayload = {
  exp?: number
}

export const usePlaygroundAuth = () => {
  const accessToken = useCookie<string | null>('playground-access-token', { sameSite: 'lax' })
  const refreshToken = useCookie<string | null>('playground-refresh-token', { sameSite: 'lax' })
  const isAuthenticated = computed(() => Boolean(accessToken.value))
  const refreshTimer = ref<ReturnType<typeof setTimeout> | null>(null)
  const tokenEndpoint = '/api/auth/token'

  const parseToken = (token: string): TokenPayload => {
    if (import.meta.server) {
      return {}
    }
    try {
      const payload = token.split('.')[1]
      if (!payload) {
        return {}
      }
      return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    } catch {
      return {}
    }
  }

  const getTokenExpiry = (token: string | null) => {
    if (!token) {
      return null
    }
    const payload = parseToken(token)
    return payload.exp ? payload.exp * 1000 : null
  }

  const refreshTokens = async () => {
    if (!refreshToken.value) {
      return false
    }

    try {
      const response = await $fetch<{
        access_token?: string
        refresh_token?: string
      }>(tokenEndpoint, {
        method: 'POST',
        body: {
          grant_type: 'refresh_token',
          refresh_token: refreshToken.value
        }
      })

      if (!response.access_token) {
        return false
      }

      accessToken.value = response.access_token
      refreshToken.value = response.refresh_token || refreshToken.value
      return true
    } catch {
      return false
    }
  }

  const ensureFreshToken = async () => {
    if (!accessToken.value && refreshToken.value) {
      await refreshTokens()
      return
    }

    const expiresAt = getTokenExpiry(accessToken.value)
    if (!expiresAt) {
      return
    }
    const now = Date.now()
    if (expiresAt - now <= 30_000) {
      await refreshTokens()
    }
  }

  const scheduleRefresh = () => {
    if (refreshTimer.value) {
      clearTimeout(refreshTimer.value)
      refreshTimer.value = null
    }

    const expiresAt = getTokenExpiry(accessToken.value)
    if (!expiresAt) {
      return
    }
    const now = Date.now()
    const refreshIn = Math.max(expiresAt - now - 60_000, 5_000)
    refreshTimer.value = setTimeout(() => {
      ensureFreshToken()
    }, refreshIn)
  }

  const logout = () => {
    accessToken.value = null
    refreshToken.value = null
  }

  watch(accessToken, () => {
    scheduleRefresh()
  })

  onMounted(() => {
    ensureFreshToken()
    scheduleRefresh()
  })

  onBeforeUnmount(() => {
    if (refreshTimer.value) {
      clearTimeout(refreshTimer.value)
    }
  })

  return {
    accessToken,
    refreshToken,
    isAuthenticated,
    ensureFreshToken,
    refreshTokens,
    logout
  }
}
