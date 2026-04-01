<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { HomeFilled, DataLine, Document, ChatDotRound } from '@element-plus/icons-vue'

const route = useRoute()
const activePath = computed(() => route.path)
</script>

<template>
  <aside class="sidebar">
    <div class="brand">TAXK</div>
    <el-menu :default-active="activePath" router class="sidebar-menu">
      <el-menu-item index="/home">
        <el-icon><HomeFilled /></el-icon>
        <span>Home</span>
      </el-menu-item>
      <el-menu-item index="/market">
        <el-icon><DataLine /></el-icon>
        <span>Market List</span>
      </el-menu-item>
      <el-menu-item index="/news">
        <el-icon><Document /></el-icon>
        <span>News</span>
      </el-menu-item>
      <el-menu-item index="/ai-chat">
        <el-icon><ChatDotRound /></el-icon>
        <span>AI Chat</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  min-height: 100vh;
  background: var(--bg-deep);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.brand {
  padding: 24px 20px 32px;
  font-family: 'Outfit', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 2px;
}

.sidebar-menu {
  border-right: none;
  background: transparent;
}
</style>
