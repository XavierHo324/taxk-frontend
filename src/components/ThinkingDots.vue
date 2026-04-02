<script setup>
defineProps({
  label: {
    type: String,
    default: 'AI is thinking...',
  },
})
</script>

<template>
  <div class="thinking-wrap">
    <div class="dots">
      <span class="dot" />
      <span class="dot" />
      <span class="dot" />
    </div>
    <span class="thinking-label">{{ label }}</span>
  </div>
</template>

<style scoped>
.thinking-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dots {
  display: flex;
  gap: 5px;
  align-items: center;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  animation: bounce 1.2s infinite ease-in-out;
}

.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40%            { transform: translateY(-7px); opacity: 1; }
}

.thinking-label {
  font-size: 13px;
  color: var(--text-muted);
}
</style>
