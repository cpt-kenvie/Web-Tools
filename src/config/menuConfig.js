export const menuItems = [
  {
    title: '开发工具',
    key: 'devtools',
    children: [
      {
        title: 'JSON 格式化',
        key: 'jsonFormatter',
        path: '/dev/json-formatter'
      },
      {
        title: '正则表达式测试',
        key: 'regexTester',
        path: '/dev/regex-tester'
      },
      {
        title: 'JSON 校验与解析',
        key: 'jsonValidator',
        path: '/dev/json-validator'
      },
      {
        title: 'API 调试工具',
        key: 'apiTester',
        path: '/dev/api-tester'
      },
      {
        title: 'Base64 转换',
        key: 'base64',
        path: '/dev/base64'
      },
      {
        title: '加密解密工具',
        key: 'crypto',
        path: '/dev/crypto'
      }
    ]
  },
  {
    title: '常用工具',
    key: 'common',
    children: [
      {
        title: '时间转换',
        key: 'timeConverter',
        path: '/tools/time-converter'
      },
      {
        title: 'JSON格式化',
        key: 'jsonFormatter',
        path: '/tools/json-formatter'
      }
    ]
  }
] 