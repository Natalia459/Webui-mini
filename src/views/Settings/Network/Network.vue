<template>
  <div>
    <h1 class="settings-title">Network settings</h1>
    <div class="settings-grid">
      <p class="setting-description">
        Configure interface settings and check Ipv4/Ipv6 adresses
      </p>
      <!-- Interface tabs -->
      <div class="setting-section">
        <!-- Interface settings -->
        <NetworkInterfaceSettings :tab-index="$tabIndex" />
        <slot />
      </div>
      <div class="setting-section">
        <div class="setting-content">
          <!-- IPV4 table -->
          <TableIpv4 :tab-index="$tabIndex" />
        </div>
        <slot />
      </div>
      <div class="setting-section">
        <div class="setting-content">
          <!-- IPV6 table -->
          <TableIpv6 :tab-index="$tabIndex" />
        </div>
        <slot />
      </div>

      <!-- Modals -->
      <ModalMacAddress :mac-address="currentMacAddress" @ok="saveSettings" />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import { getCurrentInstance } from 'vue'
  import ModalMacAddress from './ModalMacAddress.vue'
  import NetworkInterfaceSettings from './NetworkInterfaceSettings.vue'
  import TableIpv4 from './TableIpv4.vue'
  import TableIpv6 from './TableIpv6.vue'

  defineOptions({
      name: 'Network'
  });

  const store = useStore();
  const router = useRouter();
  const instance = getCurrentInstance();

  document.title = 'Network';

  const currentMacAddress = ref('');
  const loading = ref(0);
  const activeTab = ref(0);
  
  const ethernetData = computed(() => {
    get: store.getters['network/ethernetData']});
  const tabIndex = computed(() => {
    let {data, index} = ethernetData.value[0];
    getTabIndex(index);
  });

  const startLoader = () => {
    instance.emit('loader-start')
    loading.value++
  };

  const endLoader = () => {
    loading.value--
    if (loading.value <= 0) {
      instance.emit('loader-end')
      loading.value = 0
    }
  };

  const hideLoader = () => {
    instance.emit('loader-end')
  };

  const getModalInfo = () => {
    currentMacAddress.value = store.getters['network/globalNetworkSettings'][tabIndex.value]?.macAddress || ''
  };

  const getTabIndex = (selectedIndex) => {
    tabIndex.value = selectedIndex
    store.dispatch('network/setSelectedTabIndex', selectedIndex)
    store.dispatch('network/setSelectedTabId', ethernetData.value[selectedIndex]?.Id)
    getModalInfo()
  }

  const saveSettings = (modalFormData) => {
    startLoader()
    store.dispatch('network/saveSettings', modalFormData)
      .then((message) => console.info(message))
      .catch(({ message }) => console.error(message))
      .finally(endLoader)
  };

  watch(ethernetData, getModalInfo);

  router.beforeEach((to, from, next) => {
    hideLoader()
    next()
  });

  onMounted(() => {
    startLoader()
    
    const promises = [
      store.dispatch('network/getEthernetData'),
      new Promise(resolve => {
        instance.emit('network-interface-settings-complete', resolve)
      }),
      new Promise(resolve => {
        instance.emit('network-table-dns-complete', resolve)
      }),
      new Promise(resolve => {
        instance.emit('network-table-ipv4-complete', resolve)
      }),
      new Promise(resolve => {
        instance.emit('network-table-ipv6-complete', resolve)
      })
    ]

    Promise.all(promises).finally(endLoader)
  });
</script>

<style scoped>
.settings-title {
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

.interface-section {
  margin-top: 2rem;
}

.tabs-container {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.tabs-header {
  display: flex;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

.tab-button {
  padding: 12px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.tab-button:hover {
  background-color: #e9ecef;
}

.tab-button.active {
  font-weight: bold;
  border-bottom: 2px solid #007bff;
  background-color: white;
}

.tab-content {
  padding: 20px;
  background-color: white;
}

.tab-pane {
  display: none;
}

.tab-pane.active {
  display: block;
}
</style>