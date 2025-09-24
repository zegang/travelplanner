<template>
  <v-card>
    <!-- Carousel for multiple images -->
    <v-carousel
      v-if="Array.isArray(location.images) && location.images.length > 1"
      height="200"
      cycle
      show-arrows="hover"
      hide-delimiter-background
      interval="3000"
    >
      <v-carousel-item
        v-for="(img, i) in location.images"
        :key="i"
        :src="img"
        cover
      />
    </v-carousel>

    <!-- Fallback for single image -->
    <v-img
      v-else
      :src="location.images == undefined ? '' : location.images[0]"
      height="200"
      cover
    />

    <v-card-title>
        <span class="font-weight-bold">{{ location.title }}</span>
        <span class="ml-4">{{ location.date }}</span>
        <span class="ml-4">{{ location.duration }} Minutes</span>
    </v-card-title>
    <v-card-subtitle>{{ location.id }}</v-card-subtitle>
    <v-card-text>{{ location.description }}</v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        variant="text"
        @click="$emit('edit', location)"
      >
        Edit
      </v-btn>
      <v-btn
        color="error"
        variant="text"
        @click="$emit('remove', location.id)"
      >
        Remove
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { TravelLocation } from '@/lib/types/TravelLocation'

defineProps<{
  location: TravelLocation
}>()

defineEmits<{
  (e: 'edit', location: TravelLocation): void
  (e: 'remove', id: number | null): void
}>()
</script>
