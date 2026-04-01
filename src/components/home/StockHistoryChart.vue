<script setup>
import { ref, onMounted, computed } from 'vue'
import { Line } from 'vue-chartjs'
import { fetchTickerHistory } from '@/api/portfolio'

const props = defineProps({
  ticker: { type: String, required: true },
  averageCost: { type: Number, default: null },
})

const history = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetchTickerHistory(props.ticker)
    history.value = res.history ?? []
  } catch {
    history.value = []
  } finally {
    loading.value = false
  }
})

const chartData = computed(() => {
  const labels = history.value.map((d) => d.date)
  const datasets = [
    {
      label: 'Price',
      data: history.value.map((d) => d.close),
      borderColor: '#2563EB',
      backgroundColor: 'rgba(37, 99, 235, 0.06)',
      fill: true,
      tension: 0.3,
      pointRadius: 0,
      pointHitRadius: 6,
      borderWidth: 2,
    },
  ]

  if (props.averageCost != null) {
    datasets.push({
      label: 'Avg Cost',
      data: labels.map(() => props.averageCost),
      borderColor: '#D97706',
      borderDash: [6, 4],
      borderWidth: 1.5,
      pointRadius: 0,
      fill: false,
    })
  }

  return { labels, datasets }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        maxTicksLimit: 6,
        font: { size: 10, family: "'Inter', sans-serif" },
        color: '#94A3B8',
      },
      border: { color: '#E2E8F0' },
    },
    y: {
      grid: { color: 'rgba(0,0,0,0.04)' },
      ticks: {
        callback: (v) => '$' + v.toFixed(0),
        font: { size: 10, family: "'Inter', sans-serif" },
        color: '#94A3B8',
      },
      border: { dash: [4, 2], color: 'transparent' },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.dataset.label}: $${ctx.parsed.y?.toFixed(2)}`,
      },
    },
  },
}
</script>

<template>
  <div class="stock-history-chart">
    <div v-if="loading" class="chart-loading">
      <el-skeleton :rows="3" animated />
    </div>
    <div v-else-if="history.length === 0" class="chart-empty">No history data available</div>
    <div v-else class="chart-container">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.stock-history-chart {
  width: 100%;
}

.chart-container {
  position: relative;
  height: 200px;
}

.chart-loading,
.chart-empty {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 13px;
}
</style>
