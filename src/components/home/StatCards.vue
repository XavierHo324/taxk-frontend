<script setup>
import { computed } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { formatCurrency, formatPercent, colorClass } from '@/utils/formatters'
import { Plus } from '@element-plus/icons-vue'

const emit = defineEmits(['add-position'])
const store = usePortfolioStore()
const s = computed(() => store.summary)
</script>

<template>
  <section class="stat-cards">
    <div class="stat-card total-value">
      <span class="stat-label">Total Value</span>
      <span class="stat-value">{{ formatCurrency(s?.totalValue) }}</span>
    </div>

    <div class="stat-card">
      <span class="stat-label">Total P&amp;L</span>
      <span class="stat-value" :class="colorClass(s?.totalPnl)">
        {{ formatCurrency(s?.totalPnl) }}
        <small>{{ formatPercent(s?.totalReturnPercent) }}</small>
      </span>
    </div>

    <div class="stat-card">
      <span class="stat-label">Today's Change</span>
      <span class="stat-value" :class="colorClass(s?.todayChange)">
        {{ formatCurrency(s?.todayChange) }}
        <small>{{ formatPercent(s?.todayChangePercent) }}</small>
      </span>
    </div>

    <div class="stat-card">
      <span class="stat-label">Best Performer</span>
      <span class="stat-value gain" v-if="s?.bestPerformer">
        {{ s.bestPerformer.ticker }}
        <small>{{ formatPercent(s.bestPerformer.returnPercent) }}</small>
      </span>
      <span class="stat-value neutral" v-else>--</span>
    </div>

    <div class="stat-card">
      <span class="stat-label">Worst Performer</span>
      <span class="stat-value loss" v-if="s?.worstPerformer">
        {{ s.worstPerformer.ticker }}
        <small>{{ formatPercent(s.worstPerformer.returnPercent) }}</small>
      </span>
      <span class="stat-value neutral" v-else>--</span>
    </div>

    <div class="stat-card action-card" @click="emit('add-position')">
      <el-icon :size="28"><Plus /></el-icon>
      <span class="action-label">Add Position</span>
    </div>
  </section>
</template>

<style scoped>
.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--card-gap);
  margin-bottom: var(--section-gap);
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--card-radius);
  padding: var(--card-padding);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.stat-card:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-card);
}

.stat-card.total-value {
  border-color: var(--accent-muted);
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(14, 165, 233, 0.06) 100%);
}

.stat-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
}

.stat-value {
  font-family: 'Outfit', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.stat-value small {
  font-size: 13px;
  font-weight: 500;
}

.stat-value.gain { color: var(--gain); }
.stat-value.loss { color: var(--loss); }
.stat-value.neutral { color: var(--text-secondary); }

.action-card {
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-style: dashed;
  color: var(--accent);
  transition: background var(--transition-fast), border-color var(--transition-fast);
}

.action-card:hover {
  background: var(--accent-muted);
  border-color: var(--accent);
}

.action-label {
  font-size: 14px;
  font-weight: 600;
}
</style>
