<template>
  <div class="api-tester">
    <h2 class="page-title">API 调试工具</h2>
    <div class="tester-container">
      <div class="request-section">
        <div class="url-input-group">
          <select v-model="method" class="method-select">
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
          <input 
            v-model="url" 
            type="text" 
            placeholder="输入请求 URL"
            class="url-input"
          />
          <button @click="sendRequest" class="send-button">发送请求</button>
        </div>
        
        <div class="tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab"
            @click="currentTab = tab"
            :class="['tab-button', { active: currentTab === tab }]"
          >
            {{ tab }}
          </button>
        </div>

        <div class="tab-content">
          <div v-if="currentTab === '请求头'" class="headers-section">
            <div v-for="(header, index) in headers" :key="index" class="header-item">
              <input 
                v-model="header.key" 
                placeholder="Header Key"
                class="header-input"
              />
              <input 
                v-model="header.value" 
                placeholder="Header Value"
                class="header-input"
              />
              <button @click="removeHeader(index)" class="remove-button">×</button>
            </div>
            <button @click="addHeader" class="add-button">添加请求头</button>
          </div>

          <div v-if="currentTab === '请求体'" class="body-section">
            <textarea
              v-model="requestBody"
              placeholder="请求体 (JSON 格式)"
              class="body-input"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="response-section">
        <h3>响应结果：</h3>
        <div class="response-info" v-if="response.status">
          <span class="status">状态: {{ response.status }}</span>
          <span class="time">耗时: {{ response.time }}ms</span>
          <button @click="copyToClipboard" class="copy-button">复制</button>
        </div>
        <pre class="response-content" v-html="responseContent"></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/default.css' // 选择您喜欢的样式

const method = ref('GET')
const url = ref('')
const headers = ref([{ key: '', value: '' }])
const requestBody = ref('')
const response = ref({ status: '', time: '', data: '' })
const tabs = ['请求头', '请求体']
const currentTab = ref('请求头')
const responseContent = ref('')

watch(() => response.value.data, (newData) => {
  responseContent.value = hljs.highlight('json', newData).value
})

const addHeader = () => {
  headers.value.push({ key: '', value: '' })
}

const removeHeader = (index) => {
  headers.value.splice(index, 1)
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(response.value.data)
    .then(() => {
      alert('复制成功！')
    })
    .catch(err => {
      console.error('复制失败:', err)
    })
}

const sendRequest = async () => {
  try {
    const startTime = Date.now()
    const headerObj = {}
    headers.value.forEach(h => {
      if (h.key && h.value) {
        headerObj[h.key] = h.value
      }
    })

    const options = {
      method: method.value,
      headers: headerObj
    }

    if (method.value !== 'GET' && requestBody.value) {
      options.body = requestBody.value
    }

    const res = await fetch(url.value, options)
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()
    
    response.value = {
      status: res.status,
      time: Date.now() - startTime,
      data: JSON.stringify(data, null, 2)
    }
  } catch (error) {
    response.value = {
      status: 'Error',
      time: 0,
      data: error.message
    }
  }
}
</script>

<style scoped>
.api-tester {
  padding: 20px;
}

.page-title {
  margin-bottom: 24px;
  color: #1f2937;
  font-size: 1.5rem;
}

.tester-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.url-input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.method-select {
  width: 100px;
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background-color: white;
}

.url-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.send-button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background-color: #2563eb;
  color: white;
  cursor: pointer;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-button {
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  color: #6b7280;
  border-bottom: 2px solid transparent;
}

.tab-button.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

.headers-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header-item {
  display: flex;
  gap: 8px;
}

.header-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.remove-button {
  padding: 0 12px;
  border: none;
  background-color: #ef4444;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.add-button {
  padding: 8px;
  border: 1px dashed #e5e7eb;
  background: none;
  color: #6b7280;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 8px;
}

.body-input {
  width: 100%;
  min-height: 200px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-family: monospace;
  resize: vertical;
}

.response-section {
  background-color: #f8fafc;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.response-section h3 {
  margin-bottom: 12px;
  color: #4b5563;
}

.response-info {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.status, .time {
  color: #6b7280;
  font-size: 14px;
}

.response-content {
  padding: 16px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-family: monospace;
  white-space: pre-wrap;
  overflow-x: auto;
}

.copy-button {
  margin-left: 16px;
  padding: 4px 8px;
  border: none;
  background-color: #2563eb;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
.copy-button:hover {
  background-color: #1d4ed8;
}
</style> 