<template>
  <v-app class="travel-planner">
    <!-- Main App Layout -->
    <v-main class="d-flex h-100">
      <v-row no-gutters class="h-100">
        <!-- Left Side: Collapsible Location List -->
        <v-col v-if="!isNavCollapsed" cols="12" sm="5" md="4" lg="3" class="pa-4 overflow-y-auto">
          <v-card class="pa-4 rounded-xl elevation-4 h-100">
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
        </v-col>

        <!-- Right Side: Baidu Map View -->
        <v-col :cols="isNavCollapsed ? 12 : 12" :sm="isNavCollapsed ? 12 : 7" :md="isNavCollapsed ? 12 : 8" :lg="isNavCollapsed ? 12 : 9" class="pa-4 h-100">
          <v-card class="pa-2 rounded-xl h-100 elevation-4 d-flex flex-column">
            <v-btn
              class="ma-2 self-start"
              icon
              size="small"
              @click="isNavCollapsed = !isNavCollapsed"
            >
              <v-icon>{{ isNavCollapsed ? mdiChevronRight : mdiChevronLeft }}</v-icon>
            </v-btn>
            <div id="map-container" class="map-container rounded-lg flex-grow-1"></div>
          </v-card>
        </v-col>
      </v-row>
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
import { ref, onMounted, watch, nextTick } from 'vue';
import 'vuetify/styles';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
// import { createVuetify } from 'vuetify';
// import * as components from 'vuetify/components';
// import * as directives from 'vuetify/directives';
// import { md3 } from 'vuetify/blueprints';

// 📌 Load Vuetify for this single-file component
// const vuetify = createVuetify({
//   components,
//   directives,
//   blueprint: md3,
// });

// 📌 Load Baidu Maps API script
const baiduScript = document.createElement('script');
// ⚠️ Replace 'YOUR_BAIDU_MAPS_API_KEY' with your actual API key
const YOUR_BAIDU_MAPS_API_KEY = 'GI05xbdCXRxzOE1dePEqJ7kN1Fx7K2Sf'
baiduScript.src = 'https://api.map.baidu.com/api?v=3.0&ak=' + YOUR_BAIDU_MAPS_API_KEY + '&s=1&callback=initBaiduMap';
document.head.appendChild(baiduScript);

// 📌 Declare global functions for Baidu Maps
declare global {
  interface Window {
    initBaiduMap: () => void;
  }
}

interface TravelLocation {
  id: number;
  title: string;
  date: string;
  duration: string;
  description: string;
  notes: string;
  images: string[];
  weblinks: { label: string; url: string; }[];
  coordinates: { lat: number; lng: number; };
}

// 📌 Reactive state
const mapInstance = ref<any | null>(null);
const markers = ref<any[]>([]);
const activeMarkerId = ref<number | null>(null);
const expandedLocationId = ref<number | null>(null);
const dialogVisible = ref(false);
const dialogLocationDetails = ref<TravelLocation | null>(null);
const routingControl = ref<any | null>(null);
const isNavCollapsed = ref(false);

