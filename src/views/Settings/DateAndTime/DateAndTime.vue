<template>
  <div>
    <h1 class="page-title">Date and time</h1>
    
    <div class="content-section">
      <div class="row">
        <div class="col date-col">
          <dl class="data-list">
            <dt class="data-title">{{ ('BMC date') }}</dt>
            <dd v-if="bmcTime" class="data-value">
              {{ $filters.formatDate(bmcTime) }}
            </dd>
            <dd v-else class="data-value">--</dd>
          </dl>
        </div>
        
        <div class="col time-col">
          <dl class="data-list">
            <dt class="data-title">{{ ('BMC time') }}</dt>
            <dd v-if="bmcTime" class="data-value">
              {{ $filters.formatTime(bmcTime) }}
            </dd>
            <dd v-else class="data-value">--</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import { getCurrentInstance } from 'vue'

  defineOptions({
      name: 'DateAndTime'
  })

  const store = useStore()
  const router = useRouter()
  const instance = getCurrentInstance()

  const form = ref({
    configurationSelected: 'manual',
    manual: {
      date: '',
      time: ''
    }
  })

  const bmcTime = computed(() => store.getters['global/bmcTime'])
  const isUtcDisplay = computed(() => store.getters['global/isUtcDisplay'])
  const timezone = computed(() => {
    return isUtcDisplay.value ? 'UTC' : localOffset()
  })

  watch(bmcTime, (newVal) => {
    if (newVal) {
      form.value.manual.date = formatDate(store.getters['global/bmcTime'])
      form.value.manual.time = formatTime(store.getters['global/bmcTime']).slice(0, 5)
    }
  })

  const hideLoader = () => {
    instance.emit('loader-end')
  }

  const endLoader = () => {
    hideLoader()
  }

  const getUtcDate = (date, time) => {
    const datesArray = date.split('-')
    const timeArray = time.split(':')
    let utcDate = Date.UTC(
      datesArray[0], // год
      parseInt(datesArray[1]) - 1, // месяц (0-11)
      datesArray[2], // день
      timeArray[0], // часы
      timeArray[1]  // минуты
    )
    return new Date(utcDate)
  }

  const localOffset = () => {
    return 'Local'
  }

  router.beforeEach((to, from, next) => {
    hideLoader()
    next()
  })

  onMounted(() => {
    document.title = 'Date and time'
    instance.emit('loader-start')
    
    store.dispatch('global/getBmcTime')
      .finally(endLoader)
  })

  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0]
  }

  const formatTime = (date) => {
    return new Date(date).toTimeString().slice(0, 8)
  }
</script>

<style scoped>
.page-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
}

.content-section {
  margin-top: 2rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.col {
  flex: 1;
  min-width: 200px;
}

.data-list {
  margin: 0;
}

.data-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #555;
}

.data-value {
  margin-left: 0;
  font-size: 1.1rem;
  color: #333;
}

dl {
  margin: 1rem 0;
}

dt {
  font-weight: bold;
}

dd {
  margin-left: 0;
  margin-bottom: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {  
  .row {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>