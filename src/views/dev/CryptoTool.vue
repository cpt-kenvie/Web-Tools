<template>
  <div class="crypto-tool">
    <h2 class="page-title">加密解密工具</h2>
    
    <div class="tool-container">
      <!-- 哈希计算 -->
      <div class="tool-section">
        <h3>哈希计算</h3>
        <div class="input-section">
          <textarea
            v-model="hashInput"
            placeholder="输入要计算哈希的文本"
            class="input-area"
          ></textarea>
          <div class="button-group">
            <button 
              v-for="type in hashTypes" 
              :key="type"
              @click="calculateHash(type)"
              class="hash-button"
            >
              {{ type }}
            </button>
          </div>
          <div v-if="hashResult" class="result-section">
            <div class="result-header">
              <span>{{ hashResult.type }} 结果：</span>
              <button @click="copyToClipboard(hashResult.value)" class="copy-button">
                复制
              </button>
            </div>
            <div class="result-content">{{ hashResult.value }}</div>
          </div>
        </div>
      </div>

      <!-- 文件哈希计算 -->
      <div class="tool-section">
        <h3>文件哈希计算</h3>
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
          <div class="button-group" v-if="fileInfo">
            <button 
              v-for="type in fileHashTypes" 
              :key="type"
              @click="calculateFileHash(type)"
              class="hash-button"
              :disabled="isCalculating"
            >
              {{ type }}
            </button>
          </div>
          <div v-if="fileHashResult" class="result-section">
            <div class="result-header">
              <span>{{ fileHashResult.type }} 结果：</span>
              <button @click="copyToClipboard(fileHashResult.value)" class="copy-button">
                复制
              </button>
            </div>
            <div class="result-content">{{ fileHashResult.value }}</div>
          </div>
        </div>
      </div>

      <!-- AES 加密解密 -->
      <div class="tool-section">
        <h3>AES 加密解密</h3>
        <div class="input-section">
          <input
            v-model="aesKey"
            type="password"
            placeholder="输入密钥（16位字符）"
            class="key-input"
          />
          <textarea
            v-model="aesInput"
            placeholder="输入要加密/解密的文本"
            class="input-area"
          ></textarea>
          <div class="button-group">
            <button @click="aesEncrypt" class="action-button">加密</button>
            <button @click="aesDecrypt" class="action-button secondary">解密</button>
            <button @click="clearAes" class="action-button clear">清空</button>
          </div>
          <div v-if="aesResult" class="result-section">
            <div class="result-header">
              <span>{{ aesResult.type }}结果：</span>
              <button @click="copyToClipboard(aesResult.value)" class="copy-button">
                复制
              </button>
            </div>
            <div class="result-content">{{ aesResult.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CryptoJS from 'crypto-js'

// 哈希计算相关
const hashInput = ref('')
const hashResult = ref(null)
const hashTypes = ['MD5', 'SHA1', 'SHA256', 'SHA512']

const calculateHash = (type) => {
  if (!hashInput.value) {
    alert('请输入要计算哈希的文本')
    return
  }

  let result
  switch (type) {
    case 'MD5':
      result = CryptoJS.MD5(hashInput.value).toString()
      break
    case 'SHA1':
      result = CryptoJS.SHA1(hashInput.value).toString()
      break
    case 'SHA256':
      result = CryptoJS.SHA256(hashInput.value).toString()
      break
    case 'SHA512':
      result = CryptoJS.SHA512(hashInput.value).toString()
      break
  }

  hashResult.value = {
    type,
    value: result
  }
}

// 文件哈希计算相关
const fileInput = ref(null)
const fileInfo = ref(null)
const fileHashResult = ref(null)
const isCalculating = ref(false)
const fileHashTypes = ['MD5', 'SHA1', 'SHA256']

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  fileInfo.value = {
    name: file.name,
    size: formatFileSize(file.size)
  }
  fileHashResult.value = null
}

const calculateFileHash = async (type) => {
  const file = fileInput.value.files[0]
  if (!file) return

  isCalculating.value = true
  try {
    const buffer = await file.arrayBuffer()
    const wordArray = CryptoJS.lib.WordArray.create(buffer)
    
    let result
    switch (type) {
      case 'MD5':
        result = CryptoJS.MD5(wordArray).toString()
        break
      case 'SHA1':
        result = CryptoJS.SHA1(wordArray).toString()
        break
      case 'SHA256':
        result = CryptoJS.SHA256(wordArray).toString()
        break
    }

    fileHashResult.value = {
      type,
      value: result
    }
  } catch (error) {
    alert('计算文件哈希失败：' + error.message)
  } finally {
    isCalculating.value = false
  }
}

// AES 加密解密相关
const aesKey = ref('')
const aesInput = ref('')
const aesResult = ref(null)

const aesEncrypt = () => {
  try {
    if (!validateAesInput()) return

    const encrypted = CryptoJS.AES.encrypt(
      aesInput.value,
      aesKey.value
    ).toString()

    aesResult.value = {
      type: '加密',
      value: encrypted
    }
  } catch (error) {
    alert('加密失败：' + error.message)
  }
}

const aesDecrypt = () => {
  try {
    if (!validateAesInput()) return

    const decrypted = CryptoJS.AES.decrypt(
      aesInput.value,
      aesKey.value
    ).toString(CryptoJS.enc.Utf8)

    if (!decrypted) {
      throw new Error('解密失败，请检查密钥和密文是否正确')
    }

    aesResult.value = {
      type: '解密',
      value: decrypted
    }
  } catch (error) {
    alert('解密失败：' + error.message)
  }
}

const validateAesInput = () => {
  if (!aesKey.value) {
    alert('请输入密钥')
    return false
  }
  if (!aesInput.value) {
    alert('请输入要处理的文本')
    return false
  }
  return true
}

const clearAes = () => {
  aesInput.value = ''
  aesResult.value = null
}

// 通用函数
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('已复制到剪贴板')
  } catch (error) {
    alert('复制失败：' + error.message)
  }
}
</script>

<style scoped>
.crypto-tool {
  padding: 20px;
}

.page-title {
  margin-bottom: 24px;
  color: #1f2937;
  font-size: 1.5rem;
}

.tool-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.tool-section {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.tool-section h3 {
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

.key-input {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-family: monospace;
}

.button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.hash-button, .action-button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.hash-button {
  background-color: #2563eb;
  color: white;
}

.hash-button:hover {
  background-color: #1d4ed8;
}

.hash-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.action-button {
  background-color: #2563eb;
  color: white;
}

.action-button.secondary {
  background-color: #6b7280;
}

.action-button.clear {
  background-color: #dc2626;
}

.action-button:hover {
  opacity: 0.9;
}

.result-section {
  background-color: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.result-header {
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

.result-content {
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