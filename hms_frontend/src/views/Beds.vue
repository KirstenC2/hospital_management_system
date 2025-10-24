<template>
  <div class="beds-view">
    <div class="header">
      <h1>病床管理</h1>
      <div class="header-actions">
        <button class="btn btn-primary" @click="showAddBedModal = true">
          <i class="fas fa-plus"></i> 新增病床
        </button>
        <button class="btn btn-outline" @click="refreshBeds">
          <i class="fas fa-sync-alt"></i> 刷新
        </button>
      </div>
    </div>

    <!-- 樓層和科室篩選 -->
    <div class="filters">
      <div class="filter-group">
        <div class="filter-title">樓層篩選:</div>
        <div class="filter-buttons">
          <button 
            v-for="floor in floors" 
            :key="floor"
            class="filter-btn"
            :class="{ active: selectedFloor === floor }"
            @click="selectFloor(floor)"
          >
            {{ floor }}樓
          </button>
          <button 
            class="filter-btn"
            :class="{ active: selectedFloor === 'all' }"
            @click="selectFloor('all')"
          >
            全部樓層
          </button>
        </div>
      </div>

      <div class="filter-group">
        <div class="filter-title">科室篩選:</div>
        <div class="filter-buttons">
          <button 
            v-for="dept in departments" 
            :key="dept.value"
            class="filter-btn"
            :class="{ active: selectedDepartment === dept.value }"
            @click="selectDepartment(dept.value)"
          >
            {{ dept.label }}
          </button>
          <button 
            class="filter-btn"
            :class="{ active: selectedDepartment === 'all' }"
            @click="selectDepartment('all')"
          >
            全部科室
          </button>
        </div>
      </div>
    </div>

    <div class="content">
      <!-- 統計卡片 -->
      <div class="stats-cards">
        <div class="stat-card total">
          <div class="stat-icon">
            <i class="fas fa-bed"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalBeds }}</div>
            <div class="stat-label">總病床數</div>
          </div>
        </div>
        <div class="stat-card occupied">
          <div class="stat-icon">
            <i class="fas fa-user-injured"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.occupiedBeds }}</div>
            <div class="stat-label">已占用</div>
          </div>
        </div>
        <div class="stat-card available">
          <div class="stat-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.availableBeds }}</div>
            <div class="stat-label">可用</div>
          </div>
        </div>
        <div class="stat-card maintenance">
          <div class="stat-icon">
            <i class="fas fa-tools"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.maintenanceBeds }}</div>
            <div class="stat-label">維修中</div>
          </div>
        </div>
      </div>

      <!-- 按樓層和科室分組顯示 -->
      <div class="floors-container">
        <div 
          v-for="floor in filteredFloors" 
          :key="floor.level"
          class="floor-section"
        >
          <div class="floor-header">
            <h3 class="floor-title">
              <i class="fas fa-building"></i>
              {{ floor.level }}樓
              <span class="floor-stats">
                ({{ floor.available }}/{{ floor.total }} 可用)
              </span>
            </h3>
            <div class="floor-utilization">
              <div class="utilization-bar">
                <div 
                  class="utilization-fill" 
                  :style="{ width: floor.utilization + '%' }"
                ></div>
              </div>
              <span class="utilization-text">{{ floor.utilization }}% 使用率</span>
            </div>
          </div>

          <!-- 科室分組 -->
          <div 
            v-for="department in floor.departments" 
            :key="department.name"
            class="department-section"
          >
            <div class="department-header">
              <h4 class="department-title">
                <i class="fas fa-stethoscope"></i>
                {{ department.name }}
                <span class="department-stats">
                  ({{ department.available }}/{{ department.total }} 可用)
                </span>
              </h4>
              <div class="department-utilization">
                <span class="utilization-text">{{ department.utilization }}% 使用率</span>
              </div>
            </div>

            <!-- 病床網格 -->
            <div class="beds-grid">
              <div 
                v-for="bed in department.beds" 
                :key="bed.id"
                class="bed-card"
                :class="`status-${bed.status}`"
                @click="selectBed(bed)"
              >
                <div class="bed-header">
                  <div class="bed-number">{{ bed.bedNumber }}</div>
                  <div class="bed-status" :class="`status-${bed.status}`">
                    {{ getStatusText(bed.status) }}
                  </div>
                </div>
                
                <div class="bed-info">
                  <div class="info-item">
                    <i class="fas fa-door-open"></i>
                    <span>{{ bed.room }}</span>
                  </div>
                  <div class="info-item">
                    <i class="fas fa-user-md"></i>
                    <span>主治: {{ bed.attendingDoctor }}</span>
                  </div>
                  <div class="info-item" v-if="bed.patient">
                    <i class="fas fa-user-injured"></i>
                    <span>{{ bed.patient.name }}</span>
                  </div>
                  <div class="info-item" v-if="bed.patient">
                    <i class="fas fa-clock"></i>
                    <span>入院: {{ bed.patient.admissionDate }}</span>
                  </div>
                  <div class="info-item" v-if="bed.patient">
                    <i class="fas fa-heartbeat"></i>
                    <span>診斷: {{ bed.patient.diagnosis }}</span>
                  </div>
                </div>

                <div class="bed-actions">
                  <button 
                    v-if="bed.status === 'available'" 
                    class="btn btn-sm btn-primary"
                    @click.stop="assignPatient(bed)"
                  >
                    分配病人
                  </button>
                  <button 
                    v-if="bed.status === 'occupied'" 
                    class="btn btn-sm btn-outline"
                    @click.stop="dischargePatient(bed)"
                  >
                    出院
                  </button>
                  <button 
                    v-if="bed.status === 'maintenance'" 
                    class="btn btn-sm btn-success"
                    @click.stop="completeMaintenance(bed)"
                  >
                    完成維修
                  </button>
                  <button 
                    class="btn btn-sm btn-warning"
                    @click.stop="setMaintenance(bed)"
                  >
                    設為維修
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 病床詳情模態框 -->
    <div v-if="selectedBed" class="modal-overlay" @click="selectedBed = null">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>病床詳情 - {{ selectedBed.bedNumber }}</h3>
          <button class="close-btn" @click="selectedBed = null">&times;</button>
        </div>
        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-item">
              <label>病床號碼:</label>
              <span>{{ selectedBed.bedNumber }}</span>
            </div>
            <div class="detail-item">
              <label>樓層:</label>
              <span>{{ selectedBed.floor }}樓</span>
            </div>
            <div class="detail-item">
              <label>房間:</label>
              <span>{{ selectedBed.room }}</span>
            </div>
            <div class="detail-item">
              <label>科室:</label>
              <span>{{ selectedBed.department }}</span>
            </div>
            <div class="detail-item">
              <label>主治醫生:</label>
              <span>{{ selectedBed.attendingDoctor }}</span>
            </div>
            <div class="detail-item">
              <label>狀態:</label>
              <span :class="`status-${selectedBed.status}`">
                {{ getStatusText(selectedBed.status) }}
              </span>
            </div>
            <div v-if="selectedBed.patient" class="detail-item">
              <label>病人姓名:</label>
              <span>{{ selectedBed.patient.name }}</span>
            </div>
            <div v-if="selectedBed.patient" class="detail-item">
              <label>性別/年齡:</label>
              <span>{{ selectedBed.patient.gender }} / {{ selectedBed.patient.age }}歲</span>
            </div>
            <div v-if="selectedBed.patient" class="detail-item">
              <label>入院日期:</label>
              <span>{{ selectedBed.patient.admissionDate }}</span>
            </div>
            <div v-if="selectedBed.patient" class="detail-item">
              <label>診斷:</label>
              <span>{{ selectedBed.patient.diagnosis }}</span>
            </div>
            <div v-if="selectedBed.patient" class="detail-item">
              <label>護理等級:</label>
              <span>{{ selectedBed.patient.careLevel }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增病床模態框 -->
    <div v-if="showAddBedModal" class="modal-overlay" @click="showAddBedModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>新增病床</h3>
          <button class="close-btn" @click="showAddBedModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addNewBed">
            <div class="form-group">
              <label>病床號碼:</label>
              <input v-model="newBed.bedNumber" type="text" required>
            </div>
            <div class="form-group">
              <label>樓層:</label>
              <select v-model="newBed.floor" required>
                <option v-for="floor in floors" :key="floor" :value="floor">{{ floor }}樓</option>
              </select>
            </div>
            <div class="form-group">
              <label>房間:</label>
              <input v-model="newBed.room" type="text" required>
            </div>
            <div class="form-group">
              <label>科室:</label>
              <select v-model="newBed.department" required>
                <option v-for="dept in departments" :key="dept.value" :value="dept.value">
                  {{ dept.label }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>主治醫生:</label>
              <select v-model="newBed.attendingDoctor" required>
                <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.name">
                  {{ doctor.name }} - {{ doctor.specialty }}
                </option>
              </select>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">新增</button>
              <button type="button" class="btn btn-outline" @click="showAddBedModal = false">取消</button>
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
  name: string
  gender: string
  age: number
  admissionDate: string
  diagnosis: string
  careLevel: string
}

interface Bed {
  id: string
  bedNumber: string
  floor: number
  room: string
  department: string
  attendingDoctor: string
  status: 'available' | 'occupied' | 'maintenance'
  patient?: Patient
}

interface DepartmentData {
  name: string
  total: number
  available: number
  utilization: number
  beds: Bed[]
}

interface FloorData {
  level: number
  total: number
  available: number
  utilization: number
  departments: DepartmentData[]
}

// 科室定義
const departments = [
  { value: 'internal', label: '內科' },
  { value: 'surgery', label: '外科' },
  { value: 'pediatrics', label: '兒科' },
  { value: 'obstetrics', label: '婦產科' },
  { value: 'orthopedics', label: '骨科' },
  { value: 'cardiology', label: '心臟科' },
  { value: 'neurology', label: '神經科' },
  { value: 'emergency', label: '急診科' }
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

// 模擬病床數據（包含樓層和科室信息）
const beds = ref<Bed[]>([
  // 1樓 - 內科、急診科
  {
    id: '1',
    bedNumber: 'A101',
    floor: 1,
    room: '101房',
    department: 'internal',
    attendingDoctor: '王大明',
    status: 'occupied',
    patient: {
      name: '張小明',
      gender: '男',
      age: 45,
      admissionDate: '2024-01-15',
      diagnosis: '高血壓',
      careLevel: '一級護理'
    }
  },
  {
    id: '2',
    bedNumber: 'A102',
    floor: 1,
    room: '101房',
    department: 'internal',
    attendingDoctor: '王大明',
    status: 'available'
  },
  {
    id: '3',
    bedNumber: 'A103',
    floor: 1,
    room: '101房',
    department: 'internal',
    attendingDoctor: '王大明',
    status: 'available'
  },
  {
    id: '4',
    bedNumber: 'E101',
    floor: 1,
    room: '急診室',
    department: 'emergency',
    attendingDoctor: '待分配',
    status: 'occupied',
    patient: {
      name: '李大華',
      gender: '男',
      age: 32,
      admissionDate: '2024-01-18',
      diagnosis: '急性闌尾炎',
      careLevel: '特級護理'
    }
  },

  // 2樓 - 外科、骨科
  {
    id: '5',
    bedNumber: 'B201',
    floor: 2,
    room: '201房',
    department: 'surgery',
    attendingDoctor: '陳小美',
    status: 'occupied',
    patient: {
      name: '李美華',
      gender: '女',
      age: 28,
      admissionDate: '2024-01-16',
      diagnosis: '膽囊切除術後',
      careLevel: '二級護理'
    }
  },
  {
    id: '6',
    bedNumber: 'B202',
    floor: 2,
    room: '201房',
    department: 'surgery',
    attendingDoctor: '陳小美',
    status: 'available'
  },
  {
    id: '7',
    bedNumber: 'O201',
    floor: 2,
    room: '202房',
    department: 'orthopedics',
    attendingDoctor: '張偉強',
    status: 'occupied',
    patient: {
      name: '陳大勇',
      gender: '男',
      age: 55,
      admissionDate: '2024-01-14',
      diagnosis: '股骨骨折',
      careLevel: '一級護理'
    }
  },

  // 3樓 - 兒科、婦產科
  {
    id: '8',
    bedNumber: 'C301',
    floor: 3,
    room: '301房',
    department: 'pediatrics',
    attendingDoctor: '林志雄',
    status: 'occupied',
    patient: {
      name: '王小寶',
      gender: '男',
      age: 6,
      admissionDate: '2024-01-14',
      diagnosis: '急性支氣管炎',
      careLevel: '一級護理'
    }
  },
  {
    id: '9',
    bedNumber: 'C302',
    floor: 3,
    room: '301房',
    department: 'pediatrics',
    attendingDoctor: '林志雄',
    status: 'available'
  },
  {
    id: '10',
    bedNumber: 'G301',
    floor: 3,
    room: '302房',
    department: 'obstetrics',
    attendingDoctor: '吳美麗',
    status: 'occupied',
    patient: {
      name: '黃小玉',
      gender: '女',
      age: 30,
      admissionDate: '2024-01-17',
      diagnosis: '產後護理',
      careLevel: '一級護理'
    }
  },

  // 4樓 - 心臟科、神經科
  {
    id: '11',
    bedNumber: 'D401',
    floor: 4,
    room: '401房',
    department: 'cardiology',
    attendingDoctor: '劉心怡',
    status: 'available'
  },
  {
    id: '12',
    bedNumber: 'D402',
    floor: 4,
    room: '401房',
    department: 'cardiology',
    attendingDoctor: '劉心怡',
    status: 'occupied',
    patient: {
      name: '趙國強',
      gender: '男',
      age: 68,
      admissionDate: '2024-01-13',
      diagnosis: '冠狀動脈疾病',
      careLevel: '特級護理'
    }
  },
  {
    id: '13',
    bedNumber: 'N401',
    floor: 4,
    room: '402房',
    department: 'neurology',
    attendingDoctor: '待分配',
    status: 'maintenance'
  }
])

const selectedBed = ref<Bed | null>(null)
const showAddBedModal = ref(false)
const selectedFloor = ref<number | 'all'>('all')
const selectedDepartment = ref<string | 'all'>('all')

const floors = [1, 2, 3, 4]

const newBed = ref({
  bedNumber: '',
  floor: 1,
  room: '',
  department: 'internal',
  attendingDoctor: '王大明'
})

// 統計數據
const stats = computed(() => {
  const filteredBeds = getFilteredBeds()
  
  const totalBeds = filteredBeds.length
  const occupiedBeds = filteredBeds.filter(bed => bed.status === 'occupied').length
  const availableBeds = filteredBeds.filter(bed => bed.status === 'available').length
  const maintenanceBeds = filteredBeds.filter(bed => bed.status === 'maintenance').length

  return {
    totalBeds,
    occupiedBeds,
    availableBeds,
    maintenanceBeds
  }
})

// 獲取過濾後的病床
const getFilteredBeds = () => {
  return beds.value.filter(bed => {
    const floorMatch = selectedFloor.value === 'all' || bed.floor === selectedFloor.value
    const deptMatch = selectedDepartment.value === 'all' || bed.department === selectedDepartment.value
    return floorMatch && deptMatch
  })
}

// 按樓層和科室分組的數據
const floorsData = computed(() => {
  const floorMap = new Map<number, FloorData>()
  
  // 初始化每個樓層
  floors.forEach(floor => {
    floorMap.set(floor, {
      level: floor,
      total: 0,
      available: 0,
      utilization: 0,
      departments: []
    })
  })
  
  // 為每個樓層初始化科室
  floorMap.forEach((floorData, floorLevel) => {
    const floorBeds = beds.value.filter(bed => bed.floor === floorLevel)
    const deptMap = new Map<string, DepartmentData>()
    
    departments.forEach(dept => {
      deptMap.set(dept.value, {
        name: dept.label,
        total: 0,
        available: 0,
        utilization: 0,
        beds: []
      })
    })
    
    // 分配病床到科室
    floorBeds.forEach(bed => {
      const deptData = deptMap.get(bed.department)
      if (deptData) {
        deptData.beds.push(bed)
        deptData.total++
        if (bed.status === 'available') {
          deptData.available++
        }
        deptData.utilization = Math.round(((deptData.total - deptData.available) / deptData.total) * 100)
      }
    })
    
    // 過濾掉沒有病床的科室
    floorData.departments = Array.from(deptMap.values()).filter(dept => dept.total > 0)
    
    // 計算樓層統計
    floorData.total = floorBeds.length
    floorData.available = floorBeds.filter(bed => bed.status === 'available').length
    floorData.utilization = Math.round(((floorData.total - floorData.available) / floorData.total) * 100)
  })
  
  return Array.from(floorMap.values()).filter(floor => floor.total > 0)
})

// 過濾後的樓層數據
const filteredFloors = computed(() => {
  let filtered = floorsData.value
  
  if (selectedFloor.value !== 'all') {
    filtered = filtered.filter(floor => floor.level === selectedFloor.value)
  }
  
  if (selectedDepartment.value !== 'all') {
    filtered = filtered.map(floor => ({
      ...floor,
      departments: floor.departments.filter(dept => {
        const deptValue = departments.find(d => d.label === dept.name)?.value
        return deptValue === selectedDepartment.value
      })
    })).filter(floor => floor.departments.length > 0)
  }
  
  return filtered
})

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'available': '可用',
    'occupied': '已占用',
    'maintenance': '維修中'
  }
  return statusMap[status] || status
}

