<template>
  <div class="image-compressor">
    <h2 class="page-title">图片压缩</h2>
    <div class="compressor-container">
      <div 
        class="upload-area"
        @click="triggerFileInput"
        @drop.prevent="handleDrop"
        @dragover.prevent="dragover = true"
        @dragleave.prevent="dragover = false"
        :class="{ 'drag-over': dragover }"
      >
        <input
          type="file"
          ref="fileInput"
          @change="handleFileSelect"
          accept="image/*"
          class="file-input"
          multiple
          hidden
        >
        <div class="upload-content">
          <div class="upload-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
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
          <div class="preview-section">
            <div class="preview-area original">
              <img :src="file.preview" class="preview-image" alt="原图">
              <div class="preview-label">原图</div>
            </div>
            <div class="preview-area compressed" v-if="file.compressedPreview">
              <img :src="file.compressedPreview" class="preview-image" alt="压缩预览">
              <div class="preview-label">压缩预览</div>
            </div>
          </div>
          
          <div class="file-info">
            <div class="file-header">
              <span class="file-name">{{ file.name }}</span>
              <div class="file-size">
                <span>原始：{{ formatFileSize(file.file.size) }}</span>
                <span v-if="file.compressedSize" class="compressed-size">
                  压缩后：{{ formatFileSize(file.compressedSize) }}
                  <span class="reduction">(减少 {{ calculateReduction(file) }}%)</span>
                </span>
              </div>
            </div>
            
            <div class="compression-controls">
              <div class="control-group">
                <label>压缩质量</label>
                <div class="quality-control">
                  <input 
                    type="range" 
                    v-model="file.quality" 
                    min="1" 
                    max="100"
                    class="quality-slider"
                    @input="updatePreview(index)"
                  >
                  <span class="quality-value">{{ file.quality }}%</span>
                </div>
              </div>
              
              <div class="control-group">
                <label>最大尺寸</label>
                <div class="size-control">
                  <input 
                    type="number" 
                    v-model="file.maxWidth"
                    class="size-input"
                    placeholder="宽度"
                    @input="updatePreview(index)"
                  >
                  <span>×</span>
                  <input 
                    type="number" 
                    v-model="file.maxHeight"
                    class="size-input"
                    placeholder="高度"
                    @input="updatePreview(index)"
                  >
                  <button 
                    class="aspect-ratio-button"
                    :class="{ active: file.keepAspectRatio }"
                    @click="toggleAspectRatio(index)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-20h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="action-buttons">
              <button 
                @click="compressImage(index)"
                class="compress-button"
                :class="{ 'loading': file.compressing }"
              >
                {{ file.compressing ? '压缩中...' : '下载压缩文件' }}
              </button>
              <button 
                @click="removeFile(index)"
                class="remove-button"
              >
                删除
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
import { showSuccessNotification, showErrorNotification } from '@/utils/notification.js'

const files = ref([])
const fileInput = ref(null)
const dragover = ref(false)

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
      compressedPreview: null,
      quality: 80,
      maxWidth: null,
      maxHeight: null,
      keepAspectRatio: true,
      compressing: false,
      compressedSize: null,
      originalDimensions: await getImageDimensions(preview)
    })
  }
}

const getImageDimensions = (src) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.src = src
  })
}

const createPreview = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.readAsDataURL(file)
  })
}

const updatePreview = async (index) => {
  const file = files.value[index]
  if (!file) return

  try {
    const img = new Image()
    img.src = file.preview
    await new Promise((res) => (img.onload = res))

    // 计算新的尺寸
    let newWidth = file.maxWidth || img.width
    let newHeight = file.maxHeight || img.height

    if (file.keepAspectRatio) {
      const ratio = img.width / img.height
      if (newWidth && !newHeight) {
        newHeight = Math.round(newWidth / ratio)
      } else if (!newWidth && newHeight) {
        newWidth = Math.round(newHeight * ratio)
      }
    }

    const canvas = document.createElement('canvas')
    canvas.width = newWidth
    canvas.height = newHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, newWidth, newHeight)

    // 生成预览
    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, file.file.type, file.quality / 100)
    })

    file.compressedPreview = URL.createObjectURL(blob)
    file.compressedSize = blob.size
  } catch (error) {
    console.error('预览生成失败:', error)
  }
}

