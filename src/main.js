import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import {
  Chart as ChartJS,
  DoughnutController,
  LineController,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

import App from './App.vue'
import router from './router'

import '@/assets/styles/variables.css'
import '@/assets/styles/global.css'
import '@/assets/styles/element-overrides.css'

ChartJS.register(DoughnutController, LineController, ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler)

ChartJS.defaults.color = '#64748B'
ChartJS.defaults.borderColor = '#E2E8F0'
ChartJS.defaults.font.family = "'Inter', -apple-system, sans-serif"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
