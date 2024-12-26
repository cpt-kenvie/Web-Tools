<template>
  <div class="image-converter">
    <h2 class="page-title">图片格式转换</h2>
    <div class="converter-container">
      <div class="upload-area">
        <input
          type="file"
          ref="fileInput"
          @change="handleFileSelect"
          accept="image/*"
          class="file-input"
          multiple
        >
        <div class="upload-content">
          <div class="upload-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="upload-text">
            <p class="primary-text">拖放图片到此处，或点击上传</p>
            <p class="secondary-text">支持 PNG、JPG、WebP 格式</p>
          </div>
        </div>
      </div>

      <div v-if="files.length > 0" class="files-list">
        <div v-for="(file, index) in files" :key="index" class="file-card">
          <div class="preview-area">
            <img :src="file.preview" class="preview-image" alt="预览图">
          </div>
          <div class="file-info">
            <div class="file-details">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ formatFileSize(file.file.size) }}</span>
            </div>
            <div class="convert-controls">
              <select v-model="file.targetFormat" class="format-select">
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/webp">WebP</option>
              </select>
              <button 
                @click="convertImage(index)"
                class="convert-button"
                :class="{ 'loading': file.converting }"
              >
                {{ file.converting ? '转换中...' : '转换' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PhotoIcon } from '@heroicons/vue/24/outline'
import { showSuccessNotification, showErrorNotification } from '@/utils/notification.js'

const dragover = ref(false)
const files = ref([])
const fileInput = ref(null)

const handleDrop = (e) => {
  dragover.value = false
  const droppedFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
  addFiles(droppedFiles)
}

const handleFileSelect = (e) => {
  const selectedFiles = Array.from(e.target.files).filter(file => file.type.startsWith('image/'))
  addFiles(selectedFiles)
}

const addFiles = async (newFiles) => {
  for (const file of newFiles) {
    const preview = await createPreview(file)
    files.value.push({
      file,
      name: file.name,
      preview,
      targetFormat: 'image/png',
      converting: false
    })
  }
}

const createPreview = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.readAsDataURL(file)
  })
}

const convertImage = async (index) => {
  const file = files.value[index]
  file.converting = true

  try {
    // 创建canvas并加载图片
    const img = new Image()
    img.src = file.preview
    await new Promise((resolve) => (img.onload = resolve))

    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)

    // 转换格式
    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, file.targetFormat, 0.9)
    })

    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted_${file.name.split('.')[0]}.${file.targetFormat.split('/')[1]}`
    a.click()
    URL.revokeObjectURL(url)

    showSuccessNotification('转换成功！')
  } catch (error) {
    showErrorNotification('转换失败：' + error.message)
  } finally {
    file.converting = false
  }
}

// 添加文件大小格式化函数
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.image-converter {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 24px;
}

.converter-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.upload-area {
  position: relative;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  background-color: #f9fafb;
  transition: all 0.2s ease;
  cursor: pointer;
}

.upload-area:hover {
  border-color: #2563eb;
  background-color: #eff6ff;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-content {
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: #6b7280;
}

.upload-icon svg {
  width: 100%;
  height: 100%;
}

.upload-text {
  text-align: center;
}

.primary-text {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

.secondary-text {
  font-size: 14px;
  color: #6b7280;
}

.files-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.file-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.file-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.preview-area {
  aspect-ratio: 16/9;
  background-color: #f3f4f6;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.file-info {
  padding: 12px;
}

.file-details {
  margin-bottom: 12px;
}

.file-name {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 12px;
  color: #6b7280;
}

.convert-controls {
  display: flex;
  gap: 8px;
}

.format-select {
  flex: 1;
  padding: 6px 12px;
  font-size: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.format-select:hover {
  border-color: #2563eb;
}

.convert-button {
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: #2563eb;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.convert-button:hover {
  background-color: #1d4ed8;
}

.convert-button.loading {
  background-color: #93c5fd;
  cursor: not-allowed;
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .page-title {
    color: #f3f4f6;
  }

  .upload-area {
    background-color: #1f2937;
    border-color: #374151;
  }

  .upload-area:hover {
    background-color: #2563eb20;
    border-color: #3b82f6;
  }

  .primary-text {
    color: #e5e7eb;
  }

  .secondary-text {
    color: #9ca3af;
  }

  .file-card {
    background-color: #1f2937;
    border-color: #374151;
  }

  .preview-area {
    background-color: #111827;
  }

  .file-name {
    color: #e5e7eb;
  }

  .file-size {
    color: #9ca3af;
  }

  .format-select {
    background-color: #374151;
    border-color: #4b5563;
    color: #e5e7eb;
  }

  .format-select:hover {
    border-color: #3b82f6;
  }
}
</style> 