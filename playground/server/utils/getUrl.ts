export const getCoursesUrls = (type: 'graphql' | 'api') => {
  const config = useRuntimeConfig()
  // Parse boolean-like env correctly; env vars are strings in runtimeConfig
  const isDevMode = String(config.public.coursesDevMode).toLowerCase() === 'true'
  const urls = {
    dev: {
      graphql: `${config.public.coursesBaseUrl}/graphql`,
      api: `${config.public.coursesBaseUrl}/api/v1/courses`
    },
    prod: {
      graphql: `${config.apiUrl}/courses/graphql`,
      api: `${config.apiUrl}/courses`
    }
  }
  return isDevMode ? urls.dev[type] : urls.prod[type]
}
