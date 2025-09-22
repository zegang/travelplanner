<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="primary" app height="64">
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Travel Planner</v-toolbar-title>
      <v-spacer />
      <template v-if="$vuetify.display.mdAndUp">
        <v-btn icon="mdi-magnify" variant="text"></v-btn>
        <v-btn icon="mdi-filter" variant="text"></v-btn>
      </template>
      <v-avatar size="32" class="mr-2">
        <v-img src="https://randomuser.me/api/portraits/men/85.jpg" />
      </v-avatar>
      <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      app
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'bottom' : undefined"
      temporary
    >
      <v-list :items="items"></v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid class="ma-0 pa-0 fill-height w-100">
        <!-- Here we render the page content -->
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue"

const items = [
  { title: "Dashboard", value: "dashboard" },
  { title: "Settings", value: "settings" },
  { title: "Logout", value: "logout" },
]

const drawer = ref(false)
</script>