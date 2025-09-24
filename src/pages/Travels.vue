<template>
  <v-container>
    <!-- Add TravelLocation Button -->
    <v-btn color="primary" class="mb-4" @click="openAddEditDialog(undefined)">
      Add New TravelLocation
    </v-btn>

    <!-- Add/Edit Dialog -->
    <LocationAddEditDialog
      v-model="dialog"
      :location="selectedLocation"
      @save="saveLocation"
    />

    <!-- Confirm Remove Dialog -->
    <ConfirmDialog
      v-model="confirmDialog"
      title="Confirm Deletion"
      message="Are you sure you want to remove this location?"
      @confirm="confirmRemove"
    />

    <!-- Travel TravelLocation Cards -->
    <v-row>
      <v-col
        v-for="(loc, index) in locations"
        :key="index"
        cols="12"
        md="4"
      >
        <LocationCard
          :location="loc"
          @edit="openAddEditDialog"
          @remove="askRemove"
        />
      </v-col>
    </v-row>

    <!-- Loading / Error -->
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      size="48"
    />
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import type { TravelLocation } from '@/stores/types/TravelLocation'
import LocationCard from '@/components/LocationCard.vue'
import LocationAddEditDialog from '@/components/LocationAddEditDialog.vue'
import { useLocationStore } from '@/stores/locationStore'

// store
const locationStore = useLocationStore()
const { locations, loading, error, fetchLocations, addLocation, updateLocation, deleteLocation } =
  locationStore

// dialog state
const dialog = ref(false)
const selectedLocation = ref<TravelLocation | undefined>(undefined)

// remove confirmation dialog
const confirmDialog = ref(false)
const locationToDelete = ref<number | null>(null)

// --- methods ---
function openAddEditDialog(loc?: TravelLocation) {
  selectedLocation.value = loc
  dialog.value = true
}

function saveLocation(loc: TravelLocation) {
  alert(loc.id)
  if (loc.id == null ) {
    addLocation(loc)
  } else {
    updateLocation(loc.id, loc)
  }
}

const askRemove = (id: number | null) => {
  locationToDelete.value = id
  confirmDialog.value = true
}

const confirmRemove = () => {
  if (locationToDelete.value !== null) {
    deleteLocation(locationToDelete.value)
  }
  confirmDialog.value = false
  locationToDelete.value = null
}
</script>
