<template>
  <aside class="app-sidebar">
    <div class="sidebar-content">
      <template v-for="item in menuItems" :key="item.key">
        <div class="menu-group">
          <div class="menu-group-title">{{ item.title }}</div>
          <template v-for="child in item.children" :key="child.key">
            <router-link :to="child.path" class="menu-item">
              {{ child.title }}
            </router-link>
          </template>
        </div>
      </template>
    </div>
  </aside>
</template>

<script setup>
import { menuItems } from '@/config/menuConfig'
</script>

<style scoped>
.app-sidebar {
  width: 240px;
  background-color: #ffffff;
  height: calc(100vh - 120px);
  flex-shrink: 0;
  overflow-y: auto;
  border-right: 1px solid #e5e7eb;
  position: sticky;
  left: 0;
}

.sidebar-content {
  padding: 16px 0;
}

.menu-group {
  margin-bottom: 24px;
}

.menu-group-title {
  padding: 0 24px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.menu-item {
  display: block;
  padding: 10px 24px;
  color: #4b5563;
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.menu-item:hover {
  background-color: #f3f4f6;
  color: #2563eb;
}

.router-link-active {
  background-color: #eff6ff;
  color: #2563eb;
  border-left-color: #2563eb;
}
</style> 