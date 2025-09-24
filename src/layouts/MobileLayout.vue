<template>
  <!-- 
    The v-app component provides the necessary structure 
    to handle Vuetify's fixed navigation and content positioning. 
  -->
  <v-app class="mobile-layout-container">
    
    <!-- Main Content Area -->
    <!-- v-main automatically takes into account the height of fixed bars like v-bottom-navigation -->
    <v-main class="bg-grey-lighten-3">
      <div class="pa-0 text-center h-100">
        <router-view />
      </div>
    </v-main>

    <!-- Fixed Bottom Navigation Bar -->
    <v-bottom-navigation 
      mode="shift" 
      height="64"
      fixed 
      app 
      elevation="10"
    >
      <v-btn v-for="menu in menus"
        :value="menu.value"
        color="primary"
        @click="go(menu.value)">
        <v-icon>{{ menu.icon }}</v-icon>
        <span>{{ menu.title }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup lang="ts">
import 'vuetify/styles';
import { mdiViewDashboard, mdiAirplane, mdiWalletTravel, mdiFileChart, mdiLogin } from '@mdi/js';
import { useRouter } from 'vue-router';

const menus = [
  { title: 'login', value: 'login', icon: mdiLogin },
  { title: 'travels', value: 'travels', icon: mdiViewDashboard },
  { title: 'newtravel', value: 'newtravel', icon: mdiAirplane },
  { title: 'Travel Planner', value: 'portal', icon: mdiWalletTravel },
  { title: 'reports', value: 'reports', icon: mdiFileChart },
]

const router = useRouter()
function go(page: string) {
  router.push({ name: page })
}
</script>

<style scoped>
/* Ensure the container takes full height. 
  The max-width is included to better simulate a mobile device viewport 
  when viewed on a larger screen.
*/
.mobile-layout-container {
  height: 100vh;
  width: 100%;
  max-width: 600px; 
  margin: 0 auto;
}
</style>
