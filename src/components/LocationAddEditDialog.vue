<template>
  <v-dialog v-model="isOpen" max-width="700px">
    <v-card>
      <v-card-title>
        {{ isEdit ? 'Edit TravelLocation' : 'Add New TravelLocation' }}
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="onSave">
          <v-text-field v-model="form.id" label="ID" required />
          <v-text-field v-model="form.title" label="Name" required />
          <!-- <v-text-field v-model="form.coordinates?.lat" label="Latitude" required />
          <v-text-field v-model="form.coordinates?.lng" label="Longtitude" required /> -->
          <v-text-field v-model="form.date" label="Date" type="date" required />
          <v-text-field v-model="form.duration" label="Date" type="date" required />
          <v-textarea v-model="form.description" label="Description" required />
          <v-textarea v-model="form.notes" label="Description" required />

          <!-- Images Manager -->
          <div class="mb-4">
            <h4>Images</h4>
            <v-row>
              <v-col
                v-for="(img, idx) in form.images"
                :key="idx"
                cols="6"
                md="4"
              >
                <v-card>
                  <v-img :src="img" height="120" cover />
                  <v-card-actions>
                    <v-btn
                      :icon="mdiDelete"
                      color="error"
                      size="small"
                      @click="removeImage(idx)"
                    />
                  </v-card-actions>
                </v-card>
              </v-col>

              <!-- Add New Image Field -->
              <v-col cols="12">
                <v-text-field
                  v-model="newImage"
                  label="Add Image URL"
                  @keyup.enter="addImage"
                >
                  <template #append-inner>
                    <v-btn :icon="mdiPlus" variant="text" @click="addImage" />
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn color="primary" @click="onSave">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { mdiDelete, mdiPlus } from "@mdi/js"
import { ref, watch, reactive, computed } from 'vue'
import type { TravelLocation } from '@/lib/types/TravelLocation'

interface Props {
  modelValue: boolean
  location?: TravelLocation
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', location: TravelLocation): void
}>()

// internal dialog open state
const isOpen = ref(props.modelValue)
watch(() => props.modelValue, val => (isOpen.value = val))
watch(isOpen, val => emit('update:modelValue', val))


function getAnEmptyLocation(): TravelLocation {
  return {
    id: null,
    title: "",
    date: "",
    duration: "",
    description: "",
    notes: "",
    images: [],
    weblinks: [],
    coordinates: {
      lat: 0,
      lng: 0
    },
    baiduCoordinates: null
  }
}

// form state
const form = reactive<TravelLocation>(getAnEmptyLocation())

// for adding new image
const newImage = ref('')

// detect edit mode
const isEdit = computed(() => !!props.location)

// preload if editing
watch(
  () => props.location,
  (loc) => {
    if (loc) {
      form.id = loc.id
      form.title = loc.title
      form.date = loc.date
      form.description = loc.description
      form.notes = loc.notes
      form.images = [...(loc.images || [])]
      form.weblinks = loc.weblinks
      form.baiduCoordinates = loc.baiduCoordinates
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

function addImage() {
  if (newImage.value.trim()) {
    form.images.push(newImage.value.trim())
    newImage.value = ''
  }
}

function removeImage(index: number) {
  form.images.splice(index, 1)
}

function onSave() {
  if (!form.title || !form.date) return
  emit('save', { ...form })
  close()
}

function close() {
  isOpen.value = false
}

function resetForm() {
  Object.assign(form, getAnEmptyLocation());
}
</script>
