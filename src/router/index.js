import { createRouter, createWebHistory } from 'vue-router'
import {
  CommandLineIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  ClockIcon,
  ArrowPathIcon,
  KeyIcon,
  DocumentDuplicateIcon,
  DocumentMagnifyingGlassIcon,
  PhotoIcon,
  ArrowsPointingInIcon,
  QrCodeIcon
} from '@heroicons/vue/24/outline'

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
      name: 'JsonFormatter',
      component: () => import('../views/dev/JsonFormatter.vue'),
      meta: {
        title: 'JSON 格式化',
        icon: CodeBracketIcon,
        group: 'dev'
      }
    },
    {
      path: '/dev/regex-tester',
      name: 'RegexTester',
      component: () => import('../views/dev/RegexTester.vue'),
      meta: {
        title: '正则表达式测试',
        icon: DocumentTextIcon,
        group: 'dev'
      }
    },
    {
      path: '/dev/json-validator',
      name: 'JsonValidator',
      component: () => import('../views/dev/JsonValidator.vue'),
      meta: {
        title: 'JSON 校验',
        icon: DocumentDuplicateIcon,
        group: 'dev'
      }
    },
    {
      path: '/dev/api-tester',
      name: 'ApiTester',
      component: () => import('../views/dev/ApiTester.vue'),
      meta: {
        title: 'API 调试',
        icon: CommandLineIcon,
        group: 'dev'
      }
    },
    {
      path: '/dev/base64',
      name: 'Base64',
      component: () => import('../views/dev/Base64.vue'),
      meta: {
        title: 'Base64 转换',
        icon: ArrowPathIcon,
        group: 'dev'
      }
    },
    {
      path: '/dev/crypto',
      name: 'CryptoTool',
      component: () => import('../views/dev/CryptoTool.vue'),
      meta: {
        title: '加密解密',
        icon: KeyIcon,
        group: 'dev'
      }
    },
    // 其他工具路由
    {
      path: '/tools/time-converter',
      name: 'TimeConverter',
      component: () => import('../views/tools/TimeConverter.vue'),
      meta: {
        title: '时间转换',
        icon: ClockIcon,
        group: 'tools'
      }
    },
    {
      path: '/tools/text-compare',
      name: 'TextCompare',
      component: () => import('../views/tools/TextCompare.vue'),
      meta: {
        title: '文本对比',
        icon: DocumentMagnifyingGlassIcon,
        group: 'tools'
      }
    },
    {
      path: '/tools/qrcode',
      name: 'QRCodeGenerator',
      component: () => import('../views/tools/QRCodeGenerator.vue'),
      meta: {
        title: '二维码解码',
        icon: QrCodeIcon,
        group: 'tools'
      }
    },
    // 图像工具路由
    {
      path: '/image/converter',
      name: 'ImageConverter',
      component: () => import('../views/image/ImageConverter.vue'),
      meta: {
        title: '图片格式转换',
        icon: PhotoIcon,
        group: 'image'
      }
    },
    {
      path: '/image/compressor',
      name: 'ImageCompressor',
      component: () => import('../views/image/ImageCompressor.vue'),
      meta: {
        title: '图片压缩',
        icon: ArrowsPointingInIcon,
        group: 'image'
      }
    }
  ]
})

export default router 