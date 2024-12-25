import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dev/json-formatter'
    },
    // 开发工具路由
    {
      path: '/dev/json-formatter',
      component: () => import('../views/dev/JsonFormatter.vue')
    },
    {
      path: '/dev/regex-tester',
      component: () => import('../views/dev/RegexTester.vue')
    },
    {
      path: '/dev/json-validator',
      component: () => import('../views/dev/JsonValidator.vue')
    },
    {
      path: '/dev/api-tester',
      component: () => import('../views/dev/ApiTester.vue')
    },
    {
      path: '/dev/base64',
      component: () => import('../views/dev/Base64.vue')
    },
    {
      path: '/dev/crypto',
      component: () => import('../views/dev/CryptoTool.vue')
    },
    // 其他工具路由
    {
      path: '/tools/time-converter',
      component: () => import('../views/tools/TimeConverter.vue')
    },
    {
      path: '/tools/json-formatter',
      component: () => import('../views/tools/JsonFormatter.vue')
    }
  ]
})

export default router 