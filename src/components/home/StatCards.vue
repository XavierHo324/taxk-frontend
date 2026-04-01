<script setup>
import { computed } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { formatCurrency, formatPercent, colorClass } from '@/utils/formatters'

const store = usePortfolioStore()
const s = computed(() => store.summary)
</script>

<template>
  <header class="portfolio-header">
    <!-- Left: brand + total value -->
    <div class="header-left">
      <span class="brand-label">My Portfolio</span>
      <span class="total-value mono-number">{{ formatCurrency(s?.totalValue) }}</span>
    </div>

    <!-- Right: inline metrics -->
    <div class="header-metrics">
      <div class="metric">
        <span class="metric-label">Total P&amp;L</span>
        <span class="metric-val mono-number" :class="colorClass(s?.totalPnl)">
          {{ formatCurrency(s?.totalPnl) }}&nbsp;<em>{{ formatPercent(s?.totalReturnPercent) }}</em>
        </span>
      </div>
      <div class="sep" />
      <div class="metric">
        <span class="metric-label">Today</span>
        <span class="metric-val mono-number" :class="colorClass(s?.todayChange)">
          {{ formatCurrency(s?.todayChange) }}&nbsp;<em>{{ formatPercent(s?.todayChangePercent) }}</em>
        </span>
      </div>
      <div class="sep" />
      <div class="metric">
        <span class="metric-label">Best</span>
        <span class="metric-val mono-number gain" v-if="s?.bestPerformer">
          {{ s.bestPerformer.ticker }}&nbsp;<em>{{ formatPercent(s.bestPerformer.returnPercent) }}</em>
        </span>
        <span class="metric-val neutral" v-else>--</span>
      </div>
      <div class="sep" />
      <div class="metric">
        <span class="metric-label">Worst</span>
        <span class="metric-val mono-number loss" v-if="s?.worstPerformer">
          {{ s.worstPerformer.ticker }}&nbsp;<em>{{ formatPercent(s.worstPerformer.returnPercent) }}</em>
        </span>
        <span class="metric-val neutral" v-else>--</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.portfolio-header {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow-header);
  padding: 0 28px;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 32px;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.brand-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
}

.total-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.3px;
  white-space: nowrap;
}

.header-metrics {
  display: flex;
  align-items: center;
  gap: 0;
  flex: 1;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 0 20px;
}

.sep {
  width: 1px;
  height: 28px;
  background: var(--border);
  flex-shrink: 0;
}

.metric-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  white-space: nowrap;
}

.metric-val {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}

.metric-val em {
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
}

.metric-val.gain { color: var(--gain); }
.metric-val.loss { color: var(--loss); }
.metric-val.neutral { color: var(--text-muted); }
</style>
