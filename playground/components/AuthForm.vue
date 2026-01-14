<script setup lang="ts">
import { reactive, ref } from 'vue'

const accessToken = useCookie<string | null>('playground-access-token', {sameSite: 'lax'})
const refreshToken = useCookie<string | null>('playground-refresh-token', {sameSite: 'lax'})
const runtimeConfig = useRuntimeConfig()
const formState = reactive({
  username: '',
  password: ''
})
const loading = ref(false)
const errorMessage = ref('')
const show = ref(false)


const submitLogin = async () => {
  errorMessage.value = ''
  if (!runtimeConfig.public.authUrl) {
    errorMessage.value = 'Missing authUrl in runtime config.'
    return
  }
  if (!runtimeConfig.public.authClientId) {
    errorMessage.value = 'Missing authClientId in runtime config.'
    return
  }
  loading.value = true
  try {
    const response = await $fetch<{
      access_token?: string
      refresh_token?: string
      error_description?: string
    }>('/api/auth/token', {
      method: 'POST',
      body: {
        grant_type: 'password',
        username: formState.username,
        password: formState.password
      }
    })

    if (!response.access_token) {
      errorMessage.value = response.error_description || 'Authentication failed.'
      return
    }

    accessToken.value = response.access_token
    refreshToken.value = response.refresh_token || null

    navigateTo('/')
  } catch (error: any) {
    console.log(error)
    errorMessage.value = 'Authentication request failed.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UForm :state="formState" @submit="submitLogin">
    <UCard class="mx-auto w-full max-w-lg rounded-3xl">
      <template #header>
        <div>
          <h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-50">Playground Login</h1>
          <p class="text-sm text-stone-500 dark:text-stone-400">
            Authenticate with the Keycloak password grant for demo use.
          </p>
        </div>
      </template>

      <div class="space-y-4">
        <UFormField label="Email">
          <UInput v-model="formState.username" type="email" placeholder="admin@example.com" class="w-full"/>
        </UFormField>
        <UFormField label="Password">
          <UInput v-model="formState.password"
                  :type="show ? 'text' : 'password'"
                  placeholder="********"
                  class="w-full"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="show ? 'Hide password' : 'Show password'"
                :aria-pressed="show"
                aria-controls="password"
                @click="show = !show"
              />
            </template>
          </UInput>
        </UFormField>
      </div>

      <template #footer>
        <div class="space-y-3">
          <UButton
            type="submit"
            label="Sign In"
            color="primary"
            :loading="loading"
            block
            />
          <p v-if="errorMessage" class="text-xs text-center text-rose-500">{{ errorMessage }}</p>
        </div>
      </template>
    </UCard>
  </UForm>
</template>
