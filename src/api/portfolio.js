import axios from 'axios'
import { ElMessage } from 'element-plus'

const http = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || err.response?.data || err.message
    ElMessage.error(String(msg))
    return Promise.reject(err)
  }
)

export function fetchPortfolio() {
  return http.get('/portfolio').then((r) => r.data)
}

export function fetchPerformance() {
  return http.get('/portfolio/performance').then((r) => r.data)
}

export function fetchTickerHistory(ticker) {
  return http.get(`/portfolio/${ticker}/history`).then((r) => r.data)
}

export function buyStock(payload) {
  return http.post('/portfolio/buy', payload)
}

export function sellStock(payload) {
  return http.post('/portfolio/sell', payload)
}

export function fetchGeneralNews() {
  return http.get('/portfolio/news').then((r) => r.data)
}

export function fetchTickerNews(ticker) {
  return http.get(`/portfolio/${ticker}/news`).then((r) => r.data)
}
