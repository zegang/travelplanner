<template>
  <v-app-bar app color="primary" density="comfortable">
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')" />
    <v-toolbar-title>{{ $t('travelPlanner.value') }}</v-toolbar-title>
    <v-spacer />
    <v-btn :icon="mdiMagnify" />
    <v-btn :icon="mdiDotsVertical" />
  </v-app-bar>
</template>

<script setup lang="ts">
import { mdiMagnify, mdiMenu, mdiDotsVertical } from '@mdi/js'
defineEmits(['toggle-drawer'])
</script>
