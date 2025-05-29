<template>
  <div class="app-container" :key="routerKey">
    <AppHeader
      ref="focusTarget"
      class="app-header"
      :router-key="routerKey"
    />
    <div class="page-container-overview">
      <main class="content-container">
        <Overview />
      </main>
    </div>
    <div class="page-container">
      <main class="content-container">
        <RouterView ref="routerView" />
      </main>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import $bus from '../eventBus'
  import AppHeader from '@/components/AppHeader'
  import Overview from '../views/Info.vue'

  defineOptions({
      name: 'App'
  })

  const routerKey = ref(0)
  const focusTarget = ref(null)
  const route = useRoute()

  let refreshInterval = null

  const setFocus = (el) => {
    if (el?.focus) el.focus()
  }

  const refresh = () => {
    routerKey.value += 1
  }

  watch(route, async () => {
    await nextTick()
    if (focusTarget.value) {
      setFocus(focusTarget.value.$el || focusTarget.value)
    }
  }, { flush: 'post' })

  onMounted(() => {
    $bus.on('refresh-application', refresh());

    refreshInterval = setInterval(() => {
      if (!localStorage.getItem('storedUsername')) {
        refresh()
      }
    }, 10000)
  })

  onUnmounted(() => {
    clearInterval(refreshInterval)
  })
</script>

<style scoped>
.app-container {
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 70px 1fr;
  grid-template-areas:
    'header'
    'sidebar'
    'content';
}

.app-header {
  grid-area: header;
  position: sticky;
  top: 0;
}

.page-container {
  grid-area: content;
  display: flex;
  justify-content: left;
  align-items: flex-start;
  min-height: 50vh;
  min-width: 70vh;
  padding: 20px;
  margin: 20px;
}

.page-container-overview {
  grid-area: sidebar;
  display: flex;
  justify-content: left;
  align-items: flex-start;
  min-height: 50vh;
  min-width: 100%;
  padding: 20px;
  margin: 20px;
}

.content-container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  min-width: 100%;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
p {
  font-size: 1rem;
  margin-bottom: 2rem;
  color: #333;
}


@media (min-width: 1500px) { 
  .content-container{
    min-height: 100%;
  } 

  .app-container {
    grid-template-columns: 550px 1fr;
    grid-template-areas:
      'header header'
      'sidebar content'
  }
}

</style>
