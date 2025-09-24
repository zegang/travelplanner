<template>
  <v-dialog v-model="isOpen" max-width="700px">
    <v-card>
      <v-card-title>
        {{ isEdit ? $t('edit') : $t('addNew') }} {{ " " + title }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="onSave">
          <v-text-field v-model="formData.title" :label="$t('title')" variant="outlined"
            :rules="[rules.required]" required />
          <v-text-field v-model="formattedDateStart" :label="$t('dateStart')"
            variant="outlined" type="date" :rules="[rules.required]" required />
          <v-text-field v-model="formattedDateEnd" :label="$t('dateEnd')"
            variant="outlined" type="date" :rules="[rules.required]" required />
          <v-textarea v-model="formData.description" :label="$t('description')" variant="outlined"
            :rules="[rules.required]" required />

          <!-- Images Manager -->
          <div class="mb-4">
            <h4>{{ $t('images') }}</h4>
            <v-row>
              <v-col
                v-for="(img, idx) in formData.images"
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
        <v-btn text @click="onReset">{{ $t('reset') }}</v-btn>
        <v-btn text @click="onCancel">{{ $t('cancel') }}</v-btn>
        <v-btn color="primary" @click="onSave">{{ $t('save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { mdiDelete, mdiPlus } from "@mdi/js"
import { ref, watch, computed } from 'vue'
import type { Travel as ItemType } from '@/lib/types/Travel'

const form = ref();
const rules = {
  required: (value: any) => !!value || 'This field is required',
};

interface Props {
  modelValue: boolean,
  title: string,
  data?: ItemType,
  getAnEmptyItem: () => ItemType,
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', data: ItemType): void
}>()

let oldData : ItemType | undefined = undefined
const isOpen = ref(props.modelValue)
watch(
  () => props.modelValue,
  (val) => { oldData = props.data; isOpen.value = val; }
)
watch(isOpen, val => emit('update:modelValue', val))

const formData = ref<ItemType>(props.getAnEmptyItem())
const newImage = ref('')
const isEdit = computed(() => !!props.data)
const formattedDateStart = computed({
  get() {
    return formData.value.dateStart.toISOString().split('T')[0];
  },
  set(value : string) {
    formData.value.dateStart = new Date(value.replace(/\//g, '-'));
  }
});

const formattedDateEnd = computed({
  get() {
    return formData.value.dateEnd.toISOString().split('T')[0];
  },
  set(value : string) {
    formData.value.dateEnd = new Date(value.replace(/\//g, '-'));
  }
});

function close() {
  isOpen.value = false
}

function resetFormData() {
  Object.assign(formData.value, props.getAnEmptyItem());
}

watch(
  () => props.data,
  (data) => {
    if (data) {
      Object.assign(formData.value, data)
    } else {
      resetFormData()
    }
  },
  { immediate: true }
)

function addImage() {
  if (newImage.value.trim()) {
    formData.value.images.push(newImage.value.trim())
    newImage.value = ''
  }
}

function removeImage(index: number) {
  formData.value.images.splice(index, 1)
}

function onReset() {
  if (oldData) {
    console.log(oldData)
    Object.assign(formData.value, oldData)
  } else {
    resetFormData()
  }
}

function onCancel() {
  close()
}

async function onSave() {
  const { valid } = await form.value.validate()
  if (valid) {
    emit('save', { ...formData.value })
    close()
  }
}
</script>
