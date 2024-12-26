import { ref } from 'vue'

const notificationMessage = ref('')
const notificationType = ref('success')

// 定义通知函数
const showSuccessNotification = (message) => {
  notificationMessage.value = message
  notificationType.value = 'success'
}

const showErrorNotification = (message) => {
  notificationMessage.value = message
  notificationType.value = 'error'
}

// 导出函数和状态
export {
  notificationMessage,
  notificationType,
  showSuccessNotification,
  showErrorNotification
} 