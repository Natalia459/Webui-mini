<template>
  <div>
    <p class="setting-title">IPv6</p>
    <div class="setting-content">
      <!-- DHCP Status Section -->
      <p class="setting-text">
        DHCP:  {{ dhcp6EnabledState ? 'enabled' : 'disabled' }}
      </p>

      <!-- IPv6 Table -->
      <table class="session-table" :aria-label="Ipv6">
        <thead>
          <tr>
            <th v-for="field in ipv6TableFields" :key="field.key">
              {{ field.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="form.ipv6TableItems.length === 0">
            <td :colspan="ipv6TableFields.length" class="empty-message">
              Empty result
            </td>
          </tr>
          <tr 
            v-for="(item, index) in form.ipv6TableItems" 
            :key="index"
            class="table-row"
          >
            <td v-for="field in ipv6TableFields" :key="field.key">
              {{ item[field.key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, computed, watch, onMounted } from 'vue'
  import { useStore } from 'vuex';
  import { getCurrentInstance } from 'vue'

  const store = useStore();
  const instance = getCurrentInstance();

  defineOptions({
      name: 'Ipv6Table'
  });

  const props = defineProps({
    tabIndex: {
      type: Number,
      default: 0,
    },
  });

  const defaultGateway= ref('');
  const form = reactive({ ipv6TableItems: [], });
  const ipv6TableFields = ref([
        {
          key: 'Address',
          label: 'ipAddress',
        },
        {
          key: 'PrefixLength',
          label: 'prefixLength',
        },
        {
          key: 'AddressOrigin',
          label: 'addressOrigin',
        },
  ]);

  const ethernetData = computed(() => store.state.network.ethernetData);

  const selectedInterface = computed( () =>
    store.getters['network/selectedInterfaceIndex']
  );

  const dhcp6EnabledState = computed({
    get: () => {
      store.getters['network/globalNetworkSettings']?.
      [selectedInterface]?.dhcp6Enabled === 'Enabled';
    },
  });

  watch(() => props.tabIndex, () => {getIpv6TableItems(); getDefaultGateway();});
  watch(ethernetData, () => {getIpv6TableItems(); getDefaultGateway();}, { deep: true });

  const getDefaultGateway = () => {
      if(ethernetData.value && ethernetData.value[props.tabIndex]){
        defaultGateway = ethernetData.value[props.tabIndex]?.IPv6DefaultGateway;
      }
  };

  const getIpv6TableItems = () => {
    const index = props.tabIndex;
    if(ethernetData.value && ethernetData.value[props.tabIndex]){
      const addresses =
        ethernetData.value[index]?.IPv6Addresses.filter(
          (ipv6) =>
            ipv6.AddressOrigin === 'LinkLocal' ||
            ipv6.AddressOrigin === 'Static' ||
            ipv6.AddressOrigin === 'SLAAC' ||
            ipv6.AddressOrigin === 'DHCPv6',
        ) || [];
      form.ipv6TableItems = addresses.map((ipv6) => {
        return {
          Address: ipv6.Address,
          PrefixLength: ipv6.PrefixLength,
          AddressOrigin: ipv6.AddressOrigin,
        };
      });
    }
  };


  onMounted(() => {
    getIpv6TableItems();
    getDefaultGateway();
    store.dispatch('network/getEthernetData').finally(() => {
      // Emit initial data fetch complete to parent component
      instance.emit('network-table-ipv6-complete');
    });
  });

</script>

<style scoped>
.setting-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.setting-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.session-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.session-table th,
.session-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.session-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.session-table tr:hover {
  background-color: #f5f5f5;
}
</style>