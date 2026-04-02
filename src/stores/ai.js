import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAiStore = defineStore('ai', () => {
  // Chat page: persistent message history
  const chatMessages = ref([])

  function addChatMessage(msg) {
    chatMessages.value.push(msg)
  }

  // Recommend page: last recommendation result (null = never fetched)
  const recommendation = ref(null)

  function setRecommendation(data) {
    recommendation.value = data
  }

  return { chatMessages, addChatMessage, recommendation, setRecommendation }
})
