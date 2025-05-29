<template>
  <div class="page-container">
    <h1 class="page-title">Page is not found!</h1>
  </div>
</template>

<script setup>
  defineOptions({
      name: 'PageNotFound'
  })

  onMounted(() => {
    document.title = 'ERROR!';
  })
</script>

<style scoped>
.page-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  color: #333;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
}
</style>