<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { usePortfolioStore } from '@/stores/portfolio'
import { formatCurrency } from '@/utils/formatters'

const store = usePortfolioStore()

const palette = [
  '#2563EB', '#059669', '#D97706', '#7C3AED',
  '#DB2777', '#0891B2', '#DC2626', '#0D9488',
  '#4F46E5', '#65A30D',
]

const chartData = computed(() => {
  const h = store.holdingsByWeight
  return {
    labels: h.map((x) => x.ticker),
    datasets: [
      {
        data: h.map((x) => x.marketValue ?? 0),
        backgroundColor: h.map((_, i) => palette[i % palette.length]),
        borderColor: '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: {
      position: 'right',
      labels: {
        padding: 14,
        usePointStyle: true,
        pointStyle: 'circle',
        font: { size: 12, family: "'Inter', sans-serif" },
        color: '#475569',
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
  <div class="chart-card">
    <div class="chart-header">
      <h3 class="chart-title">Allocation</h3>
    </div>
    <div v-if="store.isEmpty" class="empty-state">No holdings yet</div>
    <div v-else class="chart-wrap">
      <Doughnut :data="chartData" :options="chartOptions" />
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
