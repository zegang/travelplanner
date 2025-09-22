<template>
  <v-form @submit.prevent="submit">
    <v-text-field
      v-model="username"
      label="Username"
      prepend-icon="mdi-account"
      required
    />
    <v-text-field
      v-model="password"
      label="Password"
      prepend-icon="mdi-lock"
      type="password"
      required
    />
    <v-btn color="primary" type="submit" block class="mt-4">Login</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue"

const username = ref("")
const password = ref("")

const emit = defineEmits<{
  (e: "login"): void
}>()

function submit() {
  if (username.value === 'a' && password.value === 'abcd1234') {
    emit("login")
  }
}
</script>
