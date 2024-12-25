<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p class="copyright">© 2024 工具集合</p>
      <div class="footer-links">
        <a href="https://kenvie.com" class="footer-link" target="_blank">作者</a>
        <a href="#" class="footer-link">关于</a>
        <a href="#" class="footer-link">反馈</a>
        <a href="https://github.com/cpt-kenvie/Web-Tools" class="footer-link" target="_blank">GitHub</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.app-footer {
  height: 60px;
  width: 100%;
  background-color: #ffffff;
  border-top: 1px solid #e5e7eb;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.copyright {
  color: #6b7280;
  font-size: 0.875rem;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-link {
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #2563eb;
}
</style> 