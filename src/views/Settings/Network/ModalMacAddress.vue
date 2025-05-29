<script setup>
import { ref, watch, nextTick } from 'vue'
import { useForm, useField, defineRule } from 'vee-validate'
import { required } from '@vee-validate/rules'

const patterns = [
  /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, // : или -
  /^([0-9A-Fa-f]{4}\.){2}([0-9A-Fa-f]{4})$/,    // точки (Cisco)
  /^[0-9A-Fa-f]{12}$/                           // без разделителей
];

defineRule('required', required)
defineRule('macAddress', value => {
  if (!value) return true 
  
  const trimmedValue = value.trim()
  if (!trimmedValue) return true
  
  const isValid = patterns.some(pattern => pattern.test(trimmedValue))
  return isValid || 'MAC address is not correct'
})

const props = defineProps({
  macAddress: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['ok', 'hidden'])

const modal = ref(null)

const { handleSubmit, resetForm: resetVeeForm, setFieldValue } = useForm({
  initialValues: {
    macAddress: props.macAddress
  }
})

const { value: macAddress, errorMessage } = useField('macAddress', 'required|macAddress')

watch(() => props.macAddress, (newVal) => {
  setFieldValue('macAddress', newVal)
})

const handleFormSubmit = handleSubmit((values) => {
  emit('ok', { MACAddress: values.macAddress })
  closeModal()
})

const closeModal = () => {
  nextTick(() => {
    modal.value.close()
  })
}

const resetForm = () => {
  setFieldValue('macAddress', props.macAddress)
  resetVeeForm()
  emit('hidden')
}

const onOk = (evt) => {
  evt.preventDefault()
  handleFormSubmit()
}

defineExpose({
  openModal: () => modal.value.showModal(),
  closeModal
})
</script>

<template>
  <dialog ref="modal" class="modal" @close="resetForm">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Edit MAC-address</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      
      <form id="mac-settings" class="modal-form" @submit.prevent="handleFormSubmit">
        <div class="form-group">
          <label for="mac-address">MAC Address</label>
          <input
            id="mac-address"
            v-model="macAddress"
            type="text"
            placeholder="00:11:22:33:44:55"
            @input="(e) => setFieldValue('macAddress', e.target.value)"
          />
          <div v-if="errorMessage" class="invalid-feedback">
            {{ errorMessage }}
          </div>
        </div>
      </form>

      <div class="modal-footer">
        <button type="button" class="secondary-button" @click="closeModal">
          Cancel
        </button>
        <button
          form="mac-settings"
          type="submit"
          class="primary-button"
          :disabled="!!errorMessage"
        >
          Change
        </button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.modal {
  border: none;
  border-radius: 8px;
  padding: 0;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e5e5;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-form {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-input.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #e5e5e5;
}

.primary-button {
  padding: 0.5rem 1rem;
  background-color: #0062ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.primary-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.secondary-button {
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.secondary-button:hover {
  background-color: #e0e0e0;
}
</style>