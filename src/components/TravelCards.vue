<!-- src/components/TravelCards.vue -->
<template>
  <v-container>
    <!-- Add Location Button -->
    <v-btn color="primary" class="mb-4" @click="dialog = true">
      Add New Location
    </v-btn>

    <!-- Add Location Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>Add a New Location</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveLocation">
            <v-text-field v-model="form.title" label="Name" required />
            <v-text-field v-model="form.date" label="Date" type="date" required />
            <v-textarea v-model="form.description" label="Description" required />
            <v-text-field v-model="form.images[0]" label="Image URL" required />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveLocation">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
    <v-row>
      <!-- Loading Spinner -->
      <!-- <v-col v-if="loading" cols="12">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col> -->

      <!-- Error Message -->
      <v-col v-if="error" cols="12">
        <v-alert type="error">{{ error }}</v-alert>
      </v-col>

      <!-- Locations Cards -->
      <v-col v-for="(location, index) in locations" :key="index" cols="12" md="4">
        <v-card>
          <v-img :src="location.images[0]" alt="Location Image" />
          <v-card-title>{{ location.title }}</v-card-title>
          <v-card-subtitle>{{ location.date }}</v-card-subtitle>
          <v-card-text>{{ location.description }}</v-card-text>
        </v-card>
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
import { ref, onMounted } from 'vue'
import { useLocationStore } from '@/lib/stores/locationStore'
import type { TravelLocation } from '@/lib/types/TravelLocation';

const locationStore = useLocationStore();
const { locations, loading, error, fetchLocations, addLocation } = locationStore

// dialog visibility
const dialog = ref(false)

// form state
const form = ref<TravelLocation>({
  id: null,
  title: '',
  date: '',
  duration: '',
  description: '',
  notes: '',
  images: [],
  weblinks: [],
  coordinates: null,
  baiduCoordinates: null
})

// save a new location
const saveLocation = () => {
  if (!form.value.title || !form.value.date) return
  addLocation({ ...form.value })
  dialog.value = false
  form.value = {
    id: null,
    title: '',
    date: '',
    duration: '',
    description: '',
    notes: '',
    images: [],
    weblinks: [],
    coordinates: null,
    baiduCoordinates: null
  }
}

onMounted(() => {
  fetchLocations();
})

</script>
