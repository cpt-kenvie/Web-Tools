<template>
  <div class="json-formatter">
    <h2 class="page-title">JSON 格式化</h2>
    <div class="formatter-container">
      <div class="input-section">
        <textarea
          v-model="inputJson"
          placeholder="请输入需要格式化的 JSON"
          class="json-input"
        ></textarea>
      </div>
      <div class="button-group">
        <button @click="formatJson" class="action-button">格式化</button>
        <button @click="clearInput" class="action-button secondary">清空</button>
      </div>
      <div class="output-section">
        <pre class="json-output">{{ formattedJson }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputJson = ref('')
const formattedJson = ref('')

const formatJson = () => {
  try {
    const parsed = JSON.parse(inputJson.value)
    formattedJson.value = JSON.stringify(parsed, null, 2)
  } catch (error) {
    formattedJson.value = '无效的 JSON 格式: ' + error.message
  }
}

const clearInput = () => {
  inputJson.value = ''
  formattedJson.value = ''
}
</script>

<style scoped>
.json-formatter {
  padding: 20px;
}

.page-title {
  margin-bottom: 24px;
  color: #1f2937;
  font-size: 1.5rem;
}

.formatter-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.json-input, .json-output {
  width: 100%;
  min-height: 200px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
}

.json-input {
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

.json-output {
  background-color: #f8fafc;
}
</style> 