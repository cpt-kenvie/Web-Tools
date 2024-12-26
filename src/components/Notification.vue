<template>
  <teleport to="body">
    <div v-if="visible" class="notification" :class="type" @click="close">
      <span v-if="type === 'success'">✅ {{ message }}</span>
      <span v-if="type === 'error'">❌ {{ message }}</span>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'success'
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const visible = ref(false)

watch(() => props.message, (newMessage) => {
  if (newMessage) {
    visible.value = true
    setTimeout(() => {
      visible.value = false
    }, props.duration)
  }
})

const close = () => {
  visible.value = false
}
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px;
  border-radius: 8px;
  color: white;
  z-index: 1000;
  transition: opacity 0.3s ease;
}

.notification.success {
  background-color: #4caf50; /* 绿色 */
}

.notification.error {
  background-color: #f44336; /* 红色 */
}
</style> 