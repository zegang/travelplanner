<template>
  <!-- <v-app class="travel-planner"> -->
    <!-- Main App Layout -->
    <!-- <v-main class="d-flex h-100"> -->
    <v-container class="d-flex h-100 w-100 pa-0 ma-0">
      <v-row no-gutters class="h-100 w-100">
        <!-- Left Side: Collapsible Location List -->
        <v-col v-if="!isNavCollapsed" cols="12" sm="5" md="4" lg="3" class="pa-4 overflow-y-auto">
          <v-card class="pa-4 rounded-xl elevation-4 h-100">
            <v-card-title class="text-h5 font-weight-bold">
              <span class="text-h5 font-weight-bold">🗺️十一旅行</span>
              <v-btn
                icon
                size="small"
                variant="text"
                @click="collapseAllLocations"
                aria-label="Collapse All Items"
              >
                <v-icon>{{ mdiCollapseAll }}</v-icon>
              </v-btn>
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
                    <v-img :src="location.images[0]" class="rounded-lg my-2" max-height="100" cover></v-img>
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
        <v-col :cols="isNavCollapsed ? 12 : 12" :sm="isNavCollapsed ? 12 : 7"
               :md="isNavCollapsed ? 12 : 8" :lg="isNavCollapsed ? 12 : 9" class="pa-4 h-100 w-100">
          <v-card class="pa-2 rounded-xl h-100 elevation-4 d-flex flex-column">
            <div class="d-flex align-center justify-space-between ma-2">
              <v-btn
                icon
                size="small"
                @click="isNavCollapsed = !isNavCollapsed"
              >
                <v-icon>{{ isNavCollapsed ? mdiChevronRight : mdiChevronLeft }}</v-icon>
              </v-btn>
              <v-btn icon size="small" @click="setMapViewPortFitAllPoints()">
                <v-icon>{{  mdiMapMarkerPath }}</v-icon>
              </v-btn>
              <v-btn icon size="small" @click="renderDrivingRoute(travelLocations)">
                <v-icon>{{  mdiCar }}</v-icon>
              </v-btn>
              <v-switch
                v-model="useBaiduCoordinates"
                hide-details
                inset
                color="primary"
                label="Use Baidu Coordinates"
              ></v-switch>
            </div>
            <div id="map-container" class="map-container rounded-lg flex-grow-1"></div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- </v-main> -->

    <!-- Dialog for Full Location Details -->
    <v-dialog v-model="dialogVisible" max-width="600px">
      <v-card v-if="dialogLocationDetails" class="rounded-xl">
        <v-card-title class="text-h5 font-weight-bold bg-primary text-white">
          {{ dialogLocationDetails.title }}
        </v-card-title>
        <v-img :src="dialogLocationDetails.images[0]" class="rounded-t-xl" max-height="200" cover></v-img>
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
  <!-- </v-app> -->
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import 'vuetify/styles';
import { mdiCar, mdiChevronLeft, mdiChevronRight, mdiCollapseAll, mdiMapMarkerPath } from '@mdi/js';
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

// 📌 Declare global functions and types for Baidu Maps
// declare global {
//   const BMap: any;
//   const BMAP_STATUS_SUCCESS: any;
//   interface Window {
//     initBaiduMap: () => void;
//   }
// }

// 📌 Load Baidu Maps API script
const baiduScript = document.createElement('script');
// ⚠️ Replace 'YOUR_BAIDU_MAPS_API_KEY' with your actual API key
const YOUR_BAIDU_MAPS_API_KEY = 'GI05xbdCXRxzOE1dePEqJ7kN1Fx7K2Sf'
baiduScript.src = 'https://api.map.baidu.com/api?v=3.0&ak=' + YOUR_BAIDU_MAPS_API_KEY + '&s=1&callback=initBaiduMap';
document.head.appendChild(baiduScript);

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
  baiduCoordinates: { lat: number; lng: number; } | null;
}

// 📌 Reactive state
const mapInstance = ref<any | null>(null);
const markers = ref<any[]>([]);
const activeMarkerId = ref<number | null>(null);
const expandedLocationId = ref<number[]>([]);
const dialogVisible = ref(false);
const dialogLocationDetails = ref<TravelLocation | null>(null);
const routingControl = ref<any | null>(null);
const isNavCollapsed = ref(false);
const useBaiduCoordinates = ref(false);
const baiduPoints = ref<any[]>([]);

// 📌 Function to collapse all panels
const collapseAllLocations = () => {
  expandedLocationId.value = [];
}

import staticTravelLocations from '@/lib/stores/demoData'
const travelLocations = ref<TravelLocation[]>([])
Object.assign(travelLocations.value, staticTravelLocations)

// Baidu map uses a different coordinate system, so we need to convert
const toBaiduPoint = (location: TravelLocation) => {
  return useBaiduCoordinates.value && location.baiduCoordinates
    ? new BMap.Point(location.baiduCoordinates.lng, location.baiduCoordinates.lat)
    : new BMap.Point(location.coordinates.lng, location.coordinates.lat);
};

