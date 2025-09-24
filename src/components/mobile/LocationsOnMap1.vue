<template>
  <!-- Mobile Layout: Map on Top, List on Bottom -->
  <v-row no-gutters class="h-100 flex-column">
    <!-- Baidu Map View (Top on Mobile) -->
    <v-col
      cols="12"
      class="pa-4 flex-grow-1 map-col"
      order="1"
    >
      <v-card class="pa-2 rounded-xl h-100 elevation-4 d-flex flex-column">
        <div class="d-flex align-center justify-space-between ma-2">
          <v-btn
            icon
            size="small"
            @click="$emit('toggleNav')"
          >
            <!-- In mobile view, the nav bar appears at the bottom, so we treat it as always 'open' but use the collapse button to switch the layout -->
            <v-icon>{{ isNavCollapsed ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
          </v-btn>
          <v-switch
            :model-value="useBaiduCoordinates"
            @update:model-value="$emit('updateCoords', !useBaiduCoordinates)"
            hide-details
            inset
            color="primary"
            label="Baidu Coords"
          ></v-switch>
        </div>
        <!-- Use a fixed height for the map container on mobile view so the list has scrollable space -->
        <div id="map-container" class="map-container rounded-lg flex-grow-1"></div>
      </v-card>
    </v-col>

    <!-- Collapsible Location List (Bottom on Mobile) -->
    <v-col v-if="!isNavCollapsed"
      cols="12"
      class="pa-4 overflow-y-auto flex-grow-0"
      order="2"
      style="max-height: 50vh;"
    >
      <v-card class="pa-4 rounded-xl elevation-4 h-100">
        <v-card-title class="d-flex align-center justify-space-between">
          <span class="text-h5 font-weight-bold">Itinerary 🗺️</span>
          <v-btn
            icon
            size="small"
            variant="text"
            @click="$emit('collapseAll')"
            aria-label="Collapse All Itinerary Items"
          >
            <v-icon>mdi-arrow-collapse-vertical</v-icon>
          </v-btn>
        </v-card-title>
        <v-expansion-panels :model-value="expandedLocationId" multiple class="mt-4">
          <v-expansion-panel v-for="(location, index) in travelLocations" :key="index" :value="location.id"
            @click="$emit('panelClick', location)">
            <v-expansion-panel-title :class="{ 'highlighted-panel': activeMarkerId === location.id }">
              <v-row align="center" no-gutters>
                <v-col cols="1" class="text-h6 font-weight-bold">{{ index + 1 }}</v-col>
                <v-col cols="11" class="pl-2">
                  <div class="text-subtitle-1">{{ location.title }}</div>
                  <div class="text-caption text-medium-emphasis">{{ location.date }} ({{ location.duration }})</div>
                </v-col>
              </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-card class="mt-2 rounded-lg pa-4 bg-grey-lighten-4">
                <v-list-item>
                  <v-list-item-subtitle>
                    <v-chip class="ma-1">{{ location.date }}</v-chip>
                    <v-chip class="ma-1" color="secondary">{{ location.duration }}</v-chip>
                  </v-list-item-subtitle>
                  <v-list-item-title class="text-body-1 mt-2 font-weight-medium">
                    Description
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-body-2">{{ location.description }}</v-list-item-subtitle>
                  <v-list-item-title class="text-body-1 mt-2 font-weight-medium">
                    Notes
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-body-2">{{ location.notes }}</v-list-item-subtitle>
                </v-list-item>
                <v-img :src="location.images[0]" class="rounded-lg my-2" max-height="200px"></v-img>
                <v-card-actions>
                  <v-btn v-for="link in location.weblinks" :key="link.label" :href="link.url" target="_blank"
                    variant="text" color="primary">{{ link.label }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </v-col>
  </v-row>
  
  <!-- Dialog handled by Parent -->
</template>

<script setup lang="ts">
import type { TravelLocation } from '@/lib/types/TravelLocation';

// Define props passed from the parent component (TravelPlanner.vue)
defineProps<{
  isNavCollapsed: boolean;
  useBaiduCoordinates: boolean;
  travelLocations: TravelLocation[];
  activeMarkerId: number | null;
  expandedLocationId: number[];
}>();

// Define events emitted back to the parent component
defineEmits<{
  (e: 'toggleNav'): void;
  (e: 'updateCoords', value: boolean): void;
  (e: 'collapseAll'): void;
  (e: 'panelClick', location: TravelLocation): void;
}>();
</script>

<style scoped>
.highlighted-panel {
  border-left: 5px solid #f44336 !important;
  background-color: #ffebee !important;
}

.map-col {
  /* Ensure the map column takes up sufficient height on mobile */
  height: 50vh;
}
</style>