const toggleAspectRatio = (index) => {
  const file = files.value[index]
  file.keepAspectRatio = !file.keepAspectRatio
  if (file.keepAspectRatio && file.maxWidth && !file.maxHeight) {
    file.maxHeight = Math.round(file.maxWidth / (file.originalDimensions.width / file.originalDimensions.height))
  }
  updatePreview(index)
}

const compressImage = async (index) => {
  const file = files.value[index]
  file.compressing = true

  try {
    const img = new Image()
    img.src = file.preview
    await new Promise((res) => (img.onload = res))

    // 计算新的尺寸
    let newWidth = file.maxWidth || img.width
    let newHeight = file.maxHeight || img.height

    if (file.keepAspectRatio) {
      const ratio = img.width / img.height
      if (newWidth && !newHeight) {
        newHeight = Math.round(newWidth / ratio)
      } else if (!newWidth && newHeight) {
        newWidth = Math.round(newHeight * ratio)
      }
    }

    const canvas = document.createElement('canvas')
    canvas.width = newWidth
    canvas.height = newHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, newWidth, newHeight)

    // 压缩图片
    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, file.file.type, file.quality / 100)
    })

    // 更新压缩后的大小
    file.compressedSize = blob.size

    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `compressed_${file.name}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showSuccessNotification('压缩成功！')
  } catch (error) {
    console.error('压缩失败:', error)
    showErrorNotification('压缩失败：' + error.message)
  } finally {
    file.compressing = false
  }
}

const removeFile = (index) => {
  files.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const calculateReduction = (file) => {
  if (!file.compressedSize) return 0
  const reduction = ((file.file.size - file.compressedSize) / file.file.size) * 100
  return Math.round(reduction)
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleDrop = (e) => {
  dragover.value = false
  const droppedFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
  addFiles(droppedFiles)
}
</script>

<style scoped>
/* 复用 ImageConverter.vue 的基础样式 */
.image-compressor {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* ... 其他基础样式相同 ... */

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

.upload-icon svg {
  width: 100%;
  height: 100%;
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
  gap: 8px;
  padding: 8px;
  background-color: #f3f4f6;
}

.preview-area {
  flex: 1;
  position: relative;
  aspect-ratio: 16/9;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.preview-label {
  position: absolute;
  top: 4px;
  left: 4px;
  padding: 2px 6px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 11px;
  border-radius: 3px;
}

.file-header {
  margin-bottom: 16px;
}

.file-size {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
}

.compressed-size {
  color: #059669;
}

.reduction {
  color: #059669;
  font-weight: 500;
}

.compression-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-group label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.quality-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quality-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: #e5e7eb;
  border-radius: 2px;
  outline: none;
}

.quality-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.quality-value {
  font-size: 13px;
  color: #6b7280;
  min-width: 48px;
}

.size-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.size-input {
  width: 80px;
  padding: 4px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 13px;
}

.aspect-ratio-button {
  padding: 4px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.aspect-ratio-button svg {
  width: 16px;
  height: 16px;
  color: #6b7280;
}

.aspect-ratio-button.active {
  background-color: #2563eb;
  border-color: #2563eb;
}

.aspect-ratio-button.active svg {
  color: white;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.compress-button {
  flex: 1;
  padding: 8px 16px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.compress-button:hover {
  background-color: #1d4ed8;
}

.remove-button {
  padding: 8px 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-button:hover {
  background-color: #dc2626;
}

/* 暗色模式样式 */
@media (prefers-color-scheme: dark) {
  /* ... 复用之前的暗色模式样式 ... */
  
  .preview-section {
    background-color: #1f2937;
  }

  .preview-area {
    background-color: #111827;
  }

  .control-group label {
    color: #e5e7eb;
  }

  .quality-slider {
    background: #374151;
  }

  .quality-value {
    color: #9ca3af;
  }

  .size-input {
    background-color: #374151;
    border-color: #4b5563;
    color: #e5e7eb;
  }

  .aspect-ratio-button {
    background-color: #374151;
    border-color: #4b5563;
  }

  .aspect-ratio-button.active {
    background-color: #2563eb;
    border-color: #2563eb;
  }
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

.upload-area.drag-over {
  border-color: #2563eb;
  background-color: #eff6ff;
}

.file-input {
  display: none; /* 隐藏文件输入框 */
}
</style> 