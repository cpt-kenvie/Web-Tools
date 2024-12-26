<template>
  <aside class="app-sidebar" :class="{ open: isOpen }">
    <div class="sidebar-content">
      <div class="menu-groups">
        <div v-for="group in menuGroups" :key="group.name" class="menu-group">
          <div 
            class="menu-group-title" 
            @click="toggleGroup(group.name)"
            :class="{ 'is-collapsed': collapsedGroups[group.name] }"
          >
            <span>{{ group.title }}</span>
            <ChevronDownIcon class="collapse-icon" />
          </div>
          <div 
            class="menu-items"
            :class="{ 'is-collapsed': collapsedGroups[group.name] }"
          >
            <router-link
              v-for="route in group.routes"
              :key="route.path"
              :to="route.path"
              class="menu-item"
              :class="{ active: $route.path === route.path }"
            >
              <component :is="route.meta.icon" class="menu-icon" />
              <span>{{ route.meta.title }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const isOpen = ref(false)
const collapsedGroups = ref({})

const menuGroups = computed(() => {
  const routes = router.options.routes
  const groups = {
    dev: {
      name: 'dev',
      title: '开发工具',
      routes: []
    },
    tools: {
      name: 'tools',
      title: '实用工具',
      routes: []
    },
    image: {
      name: 'image',
      title: '图像工具',
      routes: []
    }
  }

  routes.forEach(route => {
    if (route.meta?.group) {
      groups[route.meta.group].routes.push(route)
    }
  })

  return Object.values(groups)
})

const toggleGroup = (groupName) => {
  collapsedGroups.value[groupName] = !collapsedGroups.value[groupName]
}

const toggleMobileMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.app-sidebar {
  width: 240px;
  background-color: #ffffff;
  height: calc(100vh - 60px);
  border-right: 1px solid #e5e7eb;
  position: sticky;
  left: 0;
  transition: all 0.2s ease;
}

.sidebar-content {
  padding: 12px 0;
}

.menu-groups {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-group {
  display: flex;
  flex-direction: column;
  padding: 4px 0;
}

.menu-group-title {
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  transition: color 0.15s ease;
}

.menu-group-title:hover {
  color: #4b5563;
}

.collapse-icon {
  width: 14px;
  height: 14px;
  color: #9ca3af;
  transition: transform 0.2s ease;
}

.is-collapsed .collapse-icon {
  transform: rotate(-90deg);
}

.menu-items {
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  overflow: hidden;
  max-height: 500px;
}

.menu-items.is-collapsed {
  max-height: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  color: #374151;
  text-decoration: none;
  font-size: 13px;
  transition: all 0.15s ease;
  position: relative;
}

.menu-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
  flex-shrink: 0;
  transition: color 0.15s ease;
}

.menu-item:hover {
  background-color: #f9fafb;
}

.menu-item:hover .menu-icon {
  color: #2563eb;
}

.menu-item.active {
  color: #2563eb;
  background-color: #eff6ff;
}

.menu-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #2563eb;
}

.menu-item.active .menu-icon {
  color: #2563eb;
}

/* 自定义滚动条 */
.app-sidebar::-webkit-scrollbar {
  width: 4px;
}

.app-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.app-sidebar::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 4px;
}

.app-sidebar:hover::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
}

@media (max-width: 768px) {
  .app-sidebar {
    position: fixed;
    z-index: 1000;
    transform: translateX(-100%);
  }

  .app-sidebar.open {
    transform: translateX(0);
  }
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .app-sidebar {
    background-color: #111827;
    border-right-color: #1f2937;
  }

  .menu-group-title {
    color: #9ca3af;
  }

  .menu-group-title:hover {
    color: #d1d5db;
  }

  .menu-item {
    color: #e5e7eb;
  }

  .menu-icon {
    color: #6b7280;
  }

  .menu-item:hover {
    background-color: #1f2937;
  }

  .menu-item.active {
    background-color: #1e40af20;
  }

  .menu-item:hover .menu-icon,
  .menu-item.active .menu-icon {
    color: #3b82f6;
  }
}
</style> 