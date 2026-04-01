<script setup>
import { ref, watch } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  initialTicker: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'success'])
const store = usePortfolioStore()

const ticker = ref('')
const quantity = ref(1)
const note = ref('')
const submitting = ref(false)

watch(() => props.modelValue, (open) => {
  if (open) {
    ticker.value = props.initialTicker?.toUpperCase() || ''
    quantity.value = 1
    note.value = ''
  }
})

const isTickerLocked = ref(false)
watch(() => props.initialTicker, (v) => {
  isTickerLocked.value = !!v
})

async function handleSubmit() {
  const t = ticker.value.trim().toUpperCase()
  if (!t) {
    ElMessage.warning('Please enter a ticker symbol')
    return
  }
  if (quantity.value < 1) {
    ElMessage.warning('Quantity must be at least 1')
    return
  }

  submitting.value = true
  try {
    await store.executeBuy(t, quantity.value, note.value || null)
    ElMessage.success(`Bought ${quantity.value} share(s) of ${t}`)
    emit('success')
    emit('update:modelValue', false)
  } catch {
    // Error already handled by interceptor
  } finally {
    submitting.value = false
  }
}

function handleClose() {
  emit('update:modelValue', false)
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    title="Buy Stock"
    width="440px"
    :close-on-click-modal="false"
    @update:model-value="handleClose"
    class="trade-dialog"
  >
    <el-form label-position="top" @submit.prevent="handleSubmit">
      <el-form-item label="Ticker Symbol">
        <el-input
          v-model="ticker"
          :disabled="!!initialTicker"
          placeholder="e.g. AAPL"
          maxlength="5"
          show-word-limit
          @input="ticker = ticker.toUpperCase()"
        />
      </el-form-item>

      <el-form-item label="Quantity">
        <el-input-number
          v-model="quantity"
          :min="1"
          :step="1"
          controls-position="right"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="Note (optional)">
        <el-input
          v-model="note"
          type="textarea"
          :rows="2"
          placeholder="Add a note..."
          maxlength="200"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose" round>Cancel</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit" round>
        Confirm Buy
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.trade-dialog :deep(.el-dialog) {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
}

.trade-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid var(--border);
  padding-bottom: 16px;
}

.trade-dialog :deep(.el-dialog__title) {
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  color: var(--text-primary);
}

.trade-dialog :deep(.el-dialog__footer) {
  border-top: 1px solid var(--border);
  padding-top: 16px;
}
</style>
