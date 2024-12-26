<template>
  <div class="text-compare">
    <h2 class="page-title">文本对比工具</h2>
    <div class="compare-container">
      <div v-if="diffMessage" class="diff-info" :class="{ 'same': diffMessage === '两段文本完全相同' }">
        {{ diffMessage }}
      </div>
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

// 查找字符级别的差异
const findCharDifferences = (str1, str2) => {
  const diffs = []
  const maxLength = Math.max(str1.length, str2.length)
  
  for (let i = 0; i < maxLength; i++) {
    if (str1[i] !== str2[i]) {
      diffs.push(i)
    }
  }
  return diffs
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
  let differences = [] // 存储差异信息

  for (let i = 0; i < maxLines; i++) {
    const left = leftLines[i] || ''
    const right = rightLines[i] || ''
    const isEqual = left === right
    const color = isEqual ? '#dcfce7' : '#fee2e2'
    
    if (!isEqual) {
      const charDiffs = findCharDifferences(left, right)
      if (charDiffs.length > 0) {
        differences.push({
          line: i + 1,
          position: charDiffs[0] + 1,
          leftText: left,
          rightText: right
        })
      }
    }
    
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

  // 显示差异信息
  if (differences.length > 0) {
    const diffInfo = differences.map(diff => {
      const leftChar = diff.leftText[diff.position - 1] || '空'
      const rightChar = diff.rightText[diff.position - 1] || '空'
      return `第 ${diff.line} 行, 第 ${diff.position} 个字符: "${leftChar}" ≠ "${rightChar}"`
    }).join('\n')
    
    // 更新差异信息显示
    diffMessage.value = diffInfo
  } else {
    diffMessage.value = differences.length === 0 && (leftText.value || rightText.value) 
      ? '两段文本完全相同'
      : ''
  }
}

// 添加差异信息的响应式引用
const diffMessage = ref('')

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

.diff-info {
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 6px;
  background-color: #fee2e2;
  color: #991b1b;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-line;
  max-height: 200px;
  overflow-y: auto;
}

.diff-info.same {
  background-color: #dcfce7;
  color: #166534;
}

/* 确保背景跟随滚动 */
.text-editor {
  background-attachment: local !important;
  background-repeat: no-repeat !important;
}

/* 优化滚动条样式 */
.diff-info::-webkit-scrollbar {
  width: 8px;
}

.diff-info::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.diff-info::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.diff-info::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style> 