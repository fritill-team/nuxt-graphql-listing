<script setup lang="ts">
import AuthForm from "../components/AuthForm.vue";

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-6 py-12">
    <AuthForm />
  </div>
</template>
