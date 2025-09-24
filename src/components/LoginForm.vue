<template>
  <v-form @submit.prevent="submit">
    <v-text-field
      v-model="username"
      :prepend-icon="account" required
      :label="$t('username.value')"
    />
    <v-text-field
      v-model="password"
      :prepend-icon="lock" type="password"
      :label="$t('password.value')"
      required
    />
    <v-btn color="primary" type="submit" block class="mt-4">
      {{ $t('login.value') }}
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue"
import {
  mdiAccount as account,
  mdiLock as lock
} from '@mdi/js'

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
