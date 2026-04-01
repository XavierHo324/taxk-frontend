<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { usePortfolioStore } from '@/stores/portfolio'

const store = usePortfolioStore()

const palette = [
  '#0ea5e9', '#8b5cf6', '#f59e0b', '#22c55e', '#ef4444',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
]

const chartData = computed(() => {
  const series = store.performanceSeries
  if (!series || series.length === 0) {
    return { labels: [], datasets: [] }
  }

  // Collect all unique dates across all tickers
  const dateSet = new Set()
  series.forEach((s) => s.data.forEach((d) => dateSet.add(d.date)))
  const labels = [...dateSet].sort()

  const datasets = series.map((s, i) => {
    const dataMap = new Map(s.data.map((d) => [d.date, d.returnPercent]))
    return {
      label: s.ticker,
      data: labels.map((date) => dataMap.get(date) ?? null),
      borderColor: palette[i % palette.length],
      backgroundColor: palette[i % palette.length] + '18',
      fill: false,
      tension: 0.35,
      pointRadius: 0,
      pointHitRadius: 8,
      borderWidth: 2,
    }
  })

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
        maxTicksLimit: 8,
        font: { size: 11 },
      },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: {
        callback: (v) => v.toFixed(1) + '%',
        font: { size: 11 },
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        padding: 16,
        usePointStyle: true,
        pointStyle: 'circle',
        font: { size: 12, family: "'DM Sans', sans-serif" },
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y?.toFixed(2)}%`,
      },
    },
  },
}
</script>

<template>
  <div class="chart-card performance-card">
    <h3 class="chart-title">Performance</h3>
    <div v-if="!store.performanceSeries?.length" class="empty-state">No data available</div>
    <div v-else class="chart-wrap">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.chart-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--card-radius);
  padding: var(--card-padding);
  transition: border-color var(--transition-fast);
}

.chart-card:hover {
  border-color: var(--border-hover);
}

.chart-title {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.chart-wrap {
  position: relative;
  height: 260px;
}

.empty-state {
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 14px;
}
</style>
