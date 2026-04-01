import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/market',
      name: 'MarketList',
      component: () => import('@/views/MarketListView.vue'),
    },
    {
      path: '/news',
      name: 'News',
      component: () => import('@/views/NewsView.vue'),
    },
    {
      path: '/ai-chat',
      name: 'AiChat',
      component: () => import('@/views/AiChatView.vue'),
    },
  ],
})

export default router
