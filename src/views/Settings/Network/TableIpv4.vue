<template>
  <div>
    <p class="setting-title">IPv4</p>
    <div class="setting-content">
      <!-- DHCP Status Section -->
      <p class="setting-text">
        DHCP:  {{ dhcpEnabledState ? 'enabled' : 'disabled' }}
      </p>

      <!-- IPv4 Table -->
      <table class="session-table" :aria-label="Ipv4">
        <thead>
          <tr>
            <th v-for="field in ipv4TableFields" :key="field.key">
              {{ field.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="form.ipv4TableItems.length === 0">
            <td :colspan="ipv4TableFields.length" class="empty-message">
              Empty result
            </td>
          </tr>
          <tr 
            v-for="(item, index) in form.ipv4TableItems" 
            :key="index"
            class="table-row"
          >
            <td v-for="field in ipv4TableFields" :key="field.key">
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

  const store = useStore()
  const instance = getCurrentInstance()

  defineOptions({
      name: 'Ipv4Table'
  })

  const props = defineProps({
    tabIndex: {
      type: Number,
      default: 0,
    },
  })

  const form = reactive({ ipv4TableItems: [], });
  const ipv4TableFields = ref([
        {
          key: 'Address',
          label: 'ipAddress',
        },
        {
          key: 'Gateway',
          label: 'gateway',
        },
        {
          key: 'SubnetMask',
          label: 'subnet',
        },
        {
          key: 'AddressOrigin',
          label: 'addressOrigin',
        },
  ]);

  const ethernetData = computed(() => store.state.network.ethernetData)

  const selectedInterface = computed( () =>
    store.getters['network/selectedInterfaceIndex']
  )

  const dhcpEnabledState = computed({
    get: () => {
      store.getters['network/globalNetworkSettings']?.
      [selectedInterface]?.dhcpEnabled;
    },
  }) 

  watch(() => props.tabIndex, () => {getIpv4TableItems();});
  watch(ethernetData, () => {getIpv4TableItems();}, { deep: true });

  const getIpv4TableItems = () => {
    const index = props.tabIndex;
    if(ethernetData.value && ethernetData.value[props.tabIndex]){
      const addresses = ethernetData.value[index]?.IPv4Addresses || [];
      form.ipv4TableItems = addresses.map((ipv4) => {
        return {
          Address: ipv4.Address,
          SubnetMask: ipv4.SubnetMask,
          Gateway: ipv4.Gateway,
          AddressOrigin: ipv4.AddressOrigin,
        };
      });
    }
  }

  onMounted(() => {
    getIpv4TableItems();
    store.dispatch('network/getEthernetData').finally(() => {
      // Emit initial data fetch complete to parent component
      instance.emit('network-table-ipv4-complete');
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