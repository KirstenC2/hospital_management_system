<template>
  <div class="dashboard">
    <div class="header">
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="搜尋病人、醫生或部門...">
      </div>
      <div class="user-info">
        <div class="user-avatar">AD</div>
        <div class="user-details">
          <div class="user-name">管理員</div>
        </div>
      </div>
    </div>

    <div class="content">
      <!-- 儀表板卡片 -->
      <div class="dashboard-cards">
        <div class="card patients">
          <div class="card-header">
            <div>
              <div class="card-value">{{ stats.patients }}</div>
              <div class="card-title">住院病人</div>
            </div>
            <div class="card-icon">
              <i class="fas fa-user-injured"></i>
            </div>
          </div>
          <div class="card-trend trend-up">
            <i class="fas fa-arrow-up"></i>
            <span>較上月增加 5%</span>
          </div>
        </div>

        <div class="card doctors">
          <div class="card-header">
            <div>
              <div class="card-value">{{ stats.doctors }}</div>
              <div class="card-title">在職醫生</div>
            </div>
            <div class="card-icon">
              <i class="fas fa-user-md"></i>
            </div>
          </div>
          <div class="card-trend trend-up">
            <i class="fas fa-arrow-up"></i>
            <span>較上月增加 2%</span>
          </div>
        </div>

        <div class="card appointments">
          <div class="card-header">
            <div>
              <div class="card-value">{{ stats.appointments }}</div>
              <div class="card-title">今日預約</div>
            </div>
            <div class="card-icon">
              <i class="fas fa-calendar-check"></i>
            </div>
          </div>
          <div class="card-trend trend-down">
            <i class="fas fa-arrow-down"></i>
            <span>較昨日減少 3%</span>
          </div>
        </div>

        <!-- 新增今日空病床卡片 -->
        <div class="card available-beds">
          <div class="card-header">
            <div>
              <div class="card-value">{{ bedStats.availableBeds }}</div>
              <div class="card-title">今日空病床</div>
            </div>
            <div class="card-icon">
              <i class="fas fa-bed"></i>
            </div>
          </div>
          <div class="card-trend" :class="bedStats.bedTrend">
            <i :class="bedStats.bedTrend === 'trend-up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            <span>{{ bedStats.bedTrendText }}</span>
          </div>
          <div class="card-detail">
            <span>總病床: {{ bedStats.totalBeds }}</span>
            <span>使用率: {{ bedStats.bedUtilization }}%</span>
          </div>
        </div>
      </div>

      <!-- 兩欄佈局 -->
      <div class="dashboard-grid">
        <!-- 左側：今日預約 -->
        <div class="grid-column">
          <AppointmentsTable />
        </div>

        <!-- 右側：空病床列表 -->
        <div class="grid-column">
          <AvailableBedsList :available-beds="availableBedsList" />
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="quick-actions">
        <div class="section-title">
          <i class="fas fa-bolt"></i>
          <span>快速操作</span>
        </div>
        <div class="actions-grid">
          <button class="action-btn" @click="$router.push('/patients')">
            <i class="fas fa-user-plus"></i>
            <span>新增病人</span>
          </button>
          <button class="action-btn" @click="$router.push('/beds')">
            <i class="fas fa-bed"></i>
            <span>病床管理</span>
          </button>
          <button class="action-btn">
            <i class="fas fa-calendar-plus"></i>
            <span>安排預約</span>
          </button>
          <button class="action-btn">
            <i class="fas fa-file-medical"></i>
            <span>醫療報告</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardCards from '@/components/DashboardCards.vue'
import AppointmentsTable from '@/components/AppointmentsTable.vue'
import AvailableBedsList from '@/components/AvailableBedsList.vue'

const router = useRouter()

interface Bed {
  id: string
  bedNumber: string
  room: string
  department: string
  status: 'available' | 'occupied' | 'maintenance'
  patient?: {
    name: string
    admissionDate: string
    doctor: string
  }
}

