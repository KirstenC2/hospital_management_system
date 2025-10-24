<template>
    <div class="patients-view">
      <div class="header">
        <h1>病人管理</h1>
        <div class="header-actions">
          <button class="btn btn-primary" @click="showAddPatientModal = true">
            <i class="fas fa-plus"></i> 新增病人
          </button>
          <button class="btn btn-outline" @click="refreshPatients">
            <i class="fas fa-sync-alt"></i> 刷新
          </button>
        </div>
      </div>
  

  
      <div class="content">
        <!-- 統計卡片 -->
        <div class="stats-cards">
          <div class="stat-card total">
            <div class="stat-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalPatients }}</div>
              <div class="stat-label">總病人數</div>
            </div>
          </div>
          <div class="stat-card inpatient">
            <div class="stat-icon">
              <i class="fas fa-bed"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.inpatientCount }}</div>
              <div class="stat-label">住院中</div>
            </div>
          </div>
          <div class="stat-card waiting">
            <div class="stat-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.waitingCount }}</div>
              <div class="stat-label">等待床位</div>
            </div>
          </div>
          <div class="stat-card discharged">
            <div class="stat-icon">
              <i class="fas fa-home"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.dischargedCount }}</div>
              <div class="stat-label">已出院</div>
            </div>
          </div>
        </div>
  
        <!-- 等待床位列表 -->
        <div v-if="waitingPatients.length > 0" class="waiting-section">
          <div class="section-header">
            <div class="section-title">
              <i class="fas fa-clock text-warning"></i>
              <span>等待床位病人 ({{ waitingPatients.length }})</span>
            </div>
            <button class="btn btn-primary btn-sm" @click="assignBedsToWaiting">
              <i class="fas fa-bed"></i>
              批量分配床位
            </button>
          </div>
  
          <div class="waiting-grid">
            <div 
              v-for="patient in waitingPatients" 
              :key="patient.id"
              class="waiting-card"
            >
              <div class="patient-info">
                <div class="patient-header">
                  <div class="patient-name">{{ patient.name }}</div>
                  <div class="patient-id">病歷號: {{ patient.id }}</div>
                </div>
                
                <div class="patient-details">
                  <div class="detail-item">
                    <i class="fas fa-venus-mars"></i>
                    <span>{{ patient.gender }} / {{ patient.age }}歲</span>
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-stethoscope"></i>
                    <span>{{ patient.diagnosis }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-user-md"></i>
                    <span>主治: {{ patient.attendingDoctor }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-calendar-plus"></i>
                    <span>登記: {{ patient.registrationDate }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>等待: {{ patient.waitingDays }}天</span>
                  </div>
                </div>
  
                <div class="patient-actions">
                  <button 
                    class="btn btn-primary btn-sm"
                    @click="assignBed(patient)"
                  >
                    <i class="fas fa-bed"></i>
                    分配床位
                  </button>
                  <button 
                    class="btn btn-outline btn-sm"
                    @click="editPatient(patient)"
                  >
                    <i class="fas fa-edit"></i>
                    編輯
                  </button>
                  <button 
                    class="btn btn-danger btn-sm"
                    @click="cancelRegistration(patient)"
                  >
                    <i class="fas fa-times"></i>
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

              <!-- 狀態篩選 -->
      <div class="status-filter">
        <div class="filter-title">狀態篩選:</div>
        <div class="filter-buttons">
          <button 
            v-for="status in statusOptions" 
            :key="status.value"
            class="filter-btn"
            :class="{ active: selectedStatus === status.value }"
            @click="selectStatus(status.value)"
          >
            {{ status.label }}
          </button>
          <button 
            class="filter-btn"
            :class="{ active: selectedStatus === 'all' }"
            @click="selectStatus('all')"
          >
            全部狀態
          </button>
        </div>
      </div>
  
        <!-- 病人表格 -->
        <div class="data-section">
          <div class="section-header">
            <div class="section-title">
              <i class="fas fa-list"></i>
              <span>病人列表</span>
            </div>
            <div class="table-actions">
              <button class="btn btn-outline btn-sm" @click="exportPatients">
                <i class="fas fa-download"></i>
                匯出
              </button>
            </div>
          </div>
  
          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>病歷號</th>
                  <th>姓名</th>
                  <th>性別</th>
                  <th>年齡</th>
                  <th>主治醫生</th>
                  <th>診斷</th>
                  <th>狀態</th>
                  <th>床位</th>
                  <th>入院日期</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="patient in filteredPatients" :key="patient.id">
                  <td>{{ patient.id }}</td>
                  <td class="patient-name-cell">
                    <div class="name">{{ patient.name }}</div>
                    <div class="contact" v-if="patient.phone">{{ patient.phone }}</div>
                  </td>
                  <td>{{ patient.gender }}</td>
                  <td>{{ patient.age }}歲</td>
                  <td>{{ patient.attendingDoctor }}</td>
                  <td class="diagnosis-cell">
                    <span class="diagnosis">{{ patient.diagnosis }}</span>
                  </td>
                  <td>
                    <span class="status" :class="`status-${patient.status}`">
                      {{ getStatusText(patient.status) }}
                    </span>
                  </td>
                  <td>
                    <span v-if="patient.bedNumber" class="bed-number">
                      {{ patient.bedNumber }}
                    </span>
                    <span v-else class="no-bed">未分配</span>
                  </td>
                  <td>{{ patient.admissionDate || '-' }}</td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn btn-sm btn-outline" @click="viewPatient(patient)">
                        查看
                      </button>
                      <button class="btn btn-sm btn-outline" @click="editPatient(patient)">
                        編輯
                      </button>
                      <button 
                        v-if="patient.status === 'inpatient'" 
                        class="btn btn-sm btn-warning"
                        @click="dischargePatient(patient)"
                      >
                        出院
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      <!-- 新增病人模態框 -->
      <div v-if="showAddPatientModal" class="modal-overlay" @click="showAddPatientModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>新增病人</h3>
            <button class="close-btn" @click="showAddPatientModal = false">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addNewPatient">
              <div class="form-row">
                <div class="form-group">
                  <label>姓名:</label>
                  <input v-model="newPatient.name" type="text" required>
                </div>
                <div class="form-group">
                  <label>性別:</label>
                  <select v-model="newPatient.gender" required>
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
              </div>
  
              <div class="form-row">
                <div class="form-group">
                  <label>年齡:</label>
                  <input v-model="newPatient.age" type="number" min="0" max="120" required>
                </div>
                <div class="form-group">
                  <label>電話:</label>
                  <input v-model="newPatient.phone" type="tel">
                </div>
              </div>
  
              <div class="form-group">
                <label>診斷:</label>
                <input v-model="newPatient.diagnosis" type="text" required>
              </div>
  
              <div class="form-row">
                <div class="form-group">
                  <label>主治醫生:</label>
                  <select v-model="newPatient.attendingDoctor" required>
                    <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.name">
                      {{ doctor.name }} - {{ doctor.specialty }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>狀態:</label>
                  <select v-model="newPatient.status" required>
                    <option value="waiting">等待床位</option>
                    <option value="inpatient">直接住院</option>
                  </select>
                </div>
              </div>
  
              <div class="form-group" v-if="newPatient.status === 'inpatient'">
                <label>分配床位:</label>
                <select v-model="newPatient.bedNumber">
                  <option value="">自動分配</option>
                  <option v-for="bed in availableBeds" :key="bed.id" :value="bed.bedNumber">
                    {{ bed.bedNumber }} - {{ bed.room }} ({{ bed.department }})
                  </option>
                </select>
              </div>
  
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">新增</button>
                <button type="button" class="btn btn-outline" @click="showAddPatientModal = false">
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  
  interface Patient {
    id: string
    name: string
    gender: string
    age: number
    phone?: string
    diagnosis: string
    attendingDoctor: string
    status: 'waiting' | 'inpatient' | 'discharged'
    bedNumber?: string
    admissionDate?: string
    registrationDate: string
    waitingDays: number
  }
  
  interface Doctor {
    id: string
    name: string
    specialty: string
  }
  
  interface Bed {
    id: string
    bedNumber: string
    room: string
    department: string
    status: string
  }
  
  // 狀態選項
  const statusOptions = [
    { value: 'waiting', label: '等待床位' },
    { value: 'inpatient', label: '住院中' },
    { value: 'discharged', label: '已出院' }
  ]
  
  // 醫生數據
  const doctors = [
    { id: '1', name: '王大明', specialty: '內科' },
    { id: '2', name: '陳小美', specialty: '外科' },
    { id: '3', name: '林志雄', specialty: '兒科' },
    { id: '4', name: '吳美麗', specialty: '婦產科' },
    { id: '5', name: '張偉強', specialty: '骨科' },
    { id: '6', name: '劉心怡', specialty: '心臟科' }
  ]
  
  // 模擬可用床位數據
  const availableBeds = ref<Bed[]>([
    { id: '1', bedNumber: 'A102', room: '101房', department: '內科', status: 'available' },
    { id: '2', bedNumber: 'A103', room: '101房', department: '內科', status: 'available' },
    { id: '3', bedNumber: 'B202', room: '201房', department: '外科', status: 'available' },
    { id: '4', bedNumber: 'C302', room: '301房', department: '兒科', status: 'available' },
    { id: '5', bedNumber: 'D401', room: '401房', department: '心臟科', status: 'available' }
  ])
  
  // 模擬病人數據
  const patients = ref<Patient[]>([
    {
      id: 'P001',
      name: '張小明',
      gender: '男',
      age: 45,
      phone: '0912-345-678',
      diagnosis: '高血壓',
      attendingDoctor: '王大明',
      status: 'inpatient',
      bedNumber: 'A101',
      admissionDate: '2024-01-15',
      registrationDate: '2024-01-15',
      waitingDays: 0
    },
    {
      id: 'P002',
      name: '李美華',
      gender: '女',
      age: 28,
      phone: '0933-456-789',
      diagnosis: '膽囊切除術後',
      attendingDoctor: '陳小美',
      status: 'inpatient',
      bedNumber: 'B201',
      admissionDate: '2024-01-16',
      registrationDate: '2024-01-16',
      waitingDays: 0
    },
    {
      id: 'P003',
      name: '陳大勇',
      gender: '男',
      age: 55,
      diagnosis: '股骨骨折',
      attendingDoctor: '張偉強',
      status: 'waiting',
      registrationDate: '2024-01-17',
      waitingDays: 1
    },
    {
      id: 'P004',
      name: '王小寶',
      gender: '男',
      age: 6,
      diagnosis: '急性支氣管炎',
      attendingDoctor: '林志雄',
      status: 'waiting',
      registrationDate: '2024-01-18',
      waitingDays: 0
    },
    {
      id: 'P005',
      name: '黃小玉',
      gender: '女',
      age: 30,
      diagnosis: '產後護理',
      attendingDoctor: '吳美麗',
      status: 'inpatient',
      bedNumber: 'G301',
      admissionDate: '2024-01-17',
      registrationDate: '2024-01-17',
      waitingDays: 0
    },
    {
      id: 'P006',
      name: '趙國強',
      gender: '男',
      age: 68,
      diagnosis: '冠狀動脈疾病',
      attendingDoctor: '劉心怡',
      status: 'discharged',
      bedNumber: 'D402',
      admissionDate: '2024-01-13',
      registrationDate: '2024-01-13',
      waitingDays: 0
    }
  ])
  
  const selectedStatus = ref<string | 'all'>('all')
  const showAddPatientModal = ref(false)
  
  const newPatient = ref({
    name: '',
    gender: '男',
    age: 0,
    phone: '',
    diagnosis: '',
    attendingDoctor: '王大明',
    status: 'waiting',
    bedNumber: ''
  })
  
  // 統計數據
  const stats = computed(() => {
    const totalPatients = patients.value.length
    const inpatientCount = patients.value.filter(p => p.status === 'inpatient').length
    const waitingCount = patients.value.filter(p => p.status === 'waiting').length
    const dischargedCount = patients.value.filter(p => p.status === 'discharged').length
  
    return {
      totalPatients,
      inpatientCount,
      waitingCount,
      dischargedCount
    }
  })
  
  // 等待床位病人
  const waitingPatients = computed(() => 
    patients.value.filter(patient => patient.status === 'waiting')
  )
  
  // 過濾後的病人列表
  const filteredPatients = computed(() => {
    if (selectedStatus.value === 'all') {
      return patients.value
    }
    return patients.value.filter(patient => patient.status === selectedStatus.value)
  })
  
  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'waiting': '等待床位',
      'inpatient': '住院中',
      'discharged': '已出院'
    }
    return statusMap[status] || status
  }
  
  const selectStatus = (status: string | 'all') => {
    selectedStatus.value = status
  }
  
  const viewPatient = (patient: Patient) => {
    alert(`查看病人: ${patient.name} (${patient.id})`)
  }
  
  const editPatient = (patient: Patient) => {
    alert(`編輯病人: ${patient.name}`)
  }
  
  const dischargePatient = (patient: Patient) => {
    if (confirm(`確定要讓 ${patient.name} 出院嗎？`)) {
      patient.status = 'discharged'
      patient.bedNumber = undefined
    }
  }
  
  const assignBed = (patient: Patient) => {
    const bedNumber = prompt(`為 ${patient.name} 分配床位:`, availableBeds.value[0]?.bedNumber)
    if (bedNumber) {
      patient.status = 'inpatient'
      patient.bedNumber = bedNumber
      patient.admissionDate = new Date().toISOString().split('T')[0]
      
      // 更新床位狀態
      const bed = availableBeds.value.find(b => b.bedNumber === bedNumber)
      if (bed) {
        bed.status = 'occupied'
      }
    }
  }
  
  const assignBedsToWaiting = () => {
    if (waitingPatients.value.length === 0) {
      alert('沒有等待床位的病人')
      return
    }
  
    if (availableBeds.value.length === 0) {
      alert('目前沒有可用床位')
      return
    }
  
    // 簡單的自動分配邏輯
    waitingPatients.value.forEach((patient, index) => {
      if (index < availableBeds.value.length) {
        const bed = availableBeds.value[index]
        patient.status = 'inpatient'
        patient.bedNumber = bed?.bedNumber
        patient.admissionDate = new Date().toISOString().split('T')[0]
        bed.status = 'occupied'
      }
    })
  
    alert(`已為 ${Math.min(waitingPatients.value.length, availableBeds.value.length)} 位病人分配床位`)
  }
  
  const cancelRegistration = (patient: Patient) => {
    if (confirm(`確定要取消 ${patient.name} 的登記嗎？`)) {
      const index = patients.value.findIndex(p => p.id === patient.id)
      if (index !== -1) {
        patients.value.splice(index, 1)
      }
    }
  }
  
  const addNewPatient = () => {
    const newPatientData: Patient = {
      id: `P${String(patients.value.length + 1).padStart(3, '0')}`,
      name: newPatient.value.name,
      gender: newPatient.value.gender,
      age: newPatient.value.age,
      phone: newPatient.value.phone || undefined,
      diagnosis: newPatient.value.diagnosis,
      attendingDoctor: newPatient.value.attendingDoctor,
      status: newPatient.value.status as 'waiting' | 'inpatient',
      bedNumber: newPatient.value.bedNumber || undefined,
      admissionDate: newPatient.value.status === 'inpatient' ? new Date().toISOString().split('T')[0] : undefined,
      registrationDate: new Date().toISOString().split('T')[0]!,
      waitingDays: 0
    }
  
    // 如果選擇直接住院且有指定床位，更新床位狀態
    if (newPatientData.status === 'inpatient' && newPatientData.bedNumber) {
      const bed = availableBeds.value.find(b => b.bedNumber === newPatientData.bedNumber)
      if (bed) {
        bed.status = 'occupied'
      }
    }
  
    patients.value.push(newPatientData)
    showAddPatientModal.value = false
    resetNewPatientForm()
  }
  
  const resetNewPatientForm = () => {
    newPatient.value = {
      name: '',
      gender: '男',
      age: 0,
      phone: '',
      diagnosis: '',
      attendingDoctor: '王大明',
      status: 'waiting',
      bedNumber: ''
    }
  }
  
  const refreshPatients = () => {
    console.log('刷新病人數據')
  }
  
  const exportPatients = () => {
    alert('匯出病人資料')
  }
  
  onMounted(() => {
    console.log('病人管理頁面加載完成')
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
  
  .data-table {
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  
  th {
    background-color: #f8fafc;
    font-weight: 600;
    color: #64748b;
  }
  
  .status {
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  
  .status-inpatient { background-color: #fef3c7; color: #d97706; }
  .status-discharged { background-color: #dcfce7; color: #16a34a; }

.waiting-section {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
/* 統計卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid transparent;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
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

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
  color: var(--dark);
  line-height: 1;
}

.stat-label {
  color: #64748b;
  font-size: 14px
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
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 13px;
  color: #64748b;
}

.detail-item i {
  width: 14px;
  text-align: center;
  color: #f59e0b;
}

.patient-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
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
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  
  .stat-value {
    font-size: 20px;
  }
}
/* 狀態篩選 */
.status-filter {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.filter-title {
  font-weight: 600;
  color: var(--dark);
  min-width: 80px;
  padding-top: 5px;
  font-size: 14px;
}

.filter-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
}

.filter-btn {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  white-space: nowrap;
  font-weight: 500;
}

.filter-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: #f8fafc;
}

.filter-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.filter-btn.active:hover {
  background: var(--primary-dark);
  border-color: var(--primary-dark);
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
    .stats-cards {
    grid-template-columns: 1fr;
  }
  .filter-buttons {
    flex-direction: column;
  }
  
  .filter-btn {
    text-align: center;
  }
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 12px;
  }
}
  </style>