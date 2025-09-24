<template>
  <v-card>
    <!-- Carousel for multiple images -->
    <v-carousel
      height="200"
      cycle
      show-arrows="hover"
      hide-delimiter-background
      interval="3000"
    >
      <v-carousel-item
        v-if="data.images && data.images.length > 0"
        v-for="(img, i) in data.images"
        :key="i"
        :src="img"
        cover
      />
      <v-carousel-item
        v-else
        src="https://placehold.co/600x400/3f51b5/ffffff?text=Travel"
        cover
      />
    </v-carousel>

    <v-card-title>
      <span class="font-weight-bold">{{ data.title }}</span>
      <span>ID: {{ data.id }}</span>
    </v-card-title>
    <v-card-subtitle v-if="data.dateStart">
        <span><v-icon :icon="mdiCalendar"></v-icon>{{ $t('dateStart') }}:</span>
        <span>{{ data.dateStart.toISOString() }}</span>
    </v-card-subtitle>
    <v-card-subtitle v-if="data.dateEnd">
        <span><v-icon :icon="mdiCalendar"></v-icon>{{ $t('dateEnd')  }}:</span>
        <span>{{ data.dateEnd.toISOString() }}</span>
    </v-card-subtitle>
    <v-card-text>{{ data.description }}</v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        variant="text"
        @click="$emit('edit', data)"
      >
        {{ $t('edit' ) }}
      </v-btn>
      <v-btn
        color="error"
        variant="text"
        @click="emitRemove(data.id)"
      >
        {{ $t('remove' ) }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Travel } from '@/lib/types/Travel'
import { mdiCalendar } from '@mdi/js'

defineProps<{
  data: Travel
}>()

const emit = defineEmits<{
  (e: 'edit', data: Travel): void
  (e: 'remove', id?: number): void
}>()

function emitRemove(id?: number) {
  emit('remove', id);
}
</script>
