<script setup>
import AppSidebar from '@/components/sidebar/AppSidebar.vue'
</script>

<template>
  <div class="app-layout">
    <AppSidebar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-base);
}

.main-content {
  flex: 1;
  padding: var(--section-gap);
  overflow-y: auto;
  max-height: 100vh;
}
</style>
