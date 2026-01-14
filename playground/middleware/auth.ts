export default defineNuxtRouteMiddleware(async (to) => {
  const { accessToken, refreshToken, ensureFreshToken } = usePlaygroundAuth()

  if (!accessToken.value && refreshToken.value) {
    await ensureFreshToken()
  }

  if (!accessToken.value) {
    return navigateTo('/auth')
  }
})