const selectFloor = (floor: number | 'all') => {
  selectedFloor.value = floor
}

const selectDepartment = (department: string | 'all') => {
  selectedDepartment.value = department
}

const selectBed = (bed: Bed) => {
  selectedBed.value = bed
}

const assignPatient = (bed: Bed) => {
  const patientName = prompt('請輸入病人姓名:')
  if (patientName) {
    bed.status = 'occupied'
    bed.patient = {
      name: patientName,
      gender: '未知',
      age: 0,
      admissionDate: new Date().toISOString().split('T')[0]!,
      diagnosis: '待診斷',
      careLevel: '三級護理'
    }
  }
}

const dischargePatient = (bed: Bed) => {
  if (confirm(`確定要讓 ${bed.patient?.name} 出院嗎？`)) {
    bed.status = 'available'
    bed.patient = undefined
  }
}

const setMaintenance = (bed: Bed) => {
  bed.status = 'maintenance'
  bed.patient = undefined
}

const completeMaintenance = (bed: Bed) => {
  bed.status = 'available'
}

const addNewBed = () => {
  const newBedData: Bed = {
    id: Date.now().toString(),
    bedNumber: newBed.value.bedNumber,
    floor: newBed.value.floor,
    room: newBed.value.room,
    department: newBed.value.department,
    attendingDoctor: newBed.value.attendingDoctor,
    status: 'available'
  }
  
  beds.value.push(newBedData)
  showAddBedModal.value = false
  resetNewBedForm()
}

