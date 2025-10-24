<template>
    <div class="doctors-view">
      <div class="header">
        <h1>醫生管理</h1>
        <button class="btn btn-primary">
          <i class="fas fa-plus"></i> 新增醫生
        </button>
      </div>
  
      <div class="content">
        <div class="doctors-grid">
          <div v-for="doctor in doctors" :key="doctor.id" class="doctor-card">
            <div class="doctor-avatar">
              {{ doctor.name.charAt(0) }}
            </div>
            <div class="doctor-info">
              <h3>{{ doctor.name }}</h3>
              <p class="specialty">{{ doctor.specialty }}</p>
              <p class="department">{{ doctor.department }}</p>
              <div class="doctor-stats">
                <div class="stat">
                  <span class="stat-value">{{ doctor.patients }}</span>
                  <span class="stat-label">病人數</span>
                </div>
                <div class="stat">
                  <span class="stat-value">{{ doctor.experience }}</span>
                  <span class="stat-label">年經驗</span>
                </div>
              </div>
            </div>
            <div class="doctor-actions">
              <button class="btn btn-outline" @click="viewDoctor(doctor)">
                查看資料
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  
  interface Doctor {
    id: string
    name: string
    specialty: string
    department: string
    patients: number
    experience: number
  }
  
  export default defineComponent({
    name: 'DoctorsView',
    data() {
      return {
        doctors: [
          {
            id: 'D001',
            name: '王醫生',
            specialty: '心臟內科',
            department: '內科',
            patients: 45,
            experience: 15
          },
          {
            id: 'D002',
            name: '陳醫生',
            specialty: '兒科',
            department: '兒科',
            patients: 38,
            experience: 12
          },
          {
            id: 'D003',
            name: '林醫生',
            specialty: '骨科',
            department: '外科',
            patients: 52,
            experience: 20
          },
          {
            id: 'D004',
            name: '吳醫生',
            specialty: '婦產科',
            department: '婦產科',
            patients: 29,
            experience: 8
          }
        ] as Doctor[]
      }
    },
    methods: {
      viewDoctor(doctor: Doctor) {
        alert(`查看醫生: ${doctor.name} - ${doctor.specialty}`)
      }
    }
  })
  </script>
  
  <style scoped>
  .doctors-view {
    padding: 20px;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }
  
  .header h1 {
    color: var(--dark);
    font-size: 28px;
  }
  
  .btn {
    padding: 10px 20px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }
  
  .btn-primary {
    background-color: var(--primary);
    color: white;
  }
  
  .btn-primary:hover {
    background-color: var(--primary-dark);
  }
  
  .btn-outline {
    background-color: transparent;
    border: 1px solid var(--primary);
    color: var(--primary);
    padding: 6px 12px;
  }
  
  .btn-outline:hover {
    background-color: var(--primary);
    color: white;
  }
  
  .doctors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .doctor-card {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .doctor-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: var(--primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  
  .doctor-info h3 {
    margin-bottom: 5px;
    color: var(--dark);
  }
  
  .specialty {
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 5px;
  }
  
  .department {
    color: #64748b;
    margin-bottom: 15px;
  }
  
  .doctor-stats {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin: 15px 0;
  }
  
  .stat {
    display: flex;
    flex-direction: column;
  }
  
  .stat-value {
    font-size: 20px;
    font-weight: bold;
    color: var(--dark);
  }
  
  .stat-label {
    font-size: 12px;
    color: #64748b;
  }
  
  .doctor-actions {
    margin-top: 10px;
  }
  </style>