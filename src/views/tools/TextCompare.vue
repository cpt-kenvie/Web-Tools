<template>
  <div class="text-compare">
    <h2 class="page-title">文本对比工具</h2>
    <div class="compare-container">
      <div class="editor-section">
        <div class="editor-wrapper">
          <div class="editor-header">
            <span>文本 A</span>
            <button @click="clearLeft" class="clear-button">清空</button>
          </div>
          <div class="editor-content">
            <div class="line-numbers" ref="leftLineNumbers">
              <div v-for="n in leftLineNums" :key="n" class="line-number">{{ n }}</div>
            </div>
            <textarea
              v-model="leftText"
              class="text-editor"
              placeholder="请输入左侧文本"
              @scroll="handleScroll($event, 'left')"
              ref="leftEditor"
            ></textarea>
          </div>
        </div>
        <div class="editor-wrapper">
          <div class="editor-header">
            <span>文本 B</span>
            <button @click="clearRight" class="clear-button">清空</button>
          </div>
          <div class="editor-content">
            <div class="line-numbers" ref="rightLineNumbers">
              <div v-for="n in rightLineNums" :key="n" class="line-number">{{ n }}</div>
            </div>
            <textarea
              v-model="rightText"
              class="text-editor"
              placeholder="请输入右侧文本"
              @scroll="handleScroll($event, 'right')"
              ref="rightEditor"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const leftText = ref('')
const rightText = ref('')
const leftEditor = ref(null)
const rightEditor = ref(null)
const leftLineNumbers = ref(null)
const rightLineNumbers = ref(null)

// 生成行号
const generateLineNumbers = (text) => {
  return text.split('\n').length || 1
}

const leftLineNums = computed(() => generateLineNumbers(leftText.value))
const rightLineNums = computed(() => generateLineNumbers(rightText.value))

// 处理滚动同步
const handleScroll = (event, source) => {
  const scrollTop = event.target.scrollTop
  
  if (source === 'left') {
    // 同步左侧行号
    if (leftLineNumbers.value) {
      leftLineNumbers.value.scrollTop = scrollTop
    }
    // 同步右侧
    if (rightEditor.value && rightLineNumbers.value) {
      rightEditor.value.scrollTop = scrollTop
      rightLineNumbers.value.scrollTop = scrollTop
    }
  } else {
    // 同步右侧行号
    if (rightLineNumbers.value) {
      rightLineNumbers.value.scrollTop = scrollTop
    }
    // 同步左侧
    if (leftEditor.value && leftLineNumbers.value) {
      leftEditor.value.scrollTop = scrollTop
      leftLineNumbers.value.scrollTop = scrollTop
    }
  }
}

const clearLeft = () => {
  leftText.value = ''
}

const clearRight = () => {
  rightText.value = ''
}

// 实时对比文本并高亮
const compareTexts = () => {
  const leftLines = leftText.value.split('\n')
  const rightLines = rightText.value.split('\n')
  
  const leftTextArea = leftEditor.value
  const rightTextArea = rightEditor.value
  
  if (!leftTextArea || !rightTextArea) return

  const maxLines = Math.max(leftLines.length, rightLines.length)
  const lineHeight = 24

  // 创建渐变背景
  const leftGradients = []
  const rightGradients = []

  for (let i = 0; i < maxLines; i++) {
    const left = leftLines[i] || ''
    const right = rightLines[i] || ''
    const isEqual = left === right
    const color = isEqual ? '#dcfce7' : '#fee2e2'
    
    leftGradients.push(`${color} ${i * lineHeight}px, ${color} ${(i + 1) * lineHeight}px`)
    rightGradients.push(`${color} ${i * lineHeight}px, ${color} ${(i + 1) * lineHeight}px`)
  }

  // 应用渐变背景
  if (leftGradients.length > 0) {
    leftTextArea.style.background = `linear-gradient(${leftGradients.join(', ')})`
  } else {
    leftTextArea.style.background = 'none'
  }

  if (rightGradients.length > 0) {
    rightTextArea.style.background = `linear-gradient(${rightGradients.join(', ')})`
  } else {
    rightTextArea.style.background = 'none'
  }
}

// 监听文本变化
watch([leftText, rightText], () => {
  compareTexts()
}, { immediate: true })
</script>

<style scoped>
.text-compare {
  padding: 20px;
  height: calc(100vh - 180px);
}

.compare-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-section {
  flex: 1;
  display: flex;
  gap: 16px;
  min-height: 0;
}

.editor-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.editor-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.editor-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

.editor-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.line-numbers {
  width: 48px;
  background-color: #f8fafc;
  border-right: 1px solid #e5e7eb;
  color: #6b7280;
  font-family: monospace;
  font-size: 14px;
  user-select: none;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.line-number {
  height: 24px; /* 与文本编辑器行高一致 */
  line-height: 24px;
  padding-right: 12px;
  text-align: right;
}

.text-editor {
  width: 100%;
  height: 100%;
  padding: 0 12px;
  border: none;
  font-family: monospace;
  font-size: 14px;
  line-height: 24px;
  resize: none;
  outline: none;
  background-attachment: local !important; /* 确保背景跟随文本滚动 */
  overflow-y: scroll;
  white-space: pre;
}

/* 隐藏滚动条 */
.line-numbers::-webkit-scrollbar,
.text-editor::-webkit-scrollbar {
  width: 8px;
}

.line-numbers::-webkit-scrollbar-track,
.text-editor::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.line-numbers::-webkit-scrollbar-thumb,
.text-editor::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.line-numbers::-webkit-scrollbar-thumb:hover,
.text-editor::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.clear-button {
  padding: 4px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background-color: white;
  color: #6b7280;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.clear-button:hover {
  background-color: #f3f4f6;
  color: #4b5563;
}

@media (max-width: 768px) {
  .editor-section {
    flex-direction: column;
  }
}
</style> 