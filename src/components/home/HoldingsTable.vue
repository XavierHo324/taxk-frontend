<script setup>
import { usePortfolioStore } from '@/stores/portfolio'
import { formatCurrency, formatPercent, colorClass } from '@/utils/formatters'
import HoldingDetail from './HoldingDetail.vue'
import { Plus } from '@element-plus/icons-vue'

const store = usePortfolioStore()

const emit = defineEmits(['buy', 'sell', 'add-position'])

function handleBuy(ticker) {
  emit('buy', ticker)
}

function handleSell(ticker, maxQty) {
  emit('sell', ticker, maxQty)
}
</script>

<template>
  <div class="holdings-section">
    <div class="section-header">
      <div class="section-header-left">
        <h3 class="section-title">Holdings</h3>
        <span v-if="!store.isEmpty" class="holding-count">
          {{ store.holdings.length }} position{{ store.holdings.length !== 1 ? 's' : '' }}
        </span>
      </div>
      <el-button type="primary" size="small" @click="emit('add-position')">
        <el-icon><Plus /></el-icon>
        New Trade
      </el-button>
    </div>

    <div v-if="store.isEmpty" class="empty-holdings">
      <p>No positions yet. Click <strong>New Trade</strong> to add your first holding.</p>
    </div>

    <el-table
      v-else
      :data="store.holdings"
      row-key="ticker"
      style="width: 100%"
    >
      <el-table-column type="expand" width="40">
        <template #default="{ row }">
          <HoldingDetail
            :holding="row"
            @buy="handleBuy"
            @sell="handleSell"
          />
        </template>
      </el-table-column>

      <el-table-column label="Symbol" width="80">
        <template #default="{ row }">
          <span class="stock-ticker">{{ row.ticker }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Company Name" min-width="140">
        <template #default="{ row }">
          <span class="company-name">{{ row.companyName || '--' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Shares" width="80" align="right">
        <template #default="{ row }">
          <span class="mono-number">{{ row.quantity }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Avg Cost" width="105" align="right">
        <template #default="{ row }">
          <span class="mono-number">{{ formatCurrency(row.averageCost) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Current Price" width="115" align="right">
        <template #default="{ row }">
          <span class="mono-number">{{ formatCurrency(row.currentPrice) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Market Value" width="120" align="right">
        <template #default="{ row }">
          <span class="mono-number">{{ formatCurrency(row.marketValue) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="P/L" width="145" align="right">
        <template #default="{ row }">
          <div class="pnl-cell" :class="colorClass(row.pnl)">
            <span class="mono-number">{{ formatCurrency(row.pnl) }}</span>
            <small class="mono-number">{{ formatPercent(row.returnPercent) }}</small>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Day Chg" width="90" align="right">
        <template #default="{ row }">
          <span class="mono-number" :class="colorClass(row.dayChange)">
            {{ formatPercent(row.dayChangePercent) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="" width="110" align="center">
        <template #default="{ row }">
          <div class="row-actions">
            <el-button size="small" type="primary" plain @click.stop="handleBuy(row.ticker)">Buy</el-button>
            <el-button size="small" type="danger" plain @click.stop="handleSell(row.ticker, row.quantity)">Sell</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.holdings-section {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--card-radius);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
}

.section-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.holding-count {
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-table-header);
  border: 1px solid var(--border);
  padding: 2px 8px;
  border-radius: 10px;
}

.stock-ticker {
  font-weight: 700;
  font-size: 13px;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.company-name {
  font-size: 13px;
  color: var(--text-secondary);
}

.pnl-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
}

.pnl-cell small {
  font-size: 11px;
}

.pnl-cell.gain { color: var(--gain); }
.pnl-cell.loss { color: var(--loss); }
.pnl-cell.neutral { color: var(--text-secondary); }

.row-actions {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.empty-holdings {
  text-align: center;
  padding: 48px 0;
  color: var(--text-muted);
  font-size: 14px;
}

.empty-holdings strong {
  color: var(--accent);
}

:deep(.el-table) {
  --el-table-bg-color: var(--bg-surface);
  --el-table-tr-bg-color: var(--bg-surface);
  --el-table-header-bg-color: var(--bg-table-header);
  --el-table-row-hover-bg-color: var(--bg-hover);
  --el-table-border-color: var(--border);
  --el-table-text-color: var(--text-primary);
  --el-table-header-text-color: var(--text-secondary);
  font-size: 13px;
}

:deep(.el-table__expanded-cell) {
  background: var(--bg-expanded) !important;
  padding: 16px 24px !important;
}

:deep(.el-table .el-table__expand-icon) {
  color: var(--text-muted);
}

:deep(.el-table th.el-table__cell) {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
