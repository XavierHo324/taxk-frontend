<script setup>
import { onMounted, ref } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'

import StatCards from '@/components/home/StatCards.vue'
import PortfolioDonut from '@/components/home/PortfolioDonut.vue'
import PerformanceChart from '@/components/home/PerformanceChart.vue'
import HoldingsTable from '@/components/home/HoldingsTable.vue'
import BuyDialog from '@/components/trade/BuyDialog.vue'
import SellDialog from '@/components/trade/SellDialog.vue'

const store = usePortfolioStore()

// Dialog state
const buyDialogVisible = ref(false)
const buyInitialTicker = ref('')
const sellDialogVisible = ref(false)
const sellTicker = ref('')
const sellMaxQty = ref(0)

onMounted(() => {
  store.loadDashboard()
})

function openBuyDialog(ticker = '') {
  buyInitialTicker.value = ticker
  buyDialogVisible.value = true
}

function openSellDialog(ticker, maxQty) {
  sellTicker.value = ticker
  sellMaxQty.value = maxQty
  sellDialogVisible.value = true
}
</script>

<template>
  <div v-loading="store.loading" class="home-view">
    <!-- Header: Stat Cards -->
    <StatCards @add-position="openBuyDialog()" />

    <!-- Charts Row -->
    <div class="charts-row">
      <PortfolioDonut />
      <PerformanceChart />
    </div>

    <!-- Holdings Table -->
    <HoldingsTable
      @buy="openBuyDialog"
      @sell="openSellDialog"
    />

    <!-- Trade Dialogs -->
    <BuyDialog
      v-model="buyDialogVisible"
      :initial-ticker="buyInitialTicker"
      @success="store.loadDashboard()"
    />
    <SellDialog
      v-model="sellDialogVisible"
      :ticker="sellTicker"
      :max-quantity="sellMaxQty"
      @success="store.loadDashboard()"
    />
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: var(--section-gap);
  max-width: 1400px;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--card-gap);
}

@media (max-width: 1024px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
}
</style>
