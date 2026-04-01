<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { usePortfolioStore } from '@/stores/portfolio'
import { formatCurrency } from '@/utils/formatters'

const store = usePortfolioStore()

const palette = [
  '#0ea5e9', '#8b5cf6', '#f59e0b', '#22c55e', '#ef4444',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
]

const chartData = computed(() => {
  const h = store.holdingsByWeight
  return {
    labels: h.map((x) => x.ticker),
    datasets: [
      {
        data: h.map((x) => x.marketValue ?? 0),
        backgroundColor: h.map((_, i) => palette[i % palette.length]),
        borderColor: 'transparent',
        hoverOffset: 6,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: {
      position: 'right',
      labels: {
        padding: 16,
        usePointStyle: true,
        pointStyle: 'circle',
        font: { size: 12, family: "'DM Sans', sans-serif" },
      },
    },
    tooltip: {
      callbacks: {
        label(ctx) {
          const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
          const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0
          return ` ${ctx.label}: ${formatCurrency(ctx.parsed)} (${pct}%)`
        },
      },
    },
  },
}
</script>

<template>
  <div class="chart-card donut-card">
    <h3 class="chart-title">Allocation</h3>
    <div v-if="store.isEmpty" class="empty-state">No holdings yet</div>
    <div v-else class="chart-wrap">
      <Doughnut :data="chartData" :options="chartOptions" />
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
