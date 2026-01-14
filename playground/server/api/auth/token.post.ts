import { createError, defineEventHandler, readBody } from 'h3'

type TokenRequestBody = {
  grant_type?: 'password' | 'refresh_token'
  username?: string
  password?: string
  refresh_token?: string
}

export default defineEventHandler(async (event) => {
  const body = (await readBody<TokenRequestBody>(event)) || {}
  const runtimeConfig = useRuntimeConfig(event)
  const authUrl = runtimeConfig.public.authUrl
  const authClientId = runtimeConfig.public.authClientId

  if (!authUrl || !authClientId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing auth configuration.'
    })
  }

  if (!body.grant_type) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing grant_type.'
    })
  }

  const params = new URLSearchParams({
    grant_type: body.grant_type,
    client_id: authClientId
  })

  if (body.grant_type === 'password') {
    if (!body.username || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing username or password.'
      })
    }
    params.set('username', body.username)
    params.set('password', body.password)
  }

  if (body.grant_type === 'refresh_token') {
    if (!body.refresh_token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing refresh_token.'
      })
    }
    params.set('refresh_token', body.refresh_token)
  }

  return await $fetch(authUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  })
})
