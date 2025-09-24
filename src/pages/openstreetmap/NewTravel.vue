<template>
    <!-- Main App Layout -->
    <v-container class="d-flex h-100 w-100">
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

      <!-- Right Side: OpenStreetMap View -->
      <v-container class="flex-grow-1 pa-4 h-100">
        <v-card class="pa-2 rounded-xl h-100 elevation-4">
          <div id="map-container" class="map-container rounded-lg"></div>
        </v-card>
      </v-container>
    </v-container>

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
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import 'vuetify/styles';
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

// 📌 Load Leaflet.js CSS and JS from CDNs
const leafletScript = document.createElement('script');
leafletScript.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
document.head.appendChild(leafletScript);

const leafletStyle = document.createElement('link');
leafletStyle.rel = 'stylesheet';
leafletStyle.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
document.head.appendChild(leafletStyle);

// 📌 Load Leaflet Routing Machine CSS and JS from CDNs
const routingStyle = document.createElement('link');
routingStyle.rel = 'stylesheet';
routingStyle.href = 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css';
document.head.appendChild(routingStyle);

const routingScript = document.createElement('script');
routingScript.src = 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js';
document.head.appendChild(routingScript);

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
const markerIcons = ref<any[]>([]);

// 📌 Sample travel data
const travelLocations = ref<TravelLocation[]>([
  // {
  //   id: 1,
  //   title: 'Eiffel Tower',
  //   date: 'Oct 26, 2025',
  //   duration: '2 hours',
  //   description: 'An iconic symbol of Paris and France, the Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars.',
  //   notes: 'Book tickets online to skip the long queues. Go up to the top level for a fantastic view.',
  //   images: ['https://placehold.co/600x400/3f51b5/ffffff?text=Eiffel+Tower'],
  //   weblinks: [{ label: 'Official Website', url: 'https://www.toureiffel.paris/en' }],
  //   coordinates: { lat: 48.8584, lng: 2.2945 }
  // },
  // {
  //   id: 2,
  //   title: 'The Louvre Museum',
  //   date: 'Oct 27, 2025',
  //   duration: '4 hours',
  //   description: 'Home to thousands of works of art, including the Mona Lisa. The Louvre is the world’s most-visited museum.',
  //   notes: 'The museum is massive. Plan your visit in advance and focus on the exhibits you really want to see.',
  //   images: ['https://placehold.co/600x400/e91e63/ffffff?text=Louvre+Museum'],
  //   weblinks: [{ label: 'Official Website', url: 'https://www.louvre.fr/en' }],
  //   coordinates: { lat: 48.8606, lng: 2.3376 }
  // },
  // {
  //   id: 3,
  //   title: 'Catacombs of Paris',
  //   date: 'Oct 28, 2025',
  //   duration: '1.5 hours',
  //   description: 'A subterranean ossuary holding the remains of more than six million people in a small part of the old limestone quarries that are a part of a tunnel network built to consolidate Paris\'s ancient cemeteries.',
  //   notes: 'The line is always very long. You must book a timed-entry ticket in advance. The tour can be a bit claustrophobic.',
  //   images: ['https://placehold.co/600x400/4CAF50/ffffff?text=Paris+Catacombs'],
  //   weblinks: [{ label: 'Official Website', url: 'https://www.catacombes.paris/en' }],
  //   coordinates: { lat: 48.8340, lng: 2.3323 }
  // },
  // {
  //   id: 4,
  //   title: 'Notre-Dame de Paris',
  //   date: 'Oct 29, 2025',
  //   duration: '1 hour',
  //   description: 'A medieval Catholic cathedral on the Île de la Cité in the 4th arrondissement of Paris. The cathedral is renowned for its size, antiquity, and architectural interest.',
  //   notes: 'Currently undergoing reconstruction after the 2019 fire. Can only be viewed from the outside.',
  //   images: ['https://placehold.co/600x400/FFC107/ffffff?text=Notre-Dame'],
  //   weblinks: [{ label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Notre-Dame_de_Paris' }],
  //   coordinates: { lat: 48.8530, lng: 2.3499 }
  // },
  {
    id: 5,
    title: '骆加为超市',
    date: 'Oct 2, 2025',
    duration: '2 hours',
    description: '骆加为超市',
    notes: '宿州市泗县泗州大道泗县第三中学西南侧.',
    images: ['images/thumbs/loc1-1.jpg' , 'images/fulls/loc1-1.jpg'],
    weblinks: [
      {
        label: '百度',
        url: 'https://map.baidu.com/poi/%E9%AA%86%E5%8A%A0%E4%B8%BA%E8%B6%85%E5%B8%82/@13123277.55,3937885.06,19z?uid=8bd8fdef84b12ad19d95de29&ugc_type=3&ugc_ver=1&device_ratio=1&compat=1&pcevaname=pc4.1&querytype=detailConInfo&da_src=shareurl'
      }
    ],
    coordinates: { lat: 33.50, lng: 117.89 }
  },
  {
    id: 6,
    title: '聊城海源阁宾馆',
    date: 'Oct 2, 2025',
    duration: '2 hours',
    description: '聊城海源阁宾馆',
    notes: '聊城海源阁宾馆.',
    images: ['images/thumbs/loc5-1.jpg'],
    weblinks: [{ label: '携程', url: 'https://hotels.ctrip.com/hotels/4026143.html' }],
    coordinates: { lat: 36.444252, lng: 115.964191 }
  },
]);

