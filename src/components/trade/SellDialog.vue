<script setup>
import { ref, watch } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  ticker: { type: String, default: '' },
  maxQuantity: { type: Number, default: 0 },
})

const emit = defineEmits(['update:modelValue', 'success'])
const store = usePortfolioStore()

const quantity = ref(1)
const note = ref('')
const submitting = ref(false)

watch(() => props.modelValue, (open) => {
  if (open) {
    quantity.value = 1
    note.value = ''
  }
})

async function handleSubmit() {
  if (quantity.value < 1) {
    ElMessage.warning('Quantity must be at least 1')
    return
  }
  if (quantity.value > props.maxQuantity) {
    ElMessage.warning(`You only have ${props.maxQuantity} share(s)`)
    return
  }

  submitting.value = true
  try {
    await store.executeSell(props.ticker, quantity.value, note.value || null)
    ElMessage.success(`Sold ${quantity.value} share(s) of ${props.ticker}`)
    emit('success')
    emit('update:modelValue', false)
  } catch {
    // Error handled by API interceptor
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
    title="Sell Stock"
    width="440px"
    :close-on-click-modal="false"
    @update:model-value="handleClose"
  >
    <el-form label-position="top" @submit.prevent="handleSubmit">
      <el-form-item label="Ticker">
        <el-input :model-value="ticker" disabled />
      </el-form-item>

      <el-form-item label="Quantity">
        <el-input-number
          v-model="quantity"
          :min="1"
          :max="maxQuantity"
          :step="1"
          controls-position="right"
          style="width: 100%"
        />
        <div class="max-hint">Available: {{ maxQuantity }} shares</div>
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
      <el-button @click="handleClose">Cancel</el-button>
      <el-button type="danger" :loading="submitting" @click="handleSubmit">
        Confirm Sell
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.max-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
}
</style>