const resetNewBedForm = () => {
  newBed.value = {
    bedNumber: '',
    floor: 1,
    room: '',
    department: 'internal',
    attendingDoctor: '王大明'
  }
}

const refreshBeds = () => {
  console.log('刷新病床數據')
}

onMounted(() => {
  console.log('病床管理頁面加載完成')
})
</script>
<style scoped>
.beds-view {
  padding: 20px;
  background-color: #f8fafc;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header h1 {
  color: var(--dark);
  font-size: 28px;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* 篩選器樣式 */
.filters {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.filter-group {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.filter-title {
  font-weight: 600;
  color: var(--dark);
  min-width: 80px;
  padding-top: 5px;
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
}

.filter-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.filter-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
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
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
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
}

.total .stat-icon { background-color: var(--primary); }
.occupied .stat-icon { background-color: #ef4444; }
.available .stat-icon { background-color: var(--secondary); }
.maintenance .stat-icon { background-color: #f59e0b; }

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
  color: var(--dark);
}

.stat-label {
  color: #64748b;
  font-size: 14px;
}

/* 樓層容器 */
.floors-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.floor-section {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.floor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e2e8f0;
}

.floor-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--dark);
  margin: 0;
  font-size: 20px;
}

.floor-title i {
  color: var(--primary);
}

.floor-stats {
  font-size: 14px;
  color: #64748b;
  font-weight: normal;
  margin-left: 10px;
}

.floor-utilization {
  display: flex;
  align-items: center;
  gap: 10px;
}

.utilization-bar {
  width: 120px;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.utilization-fill {
  height: 100%;
  background: var(--primary);
  transition: width 0.3s ease;
  border-radius: 4px;
}

.utilization-text {
  font-size: 14px;
  color: #64748b;
  min-width: 80px;
  font-weight: 500;
}

/* 科室區域 */
.department-section {
  margin-bottom: 25px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.department-section:last-child {
  margin-bottom: 0;
}

.department-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.department-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--dark);
  margin: 0;
  font-size: 18px;
}

.department-title i {
  color: var(--primary);
}

.department-stats {
  font-size: 14px;
  color: #64748b;
  font-weight: normal;
  margin-left: 10px;
}

.department-utilization {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

/* 病床網格 */
.beds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 15px;
}

.bed-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  border: 1px solid #e2e8f0;
}