// 📌 Function to initialize the map and add markers/directions
const initMap = () => {
  // Wait for the Leaflet libraries to load
  if (!window.L || !window.L.Routing) {
    setTimeout(initMap, 50);
    return;
  }
  
  // Initialize the map without setting a specific view
  mapInstance.value = window.L.map('map-container');
  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapInstance.value);

  // Define custom icon for the markers
  const createMarkerIcon = (number: number) => {
    return window.L.divIcon({
      className: 'numbered-marker',
      html: `<div><span>${number}</span></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  };

  // Create markers
  markers.value = travelLocations.value.map((location, index) => {
    const marker = window.L.marker([location.coordinates.lat, location.coordinates.lng], {
      icon: createMarkerIcon(index + 1),
      title: location.title,
    }).addTo(mapInstance.value);

    // Add click listener to show dialog
    marker.on('click', () => {
      dialogLocationDetails.value = location;
      dialogVisible.value = true;
      activeMarkerId.value = location.id;
      expandedLocationId.value = location.id;
      // Do not zoom, just pan to the location
      mapInstance.value.panTo([location.coordinates.lat, location.coordinates.lng]);
    });

    // Store the location ID on the marker for easy lookup
    (marker as any).locationId = location.id;
    return marker;
  });

  // Fit the map view to show all markers
  if (travelLocations.value.length > 0) {
    const bounds = new window.L.LatLngBounds(travelLocations.value.map(loc => [loc.coordinates.lat, loc.coordinates.lng]));
    mapInstance.value.fitBounds(bounds, { padding: [50, 50] }); // Add padding to avoid markers touching the edges
  }

  // Add direction lines between locations
  if (travelLocations.value.length > 1) {
    const waypoints = travelLocations.value.map(loc => window.L.latLng(loc.coordinates.lat, loc.coordinates.lng));
    routingControl.value = window.L.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: false,
      show: false,
      createMarker: () => null, // Suppress default markers
    }).addTo(mapInstance.value);
  }
};

// 📌 Watch for changes in activeMarkerId to update marker icon
watch(activeMarkerId, (newId) => {
  markers.value.forEach((marker) => {
    const isMarkerActive = (marker as any).locationId === newId;
    if (isMarkerActive) {
      marker.setOpacity(1.0);
      marker.setZIndexOffset(1000);
    } else {
      marker.setOpacity(0.7);
      marker.setZIndexOffset(0);
    }
  });
});

// 📌 Handle panel clicks to highlight on map
const handlePanelClick = (location: TravelLocation) => {
  activeMarkerId.value = location.id;
  // Just pan to the location, do not zoom
  mapInstance.value.panTo([location.coordinates.lat, location.coordinates.lng]);
};

// 📌 Lifecycle hook
onMounted(() => {
  nextTick(initMap);
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

/* 📌 Custom Marker Styling */
.numbered-marker {
  background-color: #3f51b5;
  color: white;
  border-radius: 50%;
  border: 2px solid #263238;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}

.numbered-marker div {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 📌 Leaflet CSS override */
.leaflet-container {
  font: 12px/1.5 "Helvetica Neue", Arial, Helvetica, sans-serif;
  height: 100%;
}

.leaflet-routing-container {
  background: white;
  padding: 10px;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.leaflet-routing-container h2 {
  font-size: 1em;
  font-weight: bold;
}
</style>
