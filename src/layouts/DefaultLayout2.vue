<template>
  <v-app>
    <!-- Top App Bar -->
    <v-app-bar app color="primary" density="comfortable">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ $t('travelPlanner.value') }}</v-toolbar-title>
      <v-spacer />
      <v-btn :icon="magnify" />
      <v-btn :icon="dotsVertical" />
    </v-app-bar>

    <!-- Left Sidebar -->
    <v-navigation-drawer app v-model="drawer" :rail="rail" permanent>
      <!-- toggle rail/expand -->
      <v-list-item
        :prepend-icon="menu"
        title="Menu"
        @click="rail = !rail"
      />

      <v-divider />

      <v-list density="compact" nav>
        <v-list-item
          v-for="item in items"
          :key="item.value"
          :title="item.title"
          :prepend-icon="item.icon"
          @click="go(item.value)"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- Right Page Content -->
    <v-main>
      <v-container fluid class="pa-4 fill-height">
        <router-view />
      </v-container>
    </v-main>

    <!-- Bottom Bar -->
    <v-bottom-navigation app>
      <v-btn value="home" @click="go('home')">
        <span>Home</span>
        <v-icon>home</v-icon>
      </v-btn>
      <v-btn value="settings" @click="go('settings')">
        <span>Settings</span>
        <v-icon>cog</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import {
  mdiMagnify as magnify,
  mdiFilter as filter,
  mdiDotsVertical as dotsVertical,
  mdiMenu as menu,
  mdiAccount as account,
  mdiAirplane as airplane,
  mdiViewDashboard as viewDashboard
} from '@mdi/js'

const drawer = ref(true)
const rail = ref(false) // when true → mini sidebar

const items = [
  { title: 'Login', value: 'login', icon: 'viewDashboard' },
  { title: 'Travels', value: 'portal', icon: 'viewDashboard' },
  { title: 'Travel Planner', value: 'planner', icon: 'airplane' },
  { title: 'Profile', value: 'profile', icon: 'account' },
]

const router = useRouter()
function go(page: string) {
  router.push({ name: page })
}
</script>

<style scoped>
.fill-height {
  height: 100%;
}
</style>
