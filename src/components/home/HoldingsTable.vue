<script setup>
import { usePortfolioStore } from '@/stores/portfolio'
import { formatCurrency, formatPercent, colorClass } from '@/utils/formatters'
import HoldingDetail from './HoldingDetail.vue'

const store = usePortfolioStore()

const emit = defineEmits(['buy', 'sell'])

function handleBuy(ticker) {
  emit('buy', ticker)
}

function handleSell(ticker, maxQty) {
  emit('sell', ticker, maxQty)
}
</script>

<template>
  <div class="holdings-section">
    <h3 class="section-title">Holdings</h3>

    <div v-if="store.isEmpty" class="empty-holdings">
      <p>You don't have any holdings yet.</p>
      <p>Click <strong>"Add Position"</strong> above to get started.</p>
    </div>

    <el-table
      v-else
      :data="store.holdings"
      row-key="ticker"
      stripe
      class="holdings-table"
      :header-cell-style="{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: 'none' }"
      :cell-style="{ background: 'transparent', border: 'none' }"
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <HoldingDetail
            :holding="row"
            @buy="handleBuy"
            @sell="handleSell"
          />
        </template>
      </el-table-column>

      <el-table-column label="Stock" min-width="130">
        <template #default="{ row }">
          <div class="stock-cell">
            <span class="stock-ticker">{{ row.ticker }}</span>
            <span class="stock-name">{{ row.companyName }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Quantity" prop="quantity" width="100" align="right" />

      <el-table-column label="Avg Cost" width="110" align="right">
        <template #default="{ row }">
          {{ formatCurrency(row.averageCost) }}
        </template>
      </el-table-column>

      <el-table-column label="Price" width="110" align="right">
        <template #default="{ row }">
          {{ formatCurrency(row.currentPrice) }}
        </template>
      </el-table-column>

      <el-table-column label="Market Value" width="130" align="right">
        <template #default="{ row }">
          {{ formatCurrency(row.marketValue) }}
        </template>
      </el-table-column>

      <el-table-column label="P&L" width="140" align="right">
        <template #default="{ row }">
          <span :class="colorClass(row.pnl)">
            {{ formatCurrency(row.pnl) }}
            <small>({{ formatPercent(row.returnPercent) }})</small>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="Day Change" width="130" align="right">
        <template #default="{ row }">
          <span :class="colorClass(row.dayChange)">
            {{ formatPercent(row.dayChangePercent) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="" width="140" align="center">
        <template #default="{ row }">
          <div class="row-actions">
            <el-button size="small" type="primary" text @click.stop="handleBuy(row.ticker)">Buy</el-button>
            <el-button size="small" type="danger" text @click.stop="handleSell(row.ticker, row.quantity)">Sell</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.holdings-section {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--card-radius);
  padding: var(--card-padding);
  transition: border-color var(--transition-fast);
}

.holdings-section:hover {
  border-color: var(--border-hover);
}

.section-title {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.stock-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stock-ticker {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
}

.stock-name {
  font-size: 12px;
  color: var(--text-muted);
}

.gain { color: var(--gain); }
.loss { color: var(--loss); }
.neutral { color: var(--text-secondary); }

small {
  font-size: 11px;
}

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
  line-height: 1.8;
}

.empty-holdings strong {
  color: var(--accent);
}

/* Override Element Plus table styles for dark theme */
:deep(.el-table) {
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: var(--bg-elevated);
  --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.03);
  --el-table-border-color: var(--border);
  --el-table-text-color: var(--text-primary);
  --el-table-header-text-color: var(--text-secondary);
}

:deep(.el-table__expanded-cell) {
  background: var(--bg-elevated) !important;
  padding: 16px 24px !important;
}

:deep(.el-table .el-table__expand-icon) {
  color: var(--text-muted);
}

:deep(.el-table td.el-table__cell),
:deep(.el-table th.el-table__cell) {
  border-bottom: 1px solid var(--border) !important;
}
</style>
