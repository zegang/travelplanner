<template>
  <!-- Full height container for the mobile view (using position-relative for absolute children) -->
  <div class="h-100 w-100 position-relative">
    <div class="d-flex align-center justify-space-between ma-2">
      <v-btn
        icon
        size="small"
        @click="$emit('toggleNav')"
      >
        <v-icon>{{ isNavCollapsed ? mdiChevronRight : mdiChevronLeft }}</v-icon>
      </v-btn>
      <v-btn icon size="small" @click="$emit('fitView', travelLocations)">
        <v-icon>{{  mdiMapMarkerPath }}</v-icon>
      </v-btn>
      <v-btn icon size="small">
        <v-icon>{{  mdiCar }}</v-icon>
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

    <!-- 1. Full-Screen Baidu Map Container (fills 100% of parent) -->
    <div id="map-container" class="map-container-full elevation-4">
      <!-- Map will be initialized here -->
    </div>

    <!-- 2. Floating Bottom Content: Swipable Location Cards -->
    <v-sheet 
        class="floating-cards-container pa-2 elevation-8 rounded-t-xl w-90"
        color="white" 
        style="max-height: 30vh;"
    >

      <!-- Header -->
      <div class="d-flex align-center flex-shrink-0 mb-3 justify-space-between">
        <h2 class="text-h6 font-weight-bold text-primary">
          旅行目的地 ({{ currentSlideIndex + 1 }} / {{ travelLocations.length }})
        </h2>
        
        <div class="d-flex align-center">
          <!-- Placeholder for navigation/actions -->
        </div>
      </div>

      <!-- Swipable Cards (v-window) -->
      <v-window v-model="currentSlideIndex" continuous class="flex-grow-1">
        <v-window-item
          v-for="(location, index) in travelLocations"
          :key="index"
          :value="index"
          class="pa-2 h-100"
        >
          <v-card 
              class="h-100 rounded-xl d-flex flex-column elevation-2" 
              :color="activeMarkerId === location.id ? 'light-blue-lighten-5' : 'white'"
              @click="updateParentState"
          >
            <v-card-title class="text-subtitle-1 font-weight-bold text-primary pb-0">
              {{ index + 1 }}. {{ location.title }}
            </v-card-title>
            
            <v-card-subtitle class="d-flex align-center py-1">
              <v-chip size="x-small" color="primary" class="mr-2">{{ location.date }}</v-chip>
              <v-chip size="x-small" color="secondary">{{ location.duration }}</v-chip>
            </v-card-subtitle>
            
            <v-card-text class="flex-grow-1 overflow-y-auto">
              <p class="text-caption text-medium-emphasis">{{ location.description }}</p>
            </v-card-text>

            <v-card-actions class="pt-0">
              <v-btn 
                variant="flat" 
                size="small" 
                color="info" 
                @click.stop="showDetails(location)"
              >
                More Details
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-window-item>
      </v-window>
      
      <!-- Navigation Dots -->
      <div class="d-flex justify-center mt-2 flex-shrink-0">
        <v-btn
          v-for="(location, index) in travelLocations"
          :key="index"
          :icon="index === currentSlideIndex ? mdiCircle : mdiCircleOutline"
          size="x-small"
          variant="text"
          :color="index === currentSlideIndex ? 'primary' : 'grey'"
          @click="currentSlideIndex = index"
          class="mx-1"
        />
      </div>

    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
import { mdiCar, mdiChevronLeft, mdiChevronRight,
  mdiMapMarkerPath, mdiCircle, mdiCircleOutline
} from '@mdi/js';
import type { TravelLocation } from '@/lib/types/TravelLocation';

interface Props {
  isNavCollapsed: boolean; 
  useBaiduCoordinates: boolean;
  travelLocations: TravelLocation[];
  activeMarkerId: number | null;
  expandedLocationId: number[]; 
}
const props = defineProps<Props>();

interface Emits {
  (e: 'toggleNav'): void;
  (e: 'fitView', locations: TravelLocation[]) : void;
  (e: 'updateCoords', value: boolean): void;
  (e: 'collapseAll'): void;
  (e: 'panelClick', location: TravelLocation): void;
}
const emit = defineEmits<Emits>();

// Local state for the current slide index
const currentSlideIndex = ref(0);

// Helper function to emit the currently active location for the map
const updateParentState = () => {
    const location = props.travelLocations[currentSlideIndex.value];
    if (location) {
        emit('panelClick', location);
    }
};

const showDetails = (location: TravelLocation) => {
    // When "More Details" is clicked, we emit the panelClick event which triggers the dialog in the parent
    emit('panelClick', location);
}


// Watch the local index change (due to swipe or dot click) and emit to parent
watch(currentSlideIndex, () => {
    updateParentState();
});

// Watch for external changes (e.g., if activeMarkerId changes from map marker click)
watch(() => props.activeMarkerId, (newId) => {
    if (newId !== null) {
        const index = props.travelLocations.findIndex(loc => loc.id === newId);
        if (index !== -1 && index !== currentSlideIndex.value) {
            currentSlideIndex.value = index;
        }
    }
});

// Initialize the slide index on mount to ensure the map pans to the first item
onMounted(() => {
    // Wait until props are initialized and then update parent state
    nextTick(() => {
        if (props.travelLocations.length > 0) {
            updateParentState();
        }
    });
});
</script>

<style scoped>
.map-container-full {
  width: 100%;
  height: 100%;
}

.floating-cards-container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    /* Set a specific, constrained height for the card section */
    height: 30%;
    z-index: 500; /* Ensure cards are above the map */
    display: flex;
    flex-direction: column;
}

.coordinate-switch-mobile {
    position: absolute;
    top: 0;
    right: 0;
    /* Invert colors for switch on map background for contrast */
    filter: invert(1) hue-rotate(180deg) brightness(1.5);
    background: rgba(0, 0, 0, 0.4);
    border-radius: 0 0 0 10px;
    padding: 8px; 
    z-index: 1000;
}
</style>
