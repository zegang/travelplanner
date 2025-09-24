<template>
  <v-app class="travel-planner">
    <!-- Google Maps API Loader -->
    <v-overlay :model-value="!mapLoaded" class="align-center justify-center" scrim="rgba(0,0,0,0.8)" persistent>
      <v-progress-circular color="white" indeterminate size="64"></v-progress-circular>
      <div class="loading-text">Loading Google Maps...</div>
    </v-overlay>

    <!-- Main App Layout -->
    <v-main class="d-flex" v-show="mapLoaded">
      <!-- Left Side: Collapsible Location List -->
      <v-container class="flex-grow-1 pa-4 overflow-y-auto">
        <v-card class="pa-4 rounded-xl elevation-4">
          <v-card-title class="text-h5 font-weight-bold">
            Travel Itinerary 🗺️
          </v-card-title>
          <v-expansion-panels v-model="expandedLocationId" multiple class="mt-4">
            <v-expansion-panel v-for="(location, index) in travelLocations" :key="location.id" :value="location.id"
              @click="handlePanelClick(location)">
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
                      <v-chip class="ma-1">{{ location.duration }}</v-chip>
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
                  <v-img :src="location.images[0]" class="rounded-lg my-2"></v-img>
                  <v-card-actions>
                    <v-btn v-for="link in location.weblinks" :key="link.label" :href="link.url" target="_blank"
                      variant="text" color="primary">{{ link.label }}</v-btn>
                  </v-card-actions>
                </v-card>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-container>

      <!-- Right Side: Google Map View -->
      <v-container class="flex-grow-1 pa-4">
        <v-card class="pa-2 rounded-xl h-100 elevation-4">
          <div ref="mapContainer" class="map-container rounded-lg"></div>
        </v-card>
      </v-container>
    </v-main>

    <!-- Dialog for Full Location Details -->
    <v-dialog v-model="dialogVisible" max-width="600px">
      <v-card v-if="dialogLocationDetails" class="rounded-xl">
        <v-card-title class="text-h5 font-weight-bold bg-primary text-white">
          {{ dialogLocationDetails.title }}
        </v-card-title>
        <v-img :src="dialogLocationDetails.images[0]" class="rounded-t-xl"></v-img>
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
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { TravelLocation } from '@/stores/types/TravelLocation'

// 📌 Reactive state
const mapLoaded = ref(false);
const mapContainer = ref<HTMLElement | null>(null);
const mapInstance = ref<google.maps.Map | null>(null);
const markers = ref<google.maps.Marker[]>([]);
const activeMarkerId = ref<number | null>(null);
const expandedLocationId = ref<number | null>(null);
const dialogVisible = ref(false);
const dialogLocationDetails = ref<TravelLocation | null>(null);

import { useLocationStore } from '@/stores/locationStore'
const locationStore = useLocationStore()
const { locations, loading } = locationStore
const travelLocations = locations

// 📌 Function to load Google Maps API script dynamically
const loadGoogleMapsScript = () => {
  if (window.google) {
    mapLoaded.value = true;
    return;
  }
  const script = document.createElement('script');
  // ⚠️ Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual API key
  script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  window.initMap = () => {
    mapLoaded.value = true;
  };
};

// 📌 Function to initialize the map and add markers/directions
const initMap = () => {
  if (!mapContainer.value) {
    return;
  }
  
  const mapCenter = travelLocations.value.length > 0 ?
    travelLocations.value[0].coordinates :
    { lat: 48.8566, lng: 2.3522 };

  mapInstance.value = new google.maps.Map(mapContainer.value, {
    zoom: 13,
    center: mapCenter,
    mapId: 'DEMO_MAP_ID' // You can use your own map ID here
  });

  // Add markers and direction lines
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    map: mapInstance.value,
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#3f51b5',
      strokeWeight: 5,
    },
  });

  // Create markers
  markers.value = travelLocations.value.map((location, index) => {
    const marker = new google.maps.Marker({
      position: location.coordinates,
      map: mapInstance.value,
      label: {
        text: `${index + 1}`,
        color: 'white',
        fontWeight: 'bold',
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#607d8b',
        fillOpacity: 0.9,
        strokeWeight: 1,
        strokeColor: '#263238',
        scale: 12,
      },
      title: location.title,
    });

    // Add click listener to show dialog
    marker.addListener('click', () => {
      dialogLocationDetails.value = location;
      dialogVisible.value = true;
      activeMarkerId.value = location.id; // Highlight on map
      expandedLocationId.value = location.id; // Expand the panel
      mapInstance.value?.setCenter(location.coordinates);
    });

    return marker;
  });

  // Add direction lines between locations
  if (travelLocations.value.length > 1) {
    const waypoints = travelLocations.value.slice(1, -1).map(loc => ({
      location: loc.coordinates,
      stopover: true,
    }));

    directionsService.route({
      origin: travelLocations.value[0].coordinates,
      destination: travelLocations.value[travelLocations.value.length - 1].coordinates,
      waypoints: waypoints,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING,
    }).then((response) => {
      directionsRenderer.setDirections(response);
    }).catch((e) => {
      console.error('Directions request failed due to ' + e);
    });
  }
};

// 📌 Watch for changes in activeMarkerId to update marker icon
watch(activeMarkerId, (newId) => {
  markers.value.forEach((marker, index) => {
    const isMarkerActive = travelLocations.value[index].id === newId;
    marker.setIcon({
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: isMarkerActive ? '#f44336' : '#607d8b', // Highlight with a different color
      fillOpacity: 0.9,
      strokeWeight: isMarkerActive ? 2 : 1,
      strokeColor: isMarkerActive ? '#b71c1c' : '#263238',
      scale: isMarkerActive ? 15 : 12,
    });
  });
});

// 📌 Handle panel clicks to highlight on map
const handlePanelClick = (location: TravelLocation) => {
  activeMarkerId.value = location.id;
  mapInstance.value?.panTo(location.coordinates);
  mapInstance.value?.setZoom(15);
};

// 📌 Lifecycle hook
onMounted(() => {
  // Load the Google Maps API script and initialize the map once it's ready
  loadGoogleMapsScript();
  watch(mapLoaded, (isLoaded) => {
    if (isLoaded) {
      initMap();
    }
  });
});
</script>

<style scoped>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.travel-planner {
  height: 100vh;
}

.v-main {
  height: 100%;
}

.map-container {
  height: 100%;
}

.loading-text {
  color: white;
  margin-top: 16px;
  font-size: 1.2em;
}

.highlighted-panel {
  border-left: 5px solid #f44336 !important;
  background-color: #ffebee !important;
}
</style>
