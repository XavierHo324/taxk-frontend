<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { HomeFilled, DataLine, Document, ChatDotRound } from '@element-plus/icons-vue'

const route = useRoute()
const activePath = computed(() => route.path)

const navItems = [
  { path: '/home', label: 'Home', icon: HomeFilled },
  { path: '/market', label: 'Market List', icon: DataLine },
  { path: '/news', label: 'News', icon: Document },
  { path: '/ai-chat', label: 'AI Chat', icon: ChatDotRound },
]
</script>

<template>
  <aside class="sidebar">
    <div class="brand">TAXK</div>
    <nav class="sidebar-nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: activePath === item.path }"
      >
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  min-height: 100vh;
  background: var(--bg-sidebar);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.brand {
  padding: 24px 20px 28px;
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: 3px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 6px;
  color: #94A3B8;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: background var(--transition-fast), color var(--transition-fast);
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #CBD5E1;
}

.nav-item.active {
  background: rgba(37, 99, 235, 0.15);
  color: #93C5FD;
  border-left-color: var(--accent);
}

.nav-item .el-icon {
  font-size: 16px;
  flex-shrink: 0;
}
</style>
