<template>
  <div id="app">
    <div class="app-container">
      <Sidebar />
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'App',
  components: {
    Sidebar
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --secondary: #10b981;
  --light: #f8fafc;
  --dark: #1e293b;
  --sidebar-width: 250px;
}

#app {
  background-color: #f1f5f9;
  min-height: 100vh;
}

.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 70px;
  }
}
</style>