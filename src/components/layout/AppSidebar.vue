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
            <ChevronDownIcon 
              class="collapse-icon"
              :class="{ 'is-collapsed': collapsedGroups[group.name] }"
            />
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
    <!-- 移动端菜单开关按钮 -->
    <button class="mobile-toggle" @click="toggleMobileMenu">
      <Bars3Icon v-if="!isOpen" class="toggle-icon" />
      <XMarkIcon v-else class="toggle-icon" />
    </button>
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
  width: 280px;
  background-color: #ffffff;
  height: calc(100vh - 120px);
  flex-shrink: 0;
  overflow-y: auto;
  border-right: 1px solid #e5e7eb;
  position: sticky;
  left: 0;
  transition: all 0.3s ease;
}

.sidebar-content {
  padding: 16px 0;
}

.menu-groups {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.menu-group {
  display: flex;
  flex-direction: column;
}

.menu-group-title {
  padding: 0 24px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}

.menu-items {
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: 500px; /* 足够大的高度以容纳所有项目 */
}

.menu-items.is-collapsed {
  max-height: 0;
}

.collapse-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.collapse-icon.is-collapsed {
  transform: rotate(-90deg);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 24px;
  color: #4b5563;
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.menu-icon {
  width: 20px;
  height: 20px;
}

.menu-item:hover {
  background-color: #f3f4f6;
  color: #2563eb;
}

.menu-item.active {
  background-color: #eff6ff;
  color: #2563eb;
  border-left-color: #2563eb;
}

.mobile-toggle {
  display: none;
  position: fixed;
  top: 70px;
  left: 20px;
  padding: 8px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  z-index: 1001;
}

.toggle-icon {
  width: 24px;
  height: 24px;
  color: #4b5563;
}

@media (max-width: 768px) {
  .app-sidebar {
    width: 240px;
    position: fixed;
    z-index: 1000;
    transform: translateX(-100%);
  }

  .app-sidebar.open {
    transform: translateX(0);
  }

  .mobile-toggle {
    display: block;
  }
}
</style> 