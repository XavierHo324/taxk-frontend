<script setup>
import StockHistoryChart from './StockHistoryChart.vue'
import { formatCurrency, formatPercent, colorClass } from '@/utils/formatters'

const props = defineProps({
  holding: { type: Object, required: true },
})

const emit = defineEmits(['buy', 'sell'])
</script>

<template>
  <div class="holding-detail">
    <!-- Left: Chart -->
    <div class="detail-chart">
      <StockHistoryChart :ticker="holding.ticker" :average-cost="holding.averageCost" />
    </div>

    <!-- Center: Stats grid -->
    <div class="detail-stats">
      <div class="detail-stat">
        <span class="detail-label">Company</span>
        <span class="detail-value">{{ holding.companyName || holding.ticker }}</span>
      </div>
      <div class="detail-stat">
        <span class="detail-label">Cost Basis</span>
        <span class="detail-value">{{ formatCurrency(holding.costBasis) }}</span>
      </div>
      <div class="detail-stat">
        <span class="detail-label">Avg Cost</span>
        <span class="detail-value">{{ formatCurrency(holding.averageCost) }}</span>
      </div>
      <div class="detail-stat">
        <span class="detail-label">First Buy</span>
        <span class="detail-value">{{ holding.firstBuyDate || '--' }}</span>
      </div>
      <div class="detail-stat">
        <span class="detail-label">Return</span>
        <span class="detail-value" :class="colorClass(holding.returnPercent)">
          {{ formatPercent(holding.returnPercent) }}
        </span>
      </div>
      <div class="detail-stat">
        <span class="detail-label">Weight</span>
        <span class="detail-value">{{ holding.weight != null ? holding.weight.toFixed(1) + '%' : '--' }}</span>
      </div>
    </div>

    <!-- Right: Actions -->
    <div class="detail-actions">
      <el-button type="primary" @click="emit('buy', holding.ticker)" round>
        Buy More
      </el-button>
      <el-button type="danger" plain @click="emit('sell', holding.ticker, holding.quantity)" round>
        Sell
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.holding-detail {
  display: grid;
  grid-template-columns: 1.2fr 1fr auto;
  gap: 24px;
  padding: 16px 8px;
  align-items: start;
}

.detail-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 20px;
}

.detail-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--text-muted);
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.detail-value.gain { color: var(--gain); }
.detail-value.loss { color: var(--loss); }

.detail-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 8px;
}

@media (max-width: 900px) {
  .holding-detail {
    grid-template-columns: 1fr;
  }
}
</style>