.bed-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border-color: var(--primary);
}

.bed-card.status-available {
  border-left-color: var(--secondary);
}

.bed-card.status-occupied {
  border-left-color: #ef4444;
}

.bed-card.status-maintenance {
  border-left-color: #f59e0b;
}

.bed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.bed-number {
  font-size: 16px;
  font-weight: bold;
  color: var(--dark);
}

.bed-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.bed-status.status-available {
  background-color: #dcfce7;
  color: var(--secondary);
}

.bed-status.status-occupied {
  background-color: #fee2e2;
  color: #ef4444;
}

.bed-status.status-maintenance {
  background-color: #fef3c7;
  color: #d97706;
}

.bed-info {
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 13px;
  color: #64748b;
}

.info-item i {
  width: 14px;
  text-align: center;
  color: var(--primary);
}

.bed-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* 按鈕樣式 */
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
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
}

.btn-outline:hover {
  background-color: var(--primary);
  color: white;
}

.btn-success {
  background-color: var(--secondary);
  color: white;
}

.btn-success:hover {
  background-color: #0d966b;
}

.btn-warning {
  background-color: #f59e0b;
  color: white;
}

.btn-warning:hover {
  background-color: #d97706;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

/* 模態框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 10px 10px 0 0;
}

.modal-header h3 {
  margin: 0;
  color: var(--dark);
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: var(--dark);
}

.modal-body {
  padding: 20px;
}

.detail-grid {
  display: grid;
  gap: 12px;
}

.detail-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: start;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item label {
  font-weight: 600;
  color: #64748b;
  font-size: 14px;
}

.detail-item span {
  color: var(--dark);
  font-size: 14px;
}

/* 表單樣式 */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .beds-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .beds-view {
    padding: 15px;
  }

  .header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .header-actions {
    justify-content: center;
  }

  .filters {
    padding: 15px;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .filter-title {
    min-width: auto;
  }

  .filter-buttons {
    justify-content: center;
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .floor-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .floor-utilization {
    width: 100%;
    justify-content: space-between;
  }

  .beds-grid {
    grid-template-columns: 1fr;
  }

  .department-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .modal-overlay {
    padding: 10px;
  }

  .modal-content {
    margin: 10px;
  }

  .detail-item {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .form-actions {
    flex-direction: column;
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

  .bed-actions {
    flex-direction: column;
  }

  .btn {
    justify-content: center;
  }
}

/* 全局變量 */
:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --secondary: #10b981;
  --light: #f8fafc;
  --dark: #1e293b;
}
</style>