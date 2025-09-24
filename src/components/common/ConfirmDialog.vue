<template>
  <v-dialog v-model="internalModel" max-width="50vw">
    <v-card>
      <v-card-title class="text-h6">{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="cancel">{{ $t('cancel') }}</v-btn>
        <v-btn color="error" @click="confirm">{{ $t('confirm')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm',
  message: 'Are you sure?',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

// Sync with v-model
const internalModel = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    internalModel.value = val
  }
)

watch(internalModel, (val) => {
  emit('update:modelValue', val)
})

const confirm = () => {
  emit('confirm')
  internalModel.value = false
}

const cancel = () => {
  emit('cancel')
  internalModel.value = false
}
</script>
