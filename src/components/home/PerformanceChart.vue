<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { usePortfolioStore } from '@/stores/portfolio'

const store = usePortfolioStore()

const palette = [
  '#2563EB', '#059669', '#D97706', '#7C3AED',
  '#DB2777', '#0891B2', '#DC2626', '#0D9488',
  '#4F46E5', '#65A30D',
]

const chartData = computed(() => {
  const series = store.performanceSeries
  if (!series || series.length === 0) {
    return { labels: [], datasets: [] }
  }

  const dateSet = new Set()
  series.forEach((s) => s.data.forEach((d) => dateSet.add(d.date)))
  const labels = [...dateSet].sort()

  const datasets = series.map((s, i) => {
    const dataMap = new Map(s.data.map((d) => [d.date, d.returnPercent]))
    return {
      label: s.ticker,
      data: labels.map((date) => dataMap.get(date) ?? null),
      borderColor: palette[i % palette.length],
      backgroundColor: palette[i % palette.length] + '12',
      fill: false,
      tension: 0.3,
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
        font: { size: 11, family: "'Inter', sans-serif" },
        color: '#94A3B8',
      },
      border: { color: '#E2E8F0' },
    },
    y: {
      grid: { color: 'rgba(0,0,0,0.04)' },
      ticks: {
        callback: (v) => v.toFixed(1) + '%',
        font: { size: 11, family: "'Inter', sans-serif" },
        color: '#94A3B8',
      },
      border: { dash: [4, 2], color: 'transparent' },
    },
  },
  plugins: {
    legend: {
      labels: {
        padding: 16,
        usePointStyle: true,
        pointStyle: 'circle',
        font: { size: 12, family: "'Inter', sans-serif" },
        color: '#475569',
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
  <div class="chart-card">
    <div class="chart-header">
      <h3 class="chart-title">Performance</h3>
    </div>
    <div v-if="!store.performanceSeries?.length" class="empty-state">No performance data</div>
    <div v-else class="chart-wrap">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.chart-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--card-radius);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.chart-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-wrap {
  position: relative;
  height: 260px;
  padding: 16px;
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
