<template>
  <div class="app-container">
    <AppHeader />
    <div class="main-container">
      <AppSidebar />
      <main class="main-content">
        <router-view></router-view>
      </main>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './components/layout/AppHeader.vue'
import AppSidebar from './components/layout/AppSidebar.vue'
import AppFooter from './components/layout/AppFooter.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  width: 100%;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.main-container {
  flex: 1;
  display: flex;
  width: 100%;
  overflow: hidden;
}

.main-content {
  flex: 1;
  padding: 24px;
  background-color: #f9fafb;
  overflow-y: auto;
  height: calc(100vh - 120px);
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
