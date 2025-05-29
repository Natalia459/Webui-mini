<template>
    <div id = "app">
        <RouterView />
    </div>
</template>

<script setup>
  import { computed, watch, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useStore } from 'vuex';

  defineOptions({
      name: 'App'
  })

  const route = useRoute();
  const store = useStore();

  const assetTag = computed(() => {
    return store.getters['global/assetTag'];
  });

  watch(assetTag, (newTag) => {
    if (newTag) {
      document.title = `${newTag} - ${route.meta.title}`;
    }
  });

  watch(route, (to) => {
    updateTitle(to);
  });

  onMounted(() => {
    document.title = '';
  });

  function updateTitle(route) {
    const baseTitle = route.meta.title || 'Page is missing title';
    document.title = assetTag.value ? `${assetTag.value} - ${baseTitle}` : baseTitle;
  }
</script>
