<template>
  <v-app>
    <TopBar @toggle-drawer="drawer = !drawer" />
    <SideBar v-model:drawer="drawer" />
    <MainContent />
    <!-- <BottomBar /> -->
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TopBar from '@/components/layout/TopBar.vue'
import SideBar from '@/components/layout/SideBar.vue'
import MainContent from '@/components/layout/MainContent.vue'
// import BottomBar from '@/components/layout/BottomBar.vue'

const drawer = ref(true)
</script>
