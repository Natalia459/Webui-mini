<template>
  <div class="table-container">
    <h1 class="page-title">Sessions</h1>
    <table class="session-table">
      <thead>
        <tr>
          <th v-for="field in fields" :key="field.key" :class="field.class">
            {{ field.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isBusy">
          <td :colspan="fields.length + 1" class="loading-message">
            {{ ('Status: loading') }}
          </td>
        </tr>
        <tr v-else-if="allConnections.length === 0">
          <td :colspan="fields.length + 1" class="empty-message">
            {{ ('Result: empty message') }}
          </td>
        </tr>
        <tr v-for="(item, rowIndex) in allConnections" :key="item.sessionID">
          <td v-for="field in fields" 
          :key="`${rowIndex}-${field.key}`" 
          :class="field.class">
            {{ item[field.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import { getCurrentInstance } from 'vue'

  defineOptions({
    name: 'Sessions'
  })

  const store = useStore()
  const router = useRouter()
  const instance = getCurrentInstance()

  const isBusy = ref(true)
  const loading = ref(true)

  const fields = [
    {
      key: 'sessionID',
      label: ('Session ID'),
      class: 'text-center',
    },
    {
      key: 'username',
      label: ('Username'),
      class: 'text-center',
    },
    {
      key: 'ipAddress',
      label: ('Ipv4 Address'),
      class: 'text-center',
    },
  ]

  const allConnections = computed(() => {
    return store.getters['sessions/allConnections'].map(session => ({
      ...session,
    }))
  })

  const hideLoader = () => {
    instance.emit('loader-end')
  }

  const endLoader = () => {
    loading.value = false
    hideLoader()
  }

  router.beforeEach((to, from, next) => {
    hideLoader()
    next()
  })

  onMounted(() => {
    document.title = 'Sessions'
    instance.emit('loader-start')
    
    store.dispatch('sessions/getSessionsData')
      .finally(() => {
        endLoader()
        isBusy.value = false
      })
  })
</script>

<style scoped>
.page-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
}

.table-container {
  overflow-x: auto;
  margin-top: 1rem;
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

.text-center {
  text-align: center;
}

.loading-message,
.empty-message {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

@media (min-width: 1500px) { 
  .session-table {
    min-width: 650px;  
  }
}
</style>