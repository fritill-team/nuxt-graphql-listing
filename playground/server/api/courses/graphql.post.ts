import { getCoursesUrls } from '../../utils/getUrl'

export default defineEventHandler(async (event) => {
  const url = getCoursesUrls('graphql')
  const body = await readBody(event)
  try {
    return await $fetch(url, {
      method: 'POST',
      body,
      headers: {'content-type': 'application/json'},
    })
  } catch (e: any) {
    console.log(e)
    const status = e?.response?.status ?? e?.statusCode ?? e?.status ?? 500
    const data = e?.response?.data ?? e?.data
    throw createError({statusCode: status, statusMessage: 'GraphQL upstream error', data})
  }
})
