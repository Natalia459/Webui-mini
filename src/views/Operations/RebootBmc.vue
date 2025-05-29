<template>
  <div>
    <h1 >Reboot BMC</h1>
    <div class="row">
      <div class="col">
          <div class="row">
            <div class="col">
              <dl>
                <h3>
                  Last time:
                </h3>
                <dd v-if="lastBmcRebootTime">
                  {{ $filters.formatDate(lastBmcRebootTime) }}
                  {{ $filters.formatTime(lastBmcRebootTime) }}
                </dd>
                <dd v-else>--</dd>
                <h4>
                  When you reboot the BMC, your web browser loses contact with the BMC for several minutes. When the BMC is back online, you may need to log in again.
                </h4>
              </dl>
            </div>
          </div>
          <button
            class="reboot-button"
            @click="onClick"
          >
          Reboot
          </button>
        <slot />
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
      name: 'RebootBmc'
  })

  const store = useStore()
  const router = useRouter()
  const instance = getCurrentInstance()

  const loading = ref(false)

  const lastBmcRebootTime = computed(() => store.getters['controls/lastBmcRebootTime'])

  const hideLoader = () => {
    instance.emit('loader-end')
  }

  const endLoader = () => {
    loading.value = false
    hideLoader()
  }


  const rebootBmc = () => {
    store.dispatch('controls/rebootBmc')
  }

  const onClick = () => {
    const confirmed = confirm('pageRebootBmc.modal.confirmMessage')
    if (confirmed) rebootBmc()
  }

  router.beforeEach((to, from, next) => {
    hideLoader()
    next()
  })

  onMounted(() => {
    document.title = 'Reboot BMC'
    instance.emit('loader-start')
    loading.value = true
    store.dispatch('controls/getLastBmcRebootTime')
      .finally(endLoader)
  })
</script>

<style scoped>
h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -0.5rem;
}

.col {
  flex: 1 0 0%;
  padding: 0 0.5rem;
}

@media (min-width: 768px) {
  .col-md-8 {
    flex: 0 0 66.666667%;
    max-width: 66.666667%;
  }
}

@media (min-width: 992px) {
  .col-lg-8 {
    flex: 0 0 66.666667%;
    max-width: 66.666667%;
  }
}

@media (min-width: 1200px) {
  .col-xl-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
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
</style>