<template>
  <div class="base64-converter">
    <h2 class="page-title">Base64 转换工具</h2>
    
    <div class="converter-container">
      <!-- 文本转 Base64 -->
      <div class="conversion-section">
        <h3>文本转 Base64</h3>
        <div class="input-section">
          <textarea
            v-model="textInput"
            placeholder="请输入要转换的文本"
            class="input-area"
          ></textarea>
          <div class="button-group">
            <button @click="textToBase64" class="convert-button">转换</button>
            <button @click="clearText" class="clear-button">清空</button>
          </div>
          <div v-if="base64Output" class="output-section">
            <div class="output-header">
              <span>Base64 结果：</span>
              <button @click="copyToClipboard(base64Output)" class="copy-button">
                复制
              </button>
            </div>
            <div class="output-content">{{ base64Output }}</div>
          </div>
        </div>
      </div>

      <!-- Base64 转文本 -->
      <div class="conversion-section">
        <h3>Base64 转文本</h3>
        <div class="input-section">
          <textarea
            v-model="base64Input"
            placeholder="请输入 Base64 编码"
            class="input-area"
          ></textarea>
          <div class="button-group">
            <button @click="base64ToText" class="convert-button">转换</button>
            <button @click="clearBase64" class="clear-button">清空</button>
          </div>
          <div v-if="textOutput" class="output-section">
            <div class="output-header">
              <span>解码结果：</span>
              <button @click="copyToClipboard(textOutput)" class="copy-button">
                复制
              </button>
            </div>
            <div class="output-content">{{ textOutput }}</div>
          </div>
        </div>
      </div>

      <!-- 文件转 Base64 -->
      <div class="conversion-section">
        <h3>文件转 Base64</h3>
        <div class="file-section">
          <input 
            type="file" 
            @change="handleFileSelect" 
            class="file-input"
            ref="fileInput"
          />
          <div v-if="fileInfo" class="file-info">
            <span>已选择文件：{{ fileInfo.name }} ({{ fileInfo.size }})</span>
          </div>
          <div v-if="fileBase64" class="output-section">
            <div class="output-header">
              <span>Base64 结果：</span>
              <button @click="copyToClipboard(fileBase64)" class="copy-button">
                复制
              </button>
            </div>
            <div class="output-content">
              {{ fileBase64.substring(0, 100) }}...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showSuccessNotification, showErrorNotification } from '@/utils/notification.js'

// 文本转换相关
const textInput = ref('')
const base64Output = ref('')
const base64Input = ref('')
const textOutput = ref('')

// 文件相关
const fileInput = ref(null)
const fileInfo = ref(null)
const fileBase64 = ref('')

// 文本转 Base64
const textToBase64 = () => {
  try {
    if (!textInput.value) {
      throw new Error('请输入要转换的文本')
    }
    base64Output.value = btoa(unescape(encodeURIComponent(textInput.value)))
    showSuccessNotification('转换成功！')
  } catch (error) {
    showErrorNotification('转换失败：' + error.message)
  }
}

// Base64 转文本
const base64ToText = () => {
  try {
    if (!base64Input.value) {
      throw new Error('请输入 Base64 编码')
    }
    textOutput.value = decodeURIComponent(escape(atob(base64Input.value)))
    showSuccessNotification('解码成功！')
  } catch (error) {
    showErrorNotification('解码失败：请确保输入的是有效的 Base64 编码')
  }
}

// 文件转 Base64
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  fileInfo.value = {
    name: file.name,
    size: formatFileSize(file.size)
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    fileBase64.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// 辅助函数
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showSuccessNotification('已复制到剪贴板')
  } catch (error) {
    showErrorNotification('复制失败：' + error.message)
  }
}

const clearText = () => {
  textInput.value = ''
  base64Output.value = ''
}

const clearBase64 = () => {
  base64Input.value = ''
  textOutput.value = ''
}
</script>

<style scoped>
.base64-converter {
  padding: 20px;
}

.page-title {
  margin-bottom: 24px;
  color: #1f2937;
  font-size: 1.5rem;
}

.converter-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.conversion-section {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.conversion-section h3 {
  margin-bottom: 16px;
  color: #374151;
  font-size: 1.1rem;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-area {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
  resize: vertical;
}

.button-group {
  display: flex;
  gap: 12px;
}

.convert-button, .clear-button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.convert-button {
  background-color: #2563eb;
  color: white;
}

.convert-button:hover {
  background-color: #1d4ed8;
}

.clear-button {
  background-color: #6b7280;
  color: white;
}

.clear-button:hover {
  background-color: #4b5563;
}

.output-section {
  background-color: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f1f5f9;
  border-bottom: 1px solid #e5e7eb;
}

.copy-button {
  padding: 4px 12px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  background-color: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-button:hover {
  background-color: #f3f4f6;
  color: #4b5563;
}

.output-content {
  padding: 12px;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
}

.file-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-input {
  padding: 12px;
  border: 2px dashed #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
}

.file-info {
  color: #6b7280;
  font-size: 0.875rem;
}
</style> 