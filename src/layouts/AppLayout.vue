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
  background: var(--bg-page);
}

.main-content {
  flex: 1;
  overflow-y: auto;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
