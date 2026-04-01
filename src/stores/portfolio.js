import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { fetchPortfolio, fetchPerformance, buyStock, sellStock } from '@/api/portfolio'

export const usePortfolioStore = defineStore('portfolio', () => {
  const summary = ref(null)
  const holdings = ref([])
  const performanceSeries = ref([])
  const loading = ref(false)

  const isEmpty = computed(() => holdings.value.length === 0)

  const holdingsByWeight = computed(() =>
    [...holdings.value].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))
  )

  async function loadDashboard() {
    loading.value = true
    try {
      const [portfolio, performance] = await Promise.all([fetchPortfolio(), fetchPerformance()])
      summary.value = portfolio.summary
      holdings.value = portfolio.holdings ?? []
      performanceSeries.value = performance.series ?? []
    } finally {
      loading.value = false
    }
  }

  async function executeBuy(ticker, quantity, note) {
    await buyStock({ ticker, quantity, note })
    await loadDashboard()
  }

  async function executeSell(ticker, quantity, note) {
    await sellStock({ ticker, quantity, note })
    await loadDashboard()
  }

  return { summary, holdings, performanceSeries, loading, isEmpty, holdingsByWeight, loadDashboard, executeBuy, executeSell }
})
