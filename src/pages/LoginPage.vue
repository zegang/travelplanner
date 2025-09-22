<template>
  <v-container class="d-flex align-center justify-center fill-height" fluid>
    <v-card class="pa-10" width="100%" max-width="600">
      <h2 class="mb-6 text-h5 text-center">Login</h2>
      <LoginForm @login="goToPortal" />
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import LoginForm from "@/components/LoginForm.vue"
import { useRouter } from "vue-router"

const router = useRouter()

function goToPortal() {
  router.push("/portal")
}
</script>
