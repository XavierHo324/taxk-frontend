<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { chatWithAi } from '@/api/portfolio.js'
import { useAiStore } from '@/stores/ai.js'
import ThinkingDots from '@/components/ThinkingDots.vue'
import { Position } from '@element-plus/icons-vue'
import { marked } from 'marked'

marked.use({ gfm: true, breaks: true })

const store = useAiStore()

// messages lives in the store — survives route navigation
const messages = store.chatMessages

const inputText = ref('')
const thinking = ref(false)
const messagesRef = ref(null)

// Scroll to bottom when returning to the page with existing history
onMounted(async () => {
  if (messages.length > 0) await scrollToBottom()
})

async function send() {
  const text = inputText.value.trim()
  if (!text || thinking.value) return

  store.addChatMessage({ role: 'user', text })
  inputText.value = ''
  thinking.value = true
  await scrollToBottom()

  try {
    const data = await chatWithAi(text)
    store.addChatMessage({ role: 'ai', text: data.response })
  } catch {
    store.addChatMessage({ role: 'ai', text: 'Sorry, something went wrong. Please try again.' })
  } finally {
    thinking.value = false
    await scrollToBottom()
  }
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

async function scrollToBottom() {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

function renderMd(text) {
  return marked.parse(text)
}
</script>

<template>
  <div class="chat-view">
    <!-- Header -->
    <div class="chat-header">
      <h1 class="chat-title">AI Chat</h1>
      <p class="chat-desc">Ask about your portfolio, request analysis, or get investment ideas.</p>
    </div>

    <!-- Messages area -->
    <div ref="messagesRef" class="messages-area">
      <!-- Welcome message -->
      <div v-if="messages.length === 0 && !thinking" class="welcome">
        <p class="welcome-title">How can I help you today?</p>
        <p class="welcome-sub">I can analyse your holdings, explain performance, or suggest ideas — anything finance-related.</p>
        <div class="suggestions">
          <button class="suggestion-chip" @click="inputText = 'Please analyse my portfolio and give me suggestions'">
            Analyse my portfolio
          </button>
          <button class="suggestion-chip" @click="inputText = 'Which of my stocks should I consider selling?'">
            Which stocks to sell?
          </button>
          <button class="suggestion-chip" @click="inputText = 'What is the historical trend of my best performing stock?'">
            Historical trend
          </button>
        </div>
      </div>

      <!-- Message list -->
      <template v-for="(msg, i) in messages" :key="i">
        <!-- User bubble -->
        <div v-if="msg.role === 'user'" class="msg-row user-row">
          <div class="bubble user-bubble">{{ msg.text }}</div>
        </div>

        <!-- AI bubble with markdown -->
        <div v-else class="msg-row ai-row">
          <div class="ai-avatar">AI</div>
          <div class="bubble ai-bubble">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="md-content" v-html="renderMd(msg.text)" />
          </div>
        </div>
      </template>

      <!-- Thinking indicator -->
      <div v-if="thinking" class="msg-row ai-row">
        <div class="ai-avatar">AI</div>
        <div class="bubble ai-bubble thinking-bubble">
          <ThinkingDots label="" />
        </div>
      </div>
    </div>

    <!-- Input area -->
    <div class="input-area">
      <el-input
        v-model="inputText"
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 4 }"
        placeholder="Ask me anything about your portfolio… (Enter to send, Shift+Enter for new line)"
        resize="none"
        class="chat-input"
        @keydown="handleKeydown"
      />
      <el-button
        type="primary"
        class="send-btn"
        :disabled="!inputText.trim() || thinking"
        @click="send"
      >
        <el-icon><Position /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.chat-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

/* Header */
.chat-header {
  flex-shrink: 0;
  padding: 20px 28px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-surface);
}

.chat-title {
  font-family: 'Outfit', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 2px;
}

.chat-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

/* Messages */
.messages-area {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Welcome */
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: auto;
  text-align: center;
  max-width: 480px;
}

.welcome-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0;
}

.welcome-sub {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.6;
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 8px;
}

.suggestion-chip {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--border-strong);
  background: var(--bg-surface);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: background var(--transition-fast), border-color var(--transition-fast);
}

.suggestion-chip:hover {
  background: var(--accent-muted);
  border-color: var(--accent);
  color: var(--accent);
}

/* Message rows */
.msg-row {
  display: flex;
  gap: 10px;
  max-width: 820px;
}

.user-row {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.ai-row {
  align-self: flex-start;
}

/* Bubbles */
.bubble {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  max-width: 680px;
}

.user-bubble {
  background: var(--accent);
  color: #ffffff;
  border-bottom-right-radius: 4px;
  white-space: pre-wrap;
}

.ai-bubble {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-bottom-left-radius: 4px;
  box-shadow: var(--shadow-card);
}

.thinking-bubble {
  padding: 14px 18px;
}

/* AI avatar */
.ai-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Markdown content inside AI bubble */
.md-content :deep(h1),
.md-content :deep(h2),
.md-content :deep(h3) {
  font-family: 'Outfit', sans-serif;
  color: var(--text-primary);
  margin: 12px 0 6px;
  font-weight: 600;
  line-height: 1.3;
}

.md-content :deep(h1) { font-size: 17px; }
.md-content :deep(h2) { font-size: 15px; }
.md-content :deep(h3) { font-size: 14px; }

.md-content :deep(p) {
  margin: 6px 0;
}

.md-content :deep(ul),
.md-content :deep(ol) {
  padding-left: 20px;
  margin: 6px 0;
}

.md-content :deep(li) {
  margin: 3px 0;
}

.md-content :deep(strong) {
  font-weight: 600;
  color: var(--text-primary);
}

.md-content :deep(code) {
  background: var(--bg-expanded);
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
  font-family: monospace;
}

.md-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 10px 0;
}

.md-content :deep(*:first-child) { margin-top: 0; }
.md-content :deep(*:last-child)  { margin-bottom: 0; }

/* Input area */
.input-area {
  flex-shrink: 0;
  display: flex;
  gap: 10px;
  align-items: flex-end;
  padding: 16px 28px 20px;
  border-top: 1px solid var(--border);
  background: var(--bg-surface);
}

.chat-input {
  flex: 1;
}

.chat-input :deep(.el-textarea__inner) {
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  padding: 10px 14px;
}

.send-btn {
  height: 40px;
  width: 40px;
  padding: 0;
  border-radius: 8px;
  flex-shrink: 0;
  font-size: 16px;
}
</style>
