<template>
  <p class="setting-title">
    Interface settings
  </p>
  <div class="setting-content">
    <div>
      <div class="setting-title">FQDN:</div>
      <div class="setting-text" v-if="fqdn">
        {{ fqdn }}
      </div>
      <div class="setting-text" v-else>
        Running on localhost
      </div>
    </div>
    <div>
      <div class="setting-title">MAC-address:</div>
      <div class="setting-text">
        {{ macAddress }}
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { useStore } from 'vuex';

  defineOptions({
      name: 'NetworkInterfaceSettings'
  })

  const props = defineProps({
    tabIndex: {
      type: Number,
      default: 0,
    }
  });

  const emit = defineEmits(['complete']);

  const store = useStore();

  const selectedInterface = ref('');
  const fqdn = ref('');
  const macAddress = ref('');

  const ethernetData = computed(() => store.state.network.ethernetData);

  const getSettings = () => {
    selectedInterface.value = props.tabIndex;
    
    if (ethernetData.value && ethernetData.value[props.tabIndex]) {
      const interfaceData = ethernetData.value[props.tabIndex];
      fqdn.value = interfaceData.FQDN || '';
      macAddress.value = interfaceData.MACAddress || '';
    }
  };

  watch(() => props.tabIndex, () => {
    getSettings();
  });

  watch(ethernetData, () => {
    getSettings();
  }, { deep: true });

  onMounted(async () => {
    try {
      await store.dispatch('network/getEthernetData');
      getSettings();
      emit('complete');
    } catch (error) {
      console.error('Failed to load network data:', error);
    }
  });
</script>

<style scoped>
.setting-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.setting-description {
  flex: 1;
  min-width: 200px;
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
</style>