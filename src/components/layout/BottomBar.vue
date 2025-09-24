<template>
  <v-bottom-navigation app>
    <v-btn value="home" @click="go('dashboard')">
      <span>{{ $t('home.value') }}</span>
      <v-icon :icon="mdiHome"></v-icon>
    </v-btn>
    <v-btn value="settings" @click="go('settings')">
      <span>{{ $t('settings.value') }}</span>
      <v-icon :icon="mdiCog"></v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { mdiHome, mdiCog } from '@mdi/js'
import { useRouter } from 'vue-router'

const router = useRouter()
function go(page: string) {
  router.push({ name: page })
}
</script>
