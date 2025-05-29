<template>
  <div>
    <h1 class="policies-title">Policies</h1>
    
    <div class="settings-grid">
      <!-- SSH Policy Section -->
      <div class="setting-section">
        <div class="setting-content">
          <div class="setting-description">
            <h3 class="setting-title">BMC shell (via SSH)</h3>
            <p class="setting-text">
              Allow access to shell sessions via SSH, through port 2222 on the BMC.
            </p>
          </div>
          <label class="toggle-switch">
            <input 
              type="checkbox" 
              v-model="sshProtocolState"
              data-test-id="policies-toggle-bmcShell"
              class="toggle-input"
            >
            <span class="toggle-slider"></span>
            <span class="toggle-label">
              {{ sshProtocolState ? 'SSH enabled' : 'SSH disabled' }}
            </span>
          </label>
        </div>
      </div>

      <!-- IPMI Policy Section -->
      <div class="setting-section">
        <div class="setting-content">
          <div class="setting-description">
            <h3 class="setting-title">Network IPMI (out-of-band IPMI)</h3>
            <p class="setting-text">
              Allow remote management of the platform via IPMI. 
              Tools such as ipmitool require this setting to be enabled.
            </p>
          </div>
          <label class="toggle-switch">
            <input 
            type="checkbox" 
            v-model="ipmiProtocolState"
            data-test-id="polices-toggle-networkIpmi"
            class="toggle-input"
            >
            <span class="toggle-slider"></span>
            <span class="toggle-label">
              {{ ipmiProtocolState ? 'IPMI enabled' : 'IPMI disabled' }}
            </span>
          </label>
        </div>
      </div>
      
      <!-- Web Session Timeout Section -->
      <div class="setting-section">
        <div class="setting-content">
          <div class="setting-description">
            <h3 class="setting-title">WEB Session Timeout</h3>
            <p class="setting-text">
             Change the Web session timeout in given options
            </p>
          </div>
          <div class="timeout-select">
            <select
              id="session-timeout-options"
              v-model="sessionTimeoutState"
              class="custom-select"
            >
              <option value="" disabled>
                select an option
              </option>
              <option 
                v-for="option in sessionTimeOutOptions"
                :key="option.value"
                :value="option.value"
              >
              {{ option.text }}
            </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import { getCurrentInstance } from 'vue'

  defineOptions({
      name: 'Policies'
  })

  const store = useStore()
  const router = useRouter()
  const instance = getCurrentInstance()

  const loading = ref(true)

  const sessionTimeOutOptions = ref([
    { value: 60, text: '1 minute' },
    { value: 1800, text: '30 minutes' },
    { value: 3600, text: '1 hour' },
    { value: 7200, text: '2 hours' },
    { value: 14400, text: '4 hours' },
    { value: 28800, text: '8 hours' },
  ])

  const sshProtocolState = computed({
    get: () => store.getters['policies/sshProtocolEnabled'],
    set: (newValue) => {changeSshProtocolState(newValue);}
  })

  const ipmiProtocolState = computed({
    get: () => store.getters['policies/ipmiProtocolEnabled'],
    set: (newValue) => {changeIpmiProtocolState(newValue);}
  })

  const sessionTimeoutState = computed({
    get: () => store.getters['policies/getSessionTimeoutValue'],
    set: (newValue) => {saveSessionTimeoutValue(newValue);}
  })

  const hideLoader = () => {
    instance.emit('loader-end')
  }

  const endLoader = () => {
    loading.value = false
    hideLoader()
  }
  
  const changeSshProtocolState = (state) => {
    store
      .dispatch('policies/saveSshProtocolState', state)
      .then((message) => console.info(message))
      .catch(({ message }) => console.error(message));
  }

  const changeIpmiProtocolState = (state) => {
    store
      .dispatch('policies/saveIpmiProtocolState', state)
      .then((message) => console.info(message))
      .catch(({ message }) => console.error(message));
  }

  const saveSessionTimeoutValue = (sessionTimeoutState) => {
    store
      .dispatch('policies/saveSessionTimeoutValue', sessionTimeoutState)
      .then((message) => console.info(message))
      .catch(({ message }) => console.error(message));
  }

  router.beforeEach((to, from, next) => {
    hideLoader()
    next()
  })

  onMounted(() => {
    document.title = 'Policies'
    instance.emit('loader-start')
    
    Promise.all([
      store.dispatch('policies/getNetworkProtocolStatus'),
      store.dispatch('policies/getSessionTimeout'),
    ]).finally(endLoader)
  })
</script>

<style scoped>
.policies-title {
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

/* Toggle Switch Styles */
.toggle-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  background-color: #ccc;
  border-radius: 34px;
  transition: background-color 0.3s;
}

.toggle-slider:before {
  content: "";
  position: absolute;
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.toggle-input:checked + .toggle-slider {
  background-color: #2196F3;
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.toggle-label {
  font-weight: 500;
}

/* Select Dropdown Styles */
.timeout-select {
  min-width: 180px;
}

.custom-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
}

.custom-select:focus {
  outline: none;
  border-color: #2196F3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .setting-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  
  .timeout-select {
    width: 100%;
  }
}
</style>