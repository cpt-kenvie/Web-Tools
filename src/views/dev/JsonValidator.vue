<template>
  <div class="json-validator">
    <h2 class="page-title">JSON 校验与解析</h2>
    <div class="validator-container">
      <div class="input-section">
        <textarea
          v-model="inputJson"
          placeholder="请输入需要校验的 JSON"
          class="json-input"
        ></textarea>
      </div>
      <div class="button-group">
        <button @click="validateJson" class="action-button">校验</button>
        <button @click="clearInput" class="action-button secondary">清空</button>
      </div>
      <div class="validation-result" :class="{ 'is-valid': isValid, 'is-invalid': !isValid && result }">
        {{ result }}
      </div>
      <div v-if="isValid" class="json-analysis">
        <h3>JSON 分析结果：</h3>
        <div class="analysis-item">
          <span class="label">类型：</span>
          <span>{{ jsonType }}</span>
        </div>
        <div class="analysis-item">
          <span class="label">长度/大小：</span>
          <span>{{ jsonSize }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputJson = ref('')
const result = ref('')
const isValid = ref(false)
const jsonType = ref('')
const jsonSize = ref('')

const validateJson = () => {
  try {
    const parsed = JSON.parse(inputJson.value)
    isValid.value = true
    result.value = '√ JSON 格式有效'
    
    // 分析 JSON
    jsonType.value = Array.isArray(parsed) ? '数组' : typeof parsed
    if (Array.isArray(parsed)) {
      jsonSize.value = `${parsed.length} 个元素`
    } else if (typeof parsed === 'object') {
      jsonSize.value = `${Object.keys(parsed).length} 个属性`
    } else {
      jsonSize.value = `${inputJson.value.length} 个字符`
    }
  } catch (error) {
    isValid.value = false
    result.value = `× 无效的 JSON: ${error.message}`
    jsonType.value = ''
    jsonSize.value = ''
  }
}

const clearInput = () => {
  inputJson.value = ''
  result.value = ''
  isValid.value = false
  jsonType.value = ''
  jsonSize.value = ''
}
</script>

<style scoped>
.json-validator {
  padding: 20px;
}

.page-title {
  margin-bottom: 24px;
  color: #1f2937;
  font-size: 1.5rem;
}

.validator-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.json-input {
  width: 100%;
  min-height: 200px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
}

.button-group {
  display: flex;
  gap: 12px;
}

.action-button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background-color: #2563eb;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #1d4ed8;
}

.action-button.secondary {
  background-color: #6b7280;
}

.action-button.secondary:hover {
  background-color: #4b5563;
}

.validation-result {
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
}

.validation-result.is-valid {
  background-color: #ecfdf5;
  color: #059669;
}

.validation-result.is-invalid {
  background-color: #fef2f2;
  color: #dc2626;
}

.json-analysis {
  background-color: #f8fafc;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.json-analysis h3 {
  margin-bottom: 12px;
  color: #4b5563;
}

.analysis-item {
  margin-bottom: 8px;
}

.analysis-item .label {
  color: #6b7280;
  margin-right: 8px;
}
</style> 