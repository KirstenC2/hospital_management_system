<template>
  <div class="patients-view">
    <div class="header">
      <h1>病人管理</h1>
      <div class="header-actions">
        <button class="btn btn-primary" @click="showAddPatientModal = true">
          <i class="fas fa-plus"></i> 新增病人
        </button>
        <button class="btn btn-outline" @click="fetchPatients">
          <i class="fas fa-sync-alt"></i> 刷新
        </button>
      </div>
    </div>

    <div class="content">
      <!-- Patient List Table -->
      <div class="data-section">
        <div class="section-header">
          <div class="section-title">
            <i class="fas fa-list"></i>
            <span>病人列表</span>
          </div>
        </div>

        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>姓名</th>
                <th>性別</th>
                <th>年齡</th>
                <th>電話</th>
                <th>地址</th>
                <th>緊急聯絡人</th>
                <th>緊急電話</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="patient in filteredPatients" :key="patient.id">
                <td>{{ patient.id }}</td>
                <td>{{ patient.name }}</td>
                <td>{{ patient.gender }}</td>
                <td>{{ patient.age }}</td>
                <td>{{ patient.phone || '-' }}</td>
                <td>{{ patient.address || '-' }}</td>
                <td>{{ patient.emergencyContact || '-' }}</td>
                <td>{{ patient.emergencyPhone || '-' }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn btn-sm btn-outline" @click="editPatient(patient)">
                      編輯
                    </button>
                    <button class="btn btn-sm btn-outline" @click="openPatientInNewTab(patient)">
                      查看
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PatientsService from '@/services/patients_api'
import type { Inpatient } from '@/services/patients_api'
import { useRouter } from 'vue-router'
const router = useRouter()
const selectedStatus = ref<string | 'all'>('all')
const showAddPatientModal = ref(false)

// Update the fetch function
const patients = ref<Inpatient[]>([]);  // Update the type to include both

const fetchPatients = async () => {
  try {
    const response = await PatientsService.getAllPatients();
    patients.value = response.map(patient => ({
      ...patient,
      id: Number(patient.id)
    }));
  } catch (error) {
    console.error('Failed to fetch patients:', error);
  }
};
// Update the filteredPatients computed property
const filteredPatients = computed(() => {
  if (selectedStatus.value === 'all') return patients.value
  return patients.value.filter(patient => patient.status === selectedStatus.value)
})

// Update the status options if needed
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  // Add more status options as needed
]

// Update the view/edit functions
const viewPatient = (patient: Inpatient) => {
  console.log('View patient:', patient)
  // Implement view logic
}

const editPatient = (patient: Inpatient) => {
  console.log('編輯病人 ID:', patient.id);
  
  // 💡 關鍵修改：使用 router.push 導航到編輯頁面
  router.push({
    name: 'PatientEdit', // 假設您的編輯頁面路由名稱為 'PatientEdit'
    params: { id: patient.id } // 傳遞病人 ID 作為路由參數
  });
}

const openPatientInNewTab = (patient: Inpatient) => {
  router.push({
    name: 'PatientDetail',
    params: { id: patient.id }
  });
}

// Initialize on mount
onMounted(() => {
  fetchPatients()
})
</script>

<style scoped>
.patients-view {
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


.status {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-inpatient {
  background-color: #fef3c7;
  color: #d97706;
}

.status-discharged {
  background-color: #dcfce7;
  color: #16a34a;
}

.waiting-section {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--dark);
}

.text-warning {
  color: #f59e0b;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.total .stat-icon {
  background-color: var(--primary);
  border-left-color: var(--primary);
}

.inpatient .stat-icon {
  background-color: var(--primary);
  border-left-color: var(--primary);
}

.occupied .stat-icon {
  background-color: #ef4444;
  border-left-color: #ef4444;
}

.available .stat-icon {
  background-color: var(--secondary);
  border-left-color: var(--secondary);
}

.maintenance .stat-icon {
  background-color: #f59e0b;
  border-left-color: #f59e0b;
}

.waiting .stat-icon {
  background-color: #f59e0b;
  border-left-color: #f59e0b;
}

.discharged .stat-icon {
  background-color: var(--secondary);
  border-left-color: var(--secondary);
}


.waiting-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 15px;
}

.waiting-card {
  background: #fff8e1;
  border: 1px solid #fef3c7;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
}

.waiting-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.patient-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.patient-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--dark);
}

.patient-id {
  font-size: 12px;
  color: #64748b;
  background: #e2e8f0;
  padding: 2px 6px;
  border-radius: 4px;
}

.patient-details {
  margin-bottom: 15px;
}

.patient-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 表格樣式增強 */
.patient-name-cell .name {
  font-weight: 600;
  color: var(--dark);
}

.patient-name-cell .contact {
  font-size: 12px;
  color: #64748b;
}

.diagnosis-cell .diagnosis {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bed-number {
  background: #dcfce7;
  color: var(--secondary);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.no-bed {
  color: #64748b;
  font-style: italic;
}

.status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-waiting {
  background: #fef3c7;
  color: #d97706;
}

.status-inpatient {
  background: #dbeafe;
  color: var(--primary);
}

.status-discharged {
  background: #dcfce7;
  color: var(--secondary);
}

.action-buttons {
  display: flex;
  gap: 6px;
}

/* 表單行佈局 */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .waiting-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .patient-actions {
    flex-direction: column;
  }


  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }


}

/* 響應式設計 */
@media (max-width: 768px) {
  .status-filter {
    flex-direction: column;
    gap: 10px;
    padding: 15px;
  }

  .filter-title {
    min-width: auto;
    padding-top: 0;
  }

  .filter-buttons {
    justify-content: center;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .filter-buttons {
    flex-direction: column;
  }

  .filter-btn {
    text-align: center;
  }

}
</style>