// 📌 Sample travel data
const travelLocations = ref<TravelLocation[]>([
  {
    id: 1,
    title: 'Eiffel Tower',
    date: 'Oct 26, 2025',
    duration: '2 hours',
    description: 'An iconic symbol of Paris and France, the Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars.',
    notes: 'Book tickets online to skip the long queues. Go up to the top level for a fantastic view.',
    images: ['https://placehold.co/600x400/3f51b5/ffffff?text=Eiffel+Tower'],
    coordinates: { lat: 48.8584, lng: 2.2945 },
    weblinks: [{ label: 'Official Website', url: 'https://www.toureiffel.paris/en' }]
  },
  {
    id: 2,
    title: 'The Louvre Museum',
    date: 'Oct 27, 2025',
    duration: '4 hours',
    description: 'Home to thousands of works of art, including the Mona Lisa. The Louvre is the world’s most-visited museum.',
    notes: 'The museum is massive. Plan your visit in advance and focus on the exhibits you really want to see.',
    images: ['https://placehold.co/600x400/e91e63/ffffff?text=Louvre+Museum'],
    coordinates: { lat: 48.8606, lng: 2.3376 },
    weblinks: [{ label: 'Official Website', url: 'https://www.louvre.fr/en' }]
  },
  {
    id: 3,
    title: 'Catacombs of Paris',
    date: 'Oct 28, 2025',
    duration: '1.5 hours',
    description: 'A subterranean ossuary holding the remains of more than six million people in a small part of the old limestone quarries that are a part of a tunnel network built to consolidate Paris\'s ancient cemeteries.',
    notes: 'The line is always very long. You must book a timed-entry ticket in advance. The tour can be a bit claustrophobic.',
    images: ['https://placehold.co/600x400/4CAF50/ffffff?text=Paris+Catacombs'],
    coordinates: { lat: 48.8340, lng: 2.3323 },
    weblinks: [{ label: 'Official Website', url: 'https://www.catacombes.paris/en' }]
  },
  {
    id: 4,
    title: 'Notre-Dame de Paris',
    date: 'Oct 29, 2025',
    duration: '1 hour',
    description: 'A medieval Catholic cathedral on the Île de la Cité in the 4th arrondissement of Paris. The cathedral is renowned for its size, antiquity, and architectural interest.',
    notes: 'Currently undergoing reconstruction after the 2019 fire. Can only be viewed from the outside.',
    images: ['https://placehold.co/600x400/FFC107/ffffff?text=Notre-Dame'],
    coordinates: { lat: 48.8530, lng: 2.3499 },
    weblinks: [{ label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Notre-Dame_de_Paris' }]
  },
]);

// 📌 Function to initialize the map and add markers/directions
const initBaiduMap = () => {
  if (typeof BMap === 'undefined' || typeof BMap.Convertor === 'undefined') {
    console.error('Baidu Maps API or Convertor not loaded.');
    return;
  }
  
  mapInstance.value = new BMap.Map("map-container");

  // Create Baidu Map points from our locations' standard coordinates
  const pointsToConvert = travelLocations.value.map(loc => new BMap.Point(loc.coordinates.lng, loc.coordinates.lat));

  // Convert the points from WGS84 (standard GPS) to BD09 (Baidu's system)
  BMap.Convertor.transMore(pointsToConvert, 0, (convertedPoints: any[]) => {
    // Check if conversion was successful
    if (convertedPoints && convertedPoints.length > 0) {
      // Set the map viewport to fit all converted points
      const viewport = mapInstance.value.setViewport(convertedPoints);
      
      // Create markers and add click listeners using the converted points
      markers.value = travelLocations.value.map((location, index) => {
        const point = convertedPoints[index];
        const marker = new BMap.Marker(point);

        // Add a simple number label to the marker
        const label = new BMap.Label(`${index + 1}`, { offset: new BMap.Size(10, -20) });
        label.setStyle({
          color: "white",
          backgroundColor: "blue",
          border: "1px solid white",
          borderRadius: "50%",
          fontSize: "12px",
          textAlign: "center",
          lineHeight: "20px",
          width: "20px",
          height: "20px"
        });
        marker.setLabel(label);

        marker.addEventListener("click", () => {
          dialogLocationDetails.value = location;
          dialogVisible.value = true;
          activeMarkerId.value = location.id;
          expandedLocationId.value = location.id;
          mapInstance.value.panTo(point); // Pan to the clicked location
        });

        mapInstance.value.addOverlay(marker);
        return marker;
      });

      // Add direction lines between locations using Baidu's WalkingRoute
      if (convertedPoints.length > 1) {
        const walkingRoute = new BMap.WalkingRoute(mapInstance.value, {
          onSearchComplete: (results: any) => {
            if (walkingRoute.getStatus() === BMAP_STATUS_SUCCESS) {
              const plan = results.getPlan(0);
              const route = plan.getRoute(0);
              const polyline = new BMap.Polyline(route.getPath(), { strokeColor: "blue", strokeWeight: 5, strokeOpacity: 0.8 });
              mapInstance.value.addOverlay(polyline);
            }
          }
        });
        // This is a simplified way to create a multi-stop route.
        // Baidu's API is a bit different for multi-point routes,
        // so we will show a route from the first to the last point.
        walkingRoute.search(convertedPoints[0], convertedPoints[convertedPoints.length - 1]);
      }
    } else {
      console.error('Coordinate conversion failed.');
    }
  });
};

// 📌 Watch for changes in activeMarkerId to update marker icon (Baidu does not have a simple icon change for this example)
watch(activeMarkerId, (newId) => {
  // A simple way to "highlight" is to pan to the marker.
  const activeLocation = travelLocations.value.find(loc => loc.id === newId);
  if (activeLocation) {
    const point = new BMap.Point(activeLocation.coordinates.lng, activeLocation.coordinates.lat);
    BMap.Convertor.transMore([point], 0, (convertedPoint: any[]) => {
      if (convertedPoint && convertedPoint.length > 0) {
        mapInstance.value.panTo(convertedPoint[0]);
      }
    });
  }
});

// 📌 Handle panel clicks to highlight on map
const handlePanelClick = (location: TravelLocation) => {
  activeMarkerId.value = location.id;
  const point = new BMap.Point(location.coordinates.lng, location.coordinates.lat);
  BMap.Convertor.transMore([point], 0, (convertedPoint: any[]) => {
    if (convertedPoint && convertedPoint.length > 0) {
      mapInstance.value.panTo(convertedPoint[0]);
    }
  });
};

// 📌 Lifecycle hook
onMounted(() => {
  window.initBaiduMap = initBaiduMap;
});

// Watch for isNavCollapsed changes to refresh the map when it becomes visible
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

.highlighted-panel {
  border-left: 5px solid #f44336 !important;
  background-color: #ffebee !important;
}
</style>
