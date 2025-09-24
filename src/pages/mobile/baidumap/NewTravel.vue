<template>
  <!-- Main App Layout -->
  <v-container class="h-100 w-100">
    <div class="d-flex h-100 w-100">
      <LocationsOnMap
        :is-nav-collapsed="isNavCollapsed"
        :use-baidu-coordinates="useBaiduCoordinates"
        :travel-locations="travelLocations"
        :active-marker-id="activeMarkerId"
        :expanded-location-id="expandedLocationId"
        @toggle-nav="toggleNav"
        @fit-view="fitView"
        @update-coords="updateCoords"
        @collapse-all="collapseAllPanels"
        @panel-click="handlePanelClick"
      />
    </div>
  </v-container>

  <!-- Dialog for Full Location Details (Shared across all layouts) -->
  <v-dialog v-model="dialogVisible" max-width="600px">
    <v-card v-if="dialogLocationDetails" class="rounded-xl">
      <v-card-title class="text-h5 font-weight-bold bg-primary text-white">
        {{ dialogLocationDetails.title }}
      </v-card-title>
      <v-img :src="dialogLocationDetails.images[0]" class="rounded-t-xl" max-height="200px"></v-img>
      <v-card-text>
        <div class="my-2">
          <v-chip class="ma-1" color="primary">{{ dialogLocationDetails.date }}</v-chip>
          <v-chip class="ma-1" color="secondary">{{ dialogLocationDetails.duration }}</v-chip>
        </div>
        <p class="text-body-1 font-weight-medium mt-3">Description</p>
        <p class="text-body-2 text-medium-emphasis">{{ dialogLocationDetails.description }}</p>
        <p class="text-body-1 font-weight-medium mt-3">Notes</p>
        <p class="text-body-2 text-medium-emphasis">{{ dialogLocationDetails.notes }}</p>
        <div class="mt-3">
          <p class="text-body-1 font-weight-medium">Links</p>
          <v-btn v-for="link in dialogLocationDetails.weblinks" :key="link.label" :href="link.url" target="_blank"
            variant="text" color="primary" class="my-1">{{ link.label }}</v-btn>
        </div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="dialogVisible = false" variant="elevated">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { useDisplay } from 'vuetify';
import 'vuetify/styles';
import type { TravelLocation } from '@/lib/types/TravelLocation';
import LocationsOnMap from '@/components/mobile/LocationsOnMap.vue';

// Import the Baidu Map Composable
import { useBaiduMap } from '@/services/BaiduMapService';

// 📌 Responsive Screen Detection
const display = useDisplay();
const isMobile = computed(() => display.smAndDown.value);

// 📌 Reactive state
const activeMarkerId = ref<number | null>(null);
const expandedLocationId = ref<number[]>([]);
const dialogVisible = ref(false);
const dialogLocationDetails = ref<TravelLocation | null>(null);
const isNavCollapsed = ref(false);
const useBaiduCoordinates = ref(false);

import { travelLocationsDemo } from '@/lib/stores/demoData'
const travelLocations = ref<TravelLocation[]>([])
Object.assign(travelLocations.value, travelLocationsDemo)

// 📌 Initialize Baidu Map Composable, passing reactive state
const { mapInstance, updateMap, setMapViewPortFitAllPoints, loadBaiduScript, initBaiduMap } = useBaiduMap(
  travelLocations,
  useBaiduCoordinates,
  activeMarkerId,
  expandedLocationId,
  dialogVisible,
  dialogLocationDetails
);


// 📌 Event Handlers (Emitted from child layouts)

const toggleNav = () => {
  isNavCollapsed.value = !isNavCollapsed.value;
};

const fitView = (locations: TravelLocation[]) => {
  setMapViewPortFitAllPoints(locations);
}

const updateCoords = (value: boolean) => {
  useBaiduCoordinates.value = value;
};

const handlePanelClick = (location: TravelLocation) => {
  activeMarkerId.value = location.id;

  if (location.id == null) {
    return
  }
  
  // Set the expanded ID only if it's not already expanded
  const index = expandedLocationId.value.indexOf(location.id);
  if (index === -1) {
    expandedLocationId.value = [location.id];
  }

  // Pan the map to the location's coordinates (using mapInstance exposed by the composable)
  if (mapInstance.value && typeof BMap !== 'undefined') {
    const coords = useBaiduCoordinates.value && location.baiduCoordinates
      ? location.baiduCoordinates
      : location.coordinates;
    const point = new BMap.Point(coords?.lng, coords?.lat);
    mapInstance.value.panTo(point);
  }
};

const collapseAllPanels = () => {
  expandedLocationId.value = [];
};

// 📌 Watchers
// Watch for changes in activeMarkerId to pan to the marker
watch(activeMarkerId, (newId) => {
  const activeLocation = travelLocations.value.find(loc => loc.id === newId);
  if (activeLocation && mapInstance.value && typeof BMap !== 'undefined') {
    const coords = useBaiduCoordinates.value && activeLocation.baiduCoordinates
      ? activeLocation.baiduCoordinates
      : activeLocation.coordinates;
    const point = new BMap.Point(coords?.lng, coords?.lat);
    mapInstance.value.panTo(point);
  }
});

// Watch the coordinate switch to trigger a map update/re-render via the composable
watch(useBaiduCoordinates, () => {
  updateMap();
});

// Watch for navigation collapse changes to refresh the map when its container size changes
watch(isNavCollapsed, (newValue) => {
  if (!newValue && mapInstance.value) {
    // The map needs a slight delay to refresh after the container size changes
    nextTick(() => {
      if (mapInstance.value) {
        mapInstance.value.checkResize();
      }
    });
  }
});

// Watch for layout switch (mobile/desktop) to re-initialize map on the correct DOM element
watch(isMobile, () => {
  nextTick(() => {
    if (document.getElementById('map-container')) {
      initBaiduMap();
    }
  });
});


// 📌 Lifecycle hook
onMounted(() => {
  // Load the Baidu Map API script. This also registers the global window.initBaiduMap callback.
  loadBaiduScript();
  
  // If the script was already loaded (e.g., from hot reload), initialize map directly
  if (typeof BMap !== 'undefined' && document.getElementById('map-container')) {
    initBaiduMap();
  }
});
</script>

<style scoped>
.map-container {
  /* Ensuring the container fills available space */
  width: 100%;
  height: 100%;
}
</style>
