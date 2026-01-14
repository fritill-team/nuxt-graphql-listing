export default defineNuxtRouteMiddleware(() => {
  const { accessToken } = usePlaygroundAuth()
  if (accessToken.value) {
    return navigateTo('/')
  }
})
