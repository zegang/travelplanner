<template>
  <v-container class="d-flex align-center justify-center fill-height" fluid>
    <v-card class="pa-10" width="100%" max-width="600">
      <h2 class="mb-6 text-h5 text-center">{{ $t('login.value') }}</h2>
      <LoginForm @login="goToPortal" />
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" :icon="translate"></v-btn>
        </template>
        <v-list>
          <v-list-item @click="$i18n.locale = 'en'">English</v-list-item>
          <v-list-item @click="$i18n.locale = 'zh'">中文</v-list-item>
        </v-list>
      </v-menu>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import LoginForm from "@/components/LoginForm.vue"
import { useRouter } from "vue-router"
import {
  mdiTranslate as translate
} from '@mdi/js'

const router = useRouter()

function goToPortal() {
  router.push("/portal")
}
</script>
