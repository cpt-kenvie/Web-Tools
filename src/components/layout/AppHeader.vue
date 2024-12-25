<template>
  <header class="app-header">
    <div class="header-left">
      <img src="https://img.keai.cool/2024/07/1/668a957f2a02f.png" alt="logo" class="logo">
    </div>
    <div class="header-right">
      <div class="theme-switch">
        <!-- 后续可以添加主题切换按钮 -->
      </div>
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped>
.app-header {
  height: 60px;
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  height: 32px;
  width: auto;
  margin-left: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style> 