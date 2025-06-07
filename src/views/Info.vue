<template>
  <div>
    <h1 class="overview-title">Overview</h1>
    <div class="settings-grid">
      <div class="setting-section">
        <div class="setting-description">
          <h3 class="setting-title">BMC base system information</h3>
          <p class="setting-text">Username: {{ username }}</p>
          <p class="setting-text">Running firmware ID: {{ firmwareVersion }}</p>
          <p class="setting-text">Model: {{ model }}</p>
        </div>
      </div>
      
      <div class="setting-section">
        <div class="setting-description">
          <h3 class="setting-title">BMC base network information</h3>
          <p class="setting-text">Link status: {{ linkStatus }}</p>
          <p class="setting-text">Protocols used: Redfish, HTTPS</p>
        </div>
      </div>
      
      <div class="setting-section">
        <div class="setting-description">
          <h3 class="setting-title">BMC status</h3>
          <p class="setting-text">Health: {{ healthStatus }}</p>
        </div>
      </div>
      
      <button class="reboot-button" @click="refresh" :disabled="loading">
        {{ loading ? 'Refreshing...' : 'Refresh' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { getCurrentInstance } from 'vue'

defineOptions({
  name: 'Overview'
})

const loading = ref(true)
const store = useStore()
const instance = getCurrentInstance()

const username = computed(() => store.getters['global/username'] || 'Loading...')
const firmwareVersion = computed(() => store.getters['firmware/activeBmcFirmware']?.version || 'Unknown')
const model = computed(() => store.getters['system/systems']?.[0]?.model || 'QEMU')
const linkStatus = computed(() => {
  const status = store.getters['network/globalNetworkSettings']?.[0]?.linkStatus
  return status ? status : 'Loading...'
})
const healthStatus = computed(() => store.getters['eventLog/healthStatus'] || 'Unknown')

const isFirmwareLoaded = ref(false)
const isSystemLoaded = ref(false)
const isNetworkLoaded = ref(false)

const startLoader = () => {
  instance.emit('loader-start')
  loading.value++
}

const hideLoader = () => {
  instance.emit('loader-end')
}

const endLoader = () => {
  loading.value = false
  hideLoader()
}

const refresh = async () => {
  startLoader()
  try {
    await Promise.all([
      store.dispatch('firmware/getFirmwareInformation'),
      store.dispatch('system/getSystem'),
      store.dispatch('network/getEthernetData'),
      store.dispatch('eventLog/getEventLogData')
    ])
  } finally {
    endLoader()
  }
  emit('refresh')
}

watchEffect(() => {
  if (store.getters['firmware/activeBmcFirmware']) {
    isFirmwareLoaded.value = true
  }
  if (store.getters['system/systems']) {
    isSystemLoaded.value = true
  }
  if (store.getters['network/globalNetworkSettings']) {
    isNetworkLoaded.value = true
  }
})

onMounted(async () => {
  document.title = 'Overview'
  await refresh()
})

const emit = defineEmits(['refresh'])
</script>

<style scoped>
.overview-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
}

.setting-section {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #fff;
}

.setting-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.setting-description {
  flex: 1;
  min-width: 0;
}

.setting-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.setting-text {
  color: #666;
  margin: 0;
}

.reboot-button {
  display: block;
  margin-top: 3rem;
  padding: 0.5rem 1rem;
  background-color: cadetblue;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.reboot-button:hover {
  background-color: rgb(9, 53, 54);
}

</style>