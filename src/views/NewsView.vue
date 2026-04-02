<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { fetchGeneralNews, fetchTickerNews } from '@/api/portfolio'

const store = usePortfolioStore()
const activeTab = ref('market')
const news = ref([])
const loading = ref(false)
const searchInput = ref('')
const searchMode = ref(false)
const searchedTicker = ref('')

const tabs = computed(() => [
  { key: 'market', label: 'All' },
  ...store.holdings.map((h) => ({ key: h.ticker, label: h.ticker })),
])

async function loadNews() {
  loading.value = true
  try {
    news.value = searchMode.value
      ? await fetchTickerNews(searchedTicker.value)
      : activeTab.value === 'market'
        ? await fetchGeneralNews()
        : await fetchTickerNews(activeTab.value)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  const t = searchInput.value.trim().toUpperCase()
  if (!t) return
  searchedTicker.value = t
  searchMode.value = true
  loadNews()
}

function clearSearch() {
  searchMode.value = false
  searchedTicker.value = ''
  searchInput.value = ''
  loadNews()
}

function selectTab(key) {
  clearSearch()
  activeTab.value = key
}

function formatDate(ts) {
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function hideImg(e) {
  e.target.style.display = 'none'
}

onMounted(async () => {
  if (store.holdings.length === 0) await store.loadDashboard()
  loadNews()
})

watch(activeTab, loadNews)
</script>

<template>
  <div class="news-view">
    <!-- Header -->
    <div class="news-header">
      <h1 class="news-title">Market News</h1>
      <div class="search-box">
        <input
          v-model="searchInput"
          class="search-input"
          placeholder="Search ticker…"
          maxlength="10"
          @keydown.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">Search</button>
      </div>
    </div>

    <!-- Tab bar -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ active: !searchMode && activeTab === tab.key }"
        @click="selectTab(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Search result bar -->
    <div v-if="searchMode" class="search-result-bar">
      Results for <strong>{{ searchedTicker }}</strong>
      <button class="clear-btn" @click="clearSearch">×</button>
    </div>

    <!-- News grid -->
    <div v-loading="loading" class="news-body">
      <!-- Empty state -->
      <div v-if="!loading && news.length === 0" class="empty-state">
        <p>No news available.</p>
      </div>

      <div v-else class="news-grid">
        <a
          v-for="item in news"
          :key="item.id"
          class="news-card"
          :href="item.url"
          target="_blank"
          rel="noopener"
        >
          <!-- Image -->
          <div v-if="item.image" class="card-img-wrap">
            <img :src="item.image" :alt="item.headline" class="card-img" @error="hideImg" />
          </div>

          <!-- Body -->
          <div class="card-body">
            <div class="card-meta">
              <span class="badge source-badge">{{ item.source }}</span>
              <span v-if="item.category" class="badge category-badge">{{ item.category }}</span>
              <span class="card-date">{{ formatDate(item.datetime) }}</span>
            </div>
            <p class="card-headline">{{ item.headline }}</p>
            <p class="card-summary">{{ item.summary }}</p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.news-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header */
.news-header {
  padding: 20px 28px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.news-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.search-box {
  display: flex;
  gap: 6px;
}

.search-input {
  height: 32px;
  padding: 0 10px;
  font-size: 13px;
  border: 1px solid var(--border);
  border-radius: var(--card-radius);
  outline: none;
  width: 160px;
  color: var(--text-primary);
  background: var(--bg-surface);
}

.search-input:focus {
  border-color: var(--accent);
}

.search-btn {
  height: 32px;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 500;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--card-radius);
  cursor: pointer;
}

.search-btn:hover {
  background: var(--accent-hover);
}

.search-result-bar {
  padding: 8px 28px;
  font-size: 13px;
  color: var(--text-secondary);
  background: var(--accent-muted);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 6px;
}

.clear-btn {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 16px;
  color: var(--text-muted);
  cursor: pointer;
  line-height: 1;
}

.clear-btn:hover {
  color: var(--text-primary);
}

/* Tab bar */
.tab-bar {
  display: flex;
  gap: 4px;
  padding: 16px 28px 0;
  border-bottom: 1px solid var(--border);
}

.tab-btn {
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color var(--transition-fast), border-color var(--transition-fast);
  margin-bottom: -1px;
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

/* News body */
.news-body {
  padding: 20px 28px 32px;
  min-height: 200px;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: var(--text-muted);
  font-size: 14px;
}

/* Grid */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--card-gap);
}

/* Card */
.news-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-surface);
  border-radius: var(--card-radius);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: box-shadow var(--transition-fast), transform var(--transition-fast);
}

.news-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

/* Image */
.card-img-wrap {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--bg-table-header);
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Body */
.card-body {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.source-badge {
  background: var(--accent-muted);
  color: var(--accent);
}

.category-badge {
  background: var(--bg-table-header);
  color: var(--text-secondary);
}

.card-date {
  font-size: 11px;
  color: var(--text-muted);
  margin-left: auto;
}

.card-headline {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.45;
  margin: 0;
  transition: color var(--transition-fast);
}

.news-card:hover .card-headline {
  color: var(--accent);
}

.card-summary {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
  }

  .news-header,
  .tab-bar,
  .news-body {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
