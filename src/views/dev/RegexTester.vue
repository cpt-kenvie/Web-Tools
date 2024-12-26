<template>
  <div class="regex-tester">
    <h2 class="page-title">正则表达式测试</h2>
    <div class="tester-container">
      <div class="input-group">
        <label>正则表达式：</label>
        <input 
          v-model="regex" 
          type="text" 
          placeholder="/pattern/flags"
          class="regex-input"
        />
      </div>
      <div class="input-group">
        <label>测试文本：</label>
        <textarea
          v-model="testText"
          placeholder="输入需要测试的文本"
          class="test-input"
        ></textarea>
      </div>
      <div class="result-section">
        <h3>匹配结果：</h3>
        <div class="match-results">
          {{ matchResult }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { showSuccessNotification, showErrorNotification } from '@/utils/notification.js'

const regex = ref('')
const testText = ref('')
const matchResult = ref('')

const testRegex = () => {
  try {
    if (!regex.value || !testText.value) {
      showErrorNotification('请输入正则表达式和测试文本')
      return
    }

    const regexParts = regex.value.match(/^\/(.+)\/([gimuy]*)$/)
    if (!regexParts) {
      showErrorNotification('正则表达式格式无效')
      return
    }

    const [, pattern, flags] = regexParts
    const re = new RegExp(pattern, flags)
    const matches = testText.value.match(re)
    
    if (matches) {
      matchResult.value = JSON.stringify(matches, null, 2)
      showSuccessNotification('匹配成功！')
    } else {
      matchResult.value = '没有找到匹配项'
      showErrorNotification('没有找到匹配项')
    }
  } catch (error) {
    showErrorNotification('错误: ' + error.message)
  }
}

watch([regex, testText], testRegex)
</script>

<style scoped>
.regex-tester {
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

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-weight: 500;
  color: #4b5563;
}

.regex-input {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-family: monospace;
}

.test-input {
  min-height: 150px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  resize: vertical;
  font-family: monospace;
}

.result-section {
  background-color: #f8fafc;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.result-section h3 {
  margin-bottom: 12px;
  color: #4b5563;
}

.match-results {
  font-family: monospace;
  white-space: pre-wrap;
  color: #1f2937;
}
</style> 