// Set the map viewport to fit all points
const setMapViewPortFitAllPoints = () => {
  if (baiduPoints.value.length > 0) {
    mapInstance.value.setViewport(baiduPoints.value);
  }
}

// Function to render markers based on the selected coordinate system
const renderMarkers = (locations: TravelLocation[]) => {
  if (!mapInstance.value) return;
  // Clear existing markers
  // mapInstance.value.clearOverlays();

  // Clear only markers
  const overlays = mapInstance.value.getOverlays();
  overlays.forEach((overlay: any) => {
    if (overlay instanceof BMap.Marker) {
      mapInstance.value.removeOverlay(overlay);
    }
  });

  locations.forEach((location, index) => {
    const point = toBaiduPoint(location);
    const marker: any = new BMap.Marker(point);

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
      expandedLocationId.value.push(location.id);
      mapInstance.value.panTo(point);
    });

    mapInstance.value.addOverlay(marker);
  });

  // Add direction lines between locations using Baidu's WalkingRoute
  if (baiduPoints.value.length > 1) {
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
    walkingRoute.search(baiduPoints.value[0], baiduPoints.value[baiduPoints.value.length - 1]);
  }
};

const renderDrivingRoute = (locations: TravelLocation[]) => {
  if (!mapInstance.value || locations.length < 2) return;

  // Clear existing driving routes
  const overlays = mapInstance.value.getOverlays();
  overlays.forEach((overlay: any) => {
    if (overlay instanceof BMap.Polyline) {
      mapInstance.value.removeOverlay(overlay);
    }
  });

  const points = locations.map(loc => {
    const coords = useBaiduCoordinates.value && loc.baiduCoordinates
      ? loc.baiduCoordinates
      : loc.coordinates;
    return new BMap.Point(coords.lng, coords.lat);
  });

  const drivingRoute = new BMap.DrivingRoute(mapInstance.value, {
    renderOptions: {
      map: mapInstance.value,
      autoViewport: true,
      panel: "r-result" // A placeholder to prevent showing an external panel
    },
    onSearchComplete: (results: any) => {
      if (drivingRoute.getStatus() === BMAP_STATUS_SUCCESS) {
        // The API automatically renders the route on the map
      }
    }
  });

  const startPoint = points[0];
  const endPoint = points[points.length - 1];
  const waypoints = points.slice(1, -1);

  if (waypoints.length > 0) {
    drivingRoute.search(startPoint, endPoint, { waypoints: waypoints });
  } else {
    drivingRoute.search(startPoint, endPoint);
  }
};

const updateMap = () => {
  if (!mapInstance.value) return;
  renderMarkers(travelLocations.value);
  renderDrivingRoute(travelLocations.value);
};

// 📌 Function to initialize the map and add markers/directions
const initBaiduMap = () => {
  if (typeof BMap === 'undefined' || typeof BMap.Convertor === 'undefined') {
    console.error('Baidu Maps API or Convertor not loaded.');
    return;
  }
  mapInstance.value = new BMap.Map("map-container");
  // Create Baidu Map points from our locations
  baiduPoints.value = travelLocations.value.map(loc => toBaiduPoint(loc));
  setMapViewPortFitAllPoints();
  renderMarkers(travelLocations.value);

  // Create Baidu Map points from our locations' standard coordinates
//   const pointsToConvert = travelLocations.value.map(loc => new BMap.Point(loc.coordinates.lng, loc.coordinates.lat));

  // Convert the points from WGS84 (standard GPS) to BD09 (Baidu's system)
//   BMap.Convertor.transMore(pointsToConvert, 0, (convertedPoints: any[]) => {
//     if (convertedPoints && convertedPoints.length > 0) {
//       // Store the converted coordinates
//       travelLocations.value.forEach((loc, index) => {
//         loc.baiduCoordinates = { lat: convertedPoints[index].lat, lng: convertedPoints[index].lng };
//       });
//       renderMarkers(travelLocations.value);
//     } else {
//       console.error('Coordinate conversion failed.');
//       renderMarkers(travelLocations.value);
//     }
//   });
};

// 📌 Watch for changes in activeMarkerId to update marker icon (Baidu does not have a simple icon change for this example)
watch(activeMarkerId, (newId) => {
  // A simple way to "highlight" is to pan to the marker.
  const activeLocation = travelLocations.value.find(loc => loc.id === newId);
  if (activeLocation) {
    const coords = useBaiduCoordinates.value && activeLocation.baiduCoordinates
      ? activeLocation.baiduCoordinates
      : activeLocation.coordinates;
    const point = new BMap.Point(coords.lng, coords.lat);
    mapInstance.value.panTo(point);
  }
});

// Watch the switch to re-render the map
watch(useBaiduCoordinates, () => {
  renderMarkers(travelLocations.value);
});

// 📌 Handle panel clicks to highlight on map
const handlePanelClick = (location: TravelLocation) => {
  activeMarkerId.value = location.id;
  const coords = useBaiduCoordinates.value && location.baiduCoordinates
    ? location.baiduCoordinates
    : location.coordinates;
  const point = new BMap.Point(coords.lng, coords.lat);
  mapInstance.value.panTo(point);
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
