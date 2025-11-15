<template>
    <div class="sidebar">
      <div class="logo">
        <i class="fas fa-hospital"></i>
        <h1>智慧醫院系統</h1>
      </div>
      
      <router-link 
        v-for="item in navItems" 
        :key="item.name"
        :to="item.path"
        class="nav-item"
        :class="{ active: $route.name === item.name }"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Sidebar',
    data() {
      return {
        navItems: [
          { name: 'Dashboard', path: '/', icon: 'fas fa-tachometer-alt', label: '首頁' },
          { name: 'Patients', path: '/patients', icon: 'fas fa-user-injured', label: '病人管理' },
          { name: 'Appointments', path: '/appointments', label: '門診管理', icon: 'fas fa-user-injured' },
          { name: 'Doctors', path: '/doctors', icon: 'fas fa-user-md', label: '醫生管理' },
          { name: 'Beds', path: '/beds', icon: 'fas fa-user-md', label: '病床管理' },
          // { name: 'BedDetails', path: '/bed-details', icon: 'fas fa-user-md', label: '病床詳情' },
          { name: 'MedicalRecords', path: '/medical-records', icon: 'fas fa-user-md', label: '病歷管理'},
          { name: 'SurgeryRooms', path: '/surgery-rooms', icon: 'fas fa-user-md', label: '手術室管理'}
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .sidebar {
    width: var(--sidebar-width);
    background: linear-gradient(180deg, var(--primary), var(--primary-dark));
    color: white;
    padding: 20px 0;
    position: fixed;
    height: 100vh;
    overflow-y: auto;
  }
  
  .logo {
    display: flex;
    align-items: center;
    padding: 0 20px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    margin-bottom: 20px;
  }
  
  .logo i {
    font-size: 28px;
    margin-right: 10px;
  }
  
  .logo h1 {
    font-size: 20px;
    font-weight: 600;
  }
  
  .nav-item {
    padding: 12px 20px;
    display: flex;
    align-items: center;
    text-decoration: none;
    color: white;
    transition: all 0.2s;
    border-left: 4px solid transparent;
  }
  
  .nav-item:hover, .nav-item.active {
    background-color: rgba(255,255,255,0.1);
    border-left: 4px solid white;
  }
  
  .nav-item i {
    margin-right: 10px;
    width: 20px;
    text-align: center;
  }
  
  @media (max-width: 768px) {
    .sidebar {
      width: 70px;
    }
    .logo h1, .nav-item span {
      display: none;
    }
    .nav-item {
      justify-content: center;
    }
    .nav-item i {
      margin-right: 0;
      font-size: 20px;
    }
  }
  </style>