// 模擬病床數據
const bedsData = ref<Bed[]>([
  {
    id: '1',
    bedNumber: 'A101',
    room: '101房',
    department: '內科',
    status: 'occupied',
    patient: {
      name: '張小明',
      admissionDate: '2024-01-15',
      doctor: '王醫生'
    }
  },
  {
    id: '2',
    bedNumber: 'A102',
    room: '101房',
    department: '內科',
    status: 'available'
  },
  {
    id: '3',
    bedNumber: 'A103',
    room: '101房',
    department: '內科',
    status: 'available'
  },
  {
    id: '4',
    bedNumber: 'B201',
    room: '201房',
    department: '外科',
    status: 'occupied',
    patient: {
      name: '李美華',
      admissionDate: '2024-01-16',
      doctor: '陳醫生'
    }
  },
  {
    id: '5',
    bedNumber: 'B202',
    room: '201房',
    department: '外科',
    status: 'available'
  },
  {
    id: '6',
    bedNumber: 'C301',
    room: '301房',
    department: '兒科',
    status: 'occupied',
    patient: {
      name: '王小寶',
      admissionDate: '2024-01-14',
      doctor: '林醫生'
    }
  },
  {
    id: '7',
    bedNumber: 'C302',
    room: '301房',
    department: '兒科',
    status: 'maintenance'
  },
  {
    id: '8',
    bedNumber: 'D401',
    room: '401房',
    department: '婦產科',
    status: 'available'
  }
])

const stats = ref({
  patients: 124,
  doctors: 42,
  appointments: 28,
  revenue: '86,420',
})

// 計算空病床相關統計
const bedStats = computed(() => {
  const totalBeds = bedsData.value.length
  const availableBeds = bedsData.value.filter(bed => bed.status === 'available').length
  const occupiedBeds = bedsData.value.filter(bed => bed.status === 'occupied').length
  const utilizationRate = Math.round((occupiedBeds / totalBeds) * 100)
  
  // 模擬趨勢數據
  const bedTrend = availableBeds > 15 ? 'trend-up' : 'trend-down'
  const bedTrendText = availableBeds > 15 ? '較昨日增加 8%' : '較昨日減少 5%'

  return {
    totalBeds,
    availableBeds,
    occupiedBeds,
    bedUtilization: utilizationRate,
    bedTrend,
    bedTrendText
  }
})

// 合併統計數據
const combinedStats = computed(() => ({
  ...stats.value, 
  ...bedStats.value
}))

// 可用病床列表
const availableBedsList = computed(() => 
  bedsData.value.filter(bed => bed.status === 'available').slice(0, 5) // 只顯示前5個
)

onMounted(() => {
  console.log('儀表板頁面加載完成')
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.header {
  background-color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 10px;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: var(--light);
  border-radius: 8px;
  padding: 8px 15px;
  width: 300px;
}

.search-bar input {
  border: none;
  background: transparent;
  outline: none;
  margin-left: 10px;
  width: 100%;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-weight: bold;
}

.content {
  padding: 20px 0;
}

/* 儀表板卡片 */
.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.patients .card-icon { background-color: #dbeafe; color: var(--primary); }
.doctors .card-icon { background-color: #dcfce7; color: var(--secondary); }
.appointments .card-icon { background-color: #fef3c7; color: #f59e0b; }
.available-beds .card-icon { background-color: #e0e7ff; color: #6366f1; }

.card-value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 5px;
}

.card-title {
  color: #64748b;
  font-size: 14px;
}

.card-trend {
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.trend-up { color: var(--secondary); }
.trend-down { color: #ef4444; }

.card-detail {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
  color: #64748b;
}

/* 兩欄佈局 */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.grid-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 快速操作 */
.quick-actions {
  margin-top: 30px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.section-title i {
  margin-right: 10px;
  color: var(--primary);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.action-btn {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  color: inherit;
}

.action-btn:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.action-btn i {
  font-size: 24px;
  color: var(--primary);
}

.action-btn span {
  font-weight: 600;
  color: var(--dark);
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-cards {
    grid-template-columns: 1fr;
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
  }
  
  .search-bar {
    width: 100%;
  }
}
</style>