<template>
  <v-container>
    <!-- Add Travel Button -->
    <v-btn color="primary" class="mb-4" @click="openAddEditDialog(undefined)">
      {{ $t('addNew') + ' ' + $t('travel') }}
    </v-btn>

    <!-- Add/Edit Dialog -->
    <TravelAddEditDialog
      v-model="dialog"
      :title="$t('travel')"
      :data="selectedItem"
      :get-an-empty-item="getAnEmptyItem"
      @save="doSave"
    />

    <!-- Confirm Remove Dialog -->
    <ConfirmDialog
      v-model="confirmDialog"
      :title="$t('confirm') + ' ' + $t('delete')"
      message="Are you sure you want to remove this item?"
      @confirm="confirmRemove"
    />

    <!-- Travel Cards -->
    <v-row>
      <v-col
        v-for="(item, index) in travelStore.travels"
        :key="index"
        cols="12"
        md="4"
      >
        <TravelCard
          :data="item"
          @edit="openAddEditDialog(item)"
          @remove="askRemove"
        />
      </v-col>
    </v-row>

    <!-- Loading / Error -->
    <v-progress-circular
      v-if="travelStore.loading"
      indeterminate
      color="primary"
      size="48"
    />
    <v-alert v-if="travelStore.error" type="error">
      {{ travelStore.error }}
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import TravelAddEditDialog from '@/components/TravelAddEditDialog.vue'
import TravelCard from '@/components/TravelCard.vue'
import type { Travel } from '@/lib/types/Travel'
import TravelStore  from '@/lib/stores/travelStore'

const travelStore = TravelStore()

const dialog = ref(false)
let selectedItem : Travel | undefined = undefined
const confirmDialog = ref(false)
const item2Delete = ref<number|undefined>(undefined)

function getAnEmptyItem() : Travel {
  return {
    id: undefined,
    title: "",
    dateStart: new Date(),
    dateEnd: new Date(),
    description: "",
    images: [],
    locations: []
  };
}

function openAddEditDialog(item?: Travel) {
  if (item) {
    selectedItem = {
      id: item.id,
      title: item.title,
      dateStart: item.dateStart,
      dateEnd: item.dateEnd,
      description: item.description,
      images: [],
      locations: []
    }
    selectedItem.images = selectedItem.images.concat(item.images)
    selectedItem.locations = selectedItem.locations.concat(item.locations)
  } else {
    selectedItem = undefined
  }
  dialog.value = true
}

function doSave(item: Travel) {
  if (item.id) {
    travelStore.updateTravel(item.id, item)
  } else {
    travelStore.addTravel(item)
  }
}

const askRemove = (id?: number) => {
  item2Delete.value = id
  confirmDialog.value = true
}

const confirmRemove = () => {
  if (item2Delete.value) {
    travelStore.deleteTravel(item2Delete.value)
  }
  confirmDialog.value = false
  item2Delete.value = undefined
}

onMounted(() => {
  travelStore.fetchTravels();
});
</script>
