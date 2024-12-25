<template>
  <div class="time-converter">
    <h2 class="page-title">时间转换工具</h2>
    
    <div class="converter-container">
      <!-- 当前时间显示 -->
      <div class="current-time">
        <div class="time-display">
          <span class="label">当前时间：</span>
          <span class="value">{{ currentTime }}</span>
          <button @click="updateCurrentTime" class="refresh-button">
            刷新
          </button>
        </div>
        <div class="time-display">
          <span class="label">当前时间戳：</span>
          <span class="value">{{ currentTimestamp }}</span>
          <button @click="copyToClipboard(currentTimestamp)" class="copy-button">
            复制
          </button>
        </div>
      </div>

      <!-- 时间戳转换 -->
      <div class="conversion-section">
        <h3>时间戳转换</h3>
        <div class="input-group">
          <input
            v-model="timestamp"
            type="text"
            placeholder="请输入时间戳（毫秒）"
            class="time-input"
          />
          <button @click="convertFromTimestamp" class="convert-button">
            转换
          </button>
        </div>
        <div class="result-group" v-if="timestampResult">
          <div class="result-item">
            <span class="label">UTC时间：</span>
            <span class="value">{{ timestampResult.utc }}</span>
          </div>
          <div class="result-item">
            <span class="label">本地时间：</span>
            <span class="value">{{ timestampResult.local }}</span>
          </div>
          <div class="result-item">
            <span class="label">ISO格式：</span>
            <span class="value">{{ timestampResult.iso }}</span>
          </div>
        </div>
      </div>

      <!-- 日期时间转换 -->
      <div class="conversion-section">
        <h3>日期时间转换</h3>
        <div class="input-group">
          <input
            type="datetime-local"
            v-model="dateTimeInput"
            class="time-input"
          />
          <button @click="convertFromDateTime" class="convert-button">
            转换
          </button>
        </div>
        <div class="result-group" v-if="dateTimeResult">
          <div class="result-item">
            <span class="label">时间戳（毫秒）：</span>
            <span class="value">{{ dateTimeResult.timestamp }}</span>
            <button 
              @click="copyToClipboard(dateTimeResult.timestamp)" 
              class="copy-button"
            >
              复制
            </button>
          </div>
          <div class="result-item">
            <span class="label">UTC时间：</span>
            <span class="value">{{ dateTimeResult.utc }}</span>
          </div>
          <div class="result-item">
            <span class="label">ISO格式：</span>
            <span class="value">{{ dateTimeResult.iso }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 当前时间相关
const currentTime = ref('')
const currentTimestamp = ref('')
let timer

const updateCurrentTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString()
  currentTimestamp.value = now.getTime()
}

// 时间戳转换相关
const timestamp = ref('')
const timestampResult = ref(null)

const convertFromTimestamp = () => {
  try {
    const ts = parseInt(timestamp.value)
    if (isNaN(ts)) {
      throw new Error('请输入有效的时间戳')
    }
    const date = new Date(ts)
    timestampResult.value = {
      utc: date.toUTCString(),
      local: date.toLocaleString(),
      iso: date.toISOString()
    }
  } catch (error) {
    alert(error.message)
  }
}

// 日期时间转换相关
const dateTimeInput = ref('')
const dateTimeResult = ref(null)

const convertFromDateTime = () => {
  try {
    if (!dateTimeInput.value) {
      throw new Error('请选择日期时间')
    }
    const date = new Date(dateTimeInput.value)
    dateTimeResult.value = {
      timestamp: date.getTime(),
      utc: date.toUTCString(),
      iso: date.toISOString()
    }
  } catch (error) {
    alert(error.message)
  }
}

// 复制到剪贴板
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text.toString())
    alert('已复制到剪贴板')
  } catch (error) {
    alert('复制失败：' + error.message)
  }
}

// 生命周期钩子
onMounted(() => {
  updateCurrentTime()
  timer = setInterval(updateCurrentTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.time-converter {
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

.current-time {
  background-color: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.time-display {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 12px;
}

.time-display:last-child {
  margin-bottom: 0;
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

.input-group {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.time-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
}

.result-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.label {
  color: #6b7280;
  min-width: 120px;
}

.value {
  color: #1f2937;
  font-family: monospace;
  background-color: #f9fafb;
  padding: 4px 8px;
  border-radius: 4px;
  flex: 1;
}

.convert-button, .refresh-button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background-color: #2563eb;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.convert-button:hover, .refresh-button:hover {
  background-color: #1d4ed8;
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
</style> 