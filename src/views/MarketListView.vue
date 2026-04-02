<script setup>
import { ref, computed } from 'vue'
import { fetchAiRecommend } from '@/api/portfolio.js'
import { useAiStore } from '@/stores/ai.js'
import ThinkingDots from '@/components/ThinkingDots.vue'
import { MagicStick, TrendCharts } from '@element-plus/icons-vue'

const store = useAiStore()
const loading = ref(false)

// Always reads from the store — survives route navigation
const result = computed(() => store.recommendation)

async function getRecommendations() {
  loading.value = true
  try {
    store.setRecommendation(await fetchAiRecommend())
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="recommend-view">
    <!-- Page header -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">AI Recommend</h1>
        <p class="page-desc">
          AI analyzes your portfolio and today's market news to suggest stocks worth considering.
        </p>
      </div>
      <el-button
        type="primary"
        size="large"
        :disabled="loading"
        @click="getRecommendations"
      >
        <el-icon class="btn-icon"><MagicStick /></el-icon>
        {{ loading ? 'Analyzing…' : 'Get Recommendations' }}
      </el-button>
    </div>

    <!-- Thinking state -->
    <div v-if="loading" class="thinking-section">
      <ThinkingDots label="AI is analyzing your portfolio and market trends…" />
    </div>

    <!-- Results -->
    <div v-else-if="result" class="results-section">
      <p class="result-meta">{{ result.stocks.length }} stock{{ result.stocks.length !== 1 ? 's' : '' }} recommended</p>
      <div class="cards-grid">
        <div
          v-for="stock in result.stocks"
          :key="stock.ticker"
          class="stock-card"
        >
          <!-- Card top: identity + price -->
          <div class="card-top">
            <div class="identity">
              <span class="ticker">{{ stock.ticker }}</span>
              <span class="company">{{ stock.companyName }}</span>
            </div>
            <div class="price-block">
              <span class="price">${{ stock.currentPrice.toFixed(2) }}</span>
              <span :class="['change-badge', stock.change >= 0 ? 'gain' : 'loss']">
                {{ stock.change >= 0 ? '+' : '' }}{{ stock.changePercent.toFixed(2) }}%
              </span>
            </div>
          </div>

          <!-- Divider -->
          <div class="card-divider" />

          <!-- AI reason -->
          <div class="card-reason">
            <el-icon class="reason-icon"><TrendCharts /></el-icon>
            <p class="reason-text">{{ result.reasons[stock.ticker] }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty / initial state -->
    <div v-else class="empty-state">
      <el-icon class="empty-icon"><MagicStick /></el-icon>
      <p class="empty-title">No recommendations yet</p>
      <p class="empty-sub">Click "Get Recommendations" to let AI analyse your portfolio</p>
    </div>
  </div>
</template>

<style scoped>
.recommend-view {
  display: flex;
  flex-direction: column;
  gap: var(--section-gap);
  padding: 28px;
  max-width: 1200px;
  width: 100%;
}

/* Header */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.page-title {
  font-family: 'Outfit', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px;
}

.page-desc {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

.btn-icon {
  margin-right: 6px;
}

/* Thinking */
.thinking-section {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

/* Results */
.result-meta {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--card-gap);
}

.stock-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--card-radius);
  padding: var(--card-padding);
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: box-shadow var(--transition-fast);
}

.stock-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.identity {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ticker {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: 'Outfit', sans-serif;
  letter-spacing: 0.5px;
}

.company {
  font-size: 12px;
  color: var(--text-muted);
}

.price-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.price {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.change-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
}

.change-badge.gain {
  color: var(--gain);
  background: var(--gain-bg);
}

.change-badge.loss {
  color: var(--loss);
  background: var(--loss-bg);
}

.card-divider {
  height: 1px;
  background: var(--border);
}

.card-reason {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.reason-icon {
  color: var(--accent);
  font-size: 15px;
  flex-shrink: 0;
  margin-top: 2px;
}

.reason-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 80px 0;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 48px;
  color: var(--border-strong);
  margin-bottom: 8px;
}

.empty-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 0;
}

.empty-sub {
  font-size: 14px;
  margin: 0;
}
</style>
