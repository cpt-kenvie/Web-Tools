<template>
  <div class="qrcode-decoder">
    <h2 class="page-title">二维码解码</h2>
    <div class="decoder-container">
      <div 
        class="upload-area"
        @click="triggerFileInput"
        @drop.prevent="handleDrop"
        @dragover.prevent="dragover = true"
        @dragleave.prevent="dragover = false"
        @paste="handlePaste"
        :class="{ 'drag-over': dragover }"
        tabindex="0"
      >
        <input
          type="file"
          ref="fileInput"
          @change="handleFileSelect"
          accept="image/*"
          class="file-input"
          hidden
          multiple
        >
        <div class="upload-content">
          <div class="upload-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="upload-text">
            <p class="primary-text">点击上传、拖放或粘贴二维码图片</p>
            <p class="secondary-text">支持 PNG、JPG、WebP 格式，可批量上传</p>
          </div>
        </div>
      </div>

      <div v-if="results.length > 0" class="results-section">
        <div v-for="(result, index) in results" :key="index" class="result-card">
          <div class="result-preview">
            <img :src="result.preview" alt="二维码预览">
          </div>
          <div class="result-content">
            <div v-if="result.text" class="decoded-content">
              <div class="content-header">
                <span>解码结果</span>
                <div class="header-actions">
                  <button 
                    class="copy-button"
                    @click="copyContent(result.text)"
                  >
                    复制内容
                  </button>
                  <button 
                    class="delete-button"
                    @click="removeResult(index)"
                  >
                    删除
                  </button>
                </div>
              </div>
              <div class="content-body">
                <p>{{ result.text }}</p>
              </div>
            </div>
            <div v-else class="error-message">
              {{ result.error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import jsQR from 'jsqr'
import { showSuccessNotification, showErrorNotification } from '@/utils/notification'

const fileInput = ref(null)
const dragover = ref(false)
const results = ref([])

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  files.forEach(processImage)
}

const handleDrop = (e) => {
  dragover.value = false
  const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
  files.forEach(processImage)
}

const handlePaste = (e) => {
  const items = e.clipboardData.items
  for (let item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      processImage(file)
    }
  }
}

const processImage = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const preview = e.target.result
    results.value.unshift({ preview, processing: true })
    decodeQR(preview, results.value[0])
  }
  reader.readAsDataURL(file)
}

const decodeQR = (dataUrl, result) => {
  const image = new Image()
  image.onload = () => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    context.drawImage(image, 0, 0)
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)
    
    if (code) {
      result.text = code.data
      result.error = null
      showSuccessNotification('二维码解码成功！')
    } else {
      result.text = null
      result.error = '未能识别二维码，请确保图片清晰且包含完整的二维码'
      showErrorNotification('二维码解码失败')
    }
    result.processing = false
  }
  image.src = dataUrl
}

const copyContent = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => showSuccessNotification('内容已复制到剪贴板'))
    .catch(() => showErrorNotification('复制失败'))
}

const removeResult = (index) => {
  results.value.splice(index, 1)
  showSuccessNotification('删除成功')
}
</script>

<style scoped>
.qrcode-decoder {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.decoder-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
}

.upload-area {
  position: relative;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  background-color: #f9fafb;
  transition: all 0.2s ease;
  cursor: pointer;
  outline: none;
}

.upload-area:hover,
.upload-area:focus {
  border-color: #2563eb;
  background-color: #eff6ff;
}

.upload-area.drag-over {
  border-color: #2563eb;
  background-color: #eff6ff;
}

.upload-content {
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-icon {
  width: 32px;
  height: 32px;
  color: #6b7280;
}

.upload-text {
  text-align: center;
}

.primary-text {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

.secondary-text {
  font-size: 12px;
  color: #6b7280;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.image-preview {
  display: flex;
  justify-content: center;
  padding: 16px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.image-preview img {
  max-width: 300px;
  max-height: 300px;
  object-fit: contain;
}

.decoded-content {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.content-header span {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.copy-button {
  padding: 4px 12px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-button:hover {
  background-color: #1d4ed8;
}

.content-body {
  padding: 16px;
}

.content-body p {
  margin: 0;
  font-size: 14px;
  color: #374151;
  white-space: pre-wrap;
  word-break: break-all;
}

.error-message {
  padding: 12px 16px;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;
  font-size: 14px;
}

.results-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.result-preview {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  border-radius: 4px;
  overflow: hidden;
}

.result-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.delete-button {
  padding: 4px 12px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-button:hover {
  background-color: #dc2626;
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .upload-area {
    background-color: #1f2937;
    border-color: #374151;
  }

  .upload-area:hover,
  .upload-area:focus,
  .upload-area.drag-over {
    background-color: #2563eb20;
    border-color: #3b82f6;
  }

  .primary-text {
    color: #e5e7eb;
  }

  .secondary-text {
    color: #9ca3af;
  }

  .image-preview,
  .decoded-content {
    background-color: #1f2937;
    border-color: #374151;
  }

  .content-header {
    background-color: #111827;
    border-color: #374151;
  }

  .content-header span {
    color: #e5e7eb;
  }

  .content-body p {
    color: #e5e7eb;
  }

  .error-message {
    background-color: #991b1b20;
    border-color: #991b1b40;
    color: #fca5a5;
  }

  .result-card {
    background-color: #1f2937;
    border-color: #374151;
  }

  .result-preview {
    background-color: #111827;
  }
}
</style> 