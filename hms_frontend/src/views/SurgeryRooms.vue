<template>
  <div class="operating-rooms-view">
    <div class="header">
      <h1>手術室管理</h1>
      <div class="header-actions">
        <button class="btn btn-primary" @click="showScheduleModal = true">
          <i class="fas fa-calendar-plus"></i> 預約手術
        </button>
        <button class="btn btn-outline" @click="refreshData">
          <i class="fas fa-sync-alt"></i> 刷新
        </button>
      </div>
    </div>

    <!-- 統計卡片 -->
    <div class="stats-cards">
      <div class="stat-card total">
        <div class="stat-icon">
          <i class="fas fa-door-closed"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalRooms }}</div>
          <div class="stat-label">總手術室</div>
        </div>
      </div>
      <div class="stat-card available">
        <div class="stat-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.availableRooms }}</div>
          <div class="stat-label">可用</div>
        </div>
      </div>
      <div class="stat-card in-use">
        <div class="stat-icon">
          <i class="fas fa-procedures"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.inUseRooms }}</div>
          <div class="stat-label">使用中</div>
        </div>
      </div>
      <div class="stat-card maintenance">
        <div class="stat-icon">
          <i class="fas fa-tools"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.maintenanceRooms }}</div>
          <div class="stat-label">維護中</div>
        </div>
      </div>
      <div class="stat-card today">
        <div class="stat-icon">
          <i class="fas fa-calendar-day"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.todaySurgeries }}</div>
          <div class="stat-label">今日手術</div>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <!-- 左側：手術室狀態 -->
      <div class="rooms-section">
        <div class="section-header">
          <h3><i class="fas fa-door-closed"></i> 手術室狀態</h3>
          <div class="view-toggle">
            <button 
              class="toggle-btn" 
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              <i class="fas fa-th"></i>
            </button>
            <button 
              class="toggle-btn" 
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <i class="fas fa-list"></i>
            </button>
          </div>
        </div>

        <!-- 網格視圖 -->
        <div v-if="viewMode === 'grid'" class="rooms-grid">
          <div 
            v-for="room in operatingRooms" 
            :key="room.id"
            class="room-card"
            :class="`status-${room.status}`"
            @click="selectRoom(room)"
          >
            <div class="room-header">
              <div class="room-number">{{ room.name }}</div>
              <div class="room-status" :class="`status-${room.status}`">
                {{ getStatusText(room.status) }}
              </div>
            </div>
            
            <div class="room-info">
              <div class="info-item">
                <i class="fas fa-ruler-combined"></i>
                <span>{{ room.size }}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-tools"></i>
                <span>{{ room.equipment.join(', ') }}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-clock"></i>
                <span>清潔時間: {{ room.cleaningTime }}分鐘</span>
              </div>
            </div>

            <!-- 當前手術資訊 -->
            <div v-if="room.currentSurgery" class="current-surgery">
              <div class="surgery-header">
                <i class="fas fa-procedures"></i>
                <span>進行中手術</span>
              </div>
              <div class="surgery-info">
                <div class="patient-name">{{ room.currentSurgery.patientName }}</div>
                <div class="surgery-type">{{ room.currentSurgery.type }}</div>
                <div class="surgery-time">
                  {{ room.currentSurgery.startTime }} - {{ room.currentSurgery.endTime }}
                </div>
                <div class="surgical-team">
                  <span class="surgeon">主刀: {{ room.currentSurgery.surgeon }}</span>
                </div>
              </div>
            </div>

            <!-- 下一個手術 -->
            <div v-if="room.nextSurgery" class="next-surgery">
              <div class="surgery-header">
                <i class="fas fa-clock"></i>
                <span>下一台手術</span>
              </div>
              <div class="surgery-info">
                <div class="patient-name">{{ room.nextSurgery.patientName }}</div>
                <div class="surgery-time">{{ room.nextSurgery.startTime }}</div>
              </div>
            </div>

            <div class="room-actions">
              <button 
                v-if="room.status === 'available'" 
                class="btn btn-sm btn-primary"
                @click.stop="scheduleSurgery(room)"
              >
                <i class="fas fa-calendar-plus"></i>
                預約
              </button>
              <button 
                v-if="room.status === 'in-use'" 
                class="btn btn-sm btn-success"
                @click.stop="completeSurgery(room)"
              >
                <i class="fas fa-check"></i>
                完成
              </button>
              <button 
                v-if="room.status === 'maintenance'" 
                class="btn btn-sm btn-warning"
                @click.stop="completeMaintenance(room)"
              >
                <i class="fas fa-check"></i>
                完成維護
              </button>
              <button 
                class="btn btn-sm btn-outline"
                @click.stop="setMaintenance(room)"
              >
                <i class="fas fa-tools"></i>
                維護
              </button>
            </div>
          </div>
        </div>

        <!-- 列表視圖 -->
        <div v-if="viewMode === 'list'" class="rooms-list">
          <table class="rooms-table">
            <thead>
              <tr>
                <th>手術室</th>
                <th>狀態</th>
                <th>規格</th>
                <th>當前手術</th>
                <th>開始時間</th>
                <th>預計結束</th>
                <th>主刀醫生</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="room in operatingRooms" :key="room.id">
                <td class="room-name">
                  <div class="name">{{ room.name }}</div>
                  <div class="equipment">{{ room.equipment.join(', ') }}</div>
                </td>
                <td>
                  <span class="status" :class="`status-${room.status}`">
                    {{ getStatusText(room.status) }}
                  </span>
                </td>
                <td>{{ room.size }}</td>
                <td>
                  <div v-if="room.currentSurgery" class="surgery-info">
                    <div class="patient">{{ room.currentSurgery.patientName }}</div>
                    <div class="type">{{ room.currentSurgery.type }}</div>
                  </div>
                  <span v-else class="no-surgery">無手術</span>
                </td>
                <td>
                  {{ room.currentSurgery?.startTime || '-' }}
                </td>
                <td>
                  {{ room.currentSurgery?.endTime || '-' }}
                </td>
                <td>
                  {{ room.currentSurgery?.surgeon || '-' }}
                </td>
                <td>
                  <div class="action-buttons">
                    <button 
                      v-if="room.status === 'available'" 
                      class="btn btn-sm btn-primary"
                      @click="scheduleSurgery(room)"
                    >
                      預約
                    </button>
                    <button 
                      v-if="room.status === 'in-use'" 
                      class="btn btn-sm btn-success"
                      @click="completeSurgery(room)"
                    >
                      完成
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 右側：今日手術排程 -->
      <div class="schedule-section">
        <div class="section-header">
          <h3><i class="fas fa-calendar-day"></i> 今日手術排程</h3>
          <div class="date-navigation">
            <button class="nav-btn" @click="previousDay">
              <i class="fas fa-chevron-left"></i>
            </button>
            <span class="current-date">{{ currentDate }}</span>
            <button class="nav-btn" @click="nextDay">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div class="timeline-view">
          <div class="timeline-header">
            <div class="time-slots">
              <div v-for="hour in 24" :key="hour" class="time-slot">
                {{ String(hour - 1).padStart(2, '0') }}:00
              </div>
            </div>
          </div>
          
          <div class="timeline-content">
            <div 
              v-for="room in operatingRooms" 
              :key="room.id"
              class="timeline-row"
            >
              <div class="room-label">{{ room.name }}</div>
              <div class="time-track">
                <div 
                  v-for="surgery in getTodaySurgeries(room)"
                  :key="surgery.id"
                  class="surgery-block"
                  :style="getSurgeryBlockStyle(surgery)"
                  :class="`priority-${surgery.priority}`"
                  @click="viewSurgeryDetails(surgery)"
                >
                  <div class="surgery-info">
                    <div class="patient">{{ surgery.patientName }}</div>
                    <div class="type">{{ surgery.type }}</div>
                    <div class="time">{{ surgery.startTime }} - {{ surgery.endTime }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 即將開始的手術 -->
        <div class="upcoming-surgeries">
          <div class="section-header">
            <h4><i class="fas fa-clock"></i> 即將開始的手術</h4>
          </div>
          <div class="upcoming-list">
            <div 
              v-for="surgery in upcomingSurgeries" 
              :key="surgery.id"
              class="upcoming-item"
            >
              <div class="surgery-time">{{ surgery.startTime }}</div>
              <div class="surgery-details">
                <div class="patient-room">
                  <span class="patient">{{ surgery.patientName }}</span>
                  <span class="room">({{ surgery.roomName }})</span>
                </div>
                <div class="surgery-info">
                  <span class="type">{{ surgery.type }}</span>
                  <span class="surgeon">• {{ surgery.surgeon }}</span>
                </div>
              </div>
              <div class="surgery-actions">
                <button class="btn btn-sm btn-outline" @click="startSurgery(surgery)">
                  開始準備
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 預約手術模態框 -->
    <div v-if="showScheduleModal" class="modal-overlay" @click="showScheduleModal = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>預約手術</h3>
          <button class="close-btn" @click="showScheduleModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="scheduleNewSurgery">
            <div class="form-section">
              <h4>病人資訊</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>選擇病人:</label>
                  <select v-model="newSurgery.patientId" required>
                    <option value="">請選擇病人</option>
                    <option 
                      v-for="patient in availablePatients" 
                      :key="patient.id" 
                      :value="patient.id"
                    >
                      {{ patient.name }} ({{ patient.id }}) - {{ patient.diagnosis }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>手術類型:</label>
                  <select v-model="newSurgery.type" required>
                    <option value="elective">擇期手術</option>
                    <option value="emergency">急診手術</option>
                    <option value="major">大手術</option>
                    <option value="minor">小手術</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h4>手術安排</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>選擇手術室:</label>
                  <select v-model="newSurgery.roomId" required>
                    <option value="">請選擇手術室</option>
                    <option 
                      v-for="room in availableRooms" 
                      :key="room.id" 
                      :value="room.id"
                    >
                      {{ room.name }} - {{ room.size }} ({{ getStatusText(room.status) }})
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>主刀醫生:</label>
                  <select v-model="newSurgery.surgeonId" required>
                    <option value="">請選擇醫生</option>
                    <option 
                      v-for="doctor in surgeons" 
                      :key="doctor.id" 
                      :value="doctor.id"
                    >
                      {{ doctor.name }} - {{ doctor.specialty }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>手術日期:</label>
                  <input v-model="newSurgery.date" type="date" required>
                </div>
                <div class="form-group">
                  <label>開始時間:</label>
                  <input v-model="newSurgery.startTime" type="time" required>
                </div>
                <div class="form-group">
                  <label>預計時長 (分鐘):</label>
                  <input v-model="newSurgery.duration" type="number" min="30" max="480" required>
                </div>
              </div>

              <div class="form-group">
                <label>優先級:</label>
                <select v-model="newSurgery.priority">
                  <option value="normal">一般</option>
                  <option value="high">高優先</option>
                  <option value="urgent">緊急</option>
                </select>
              </div>

              <div class="form-group">
                <label>手術說明:</label>
                <textarea v-model="newSurgery.notes" rows="3" placeholder="手術相關說明..."></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">預約手術</button>
              <button type="button" class="btn btn-outline" @click="showScheduleModal = false">
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 手術詳情模態框 -->
    <div v-if="selectedSurgery" class="modal-overlay" @click="selectedSurgery = null">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>手術詳情</h3>
          <button class="close-btn" @click="selectedSurgery = null">&times;</button>
        </div>
        <div class="modal-body">
          <div class="surgery-details">
            <div class="detail-section">
              <h4>基本資訊</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>手術室:</label>
                  <span>{{ selectedSurgery.roomName }}</span>
                </div>
                <div class="detail-item">
                  <label>病人:</label>
                  <span>{{ selectedSurgery.patientName }}</span>
                </div>
                <div class="detail-item">
                  <label>手術類型:</label>
                  <span>{{ getSurgeryTypeText(selectedSurgery.type) }}</span>
                </div>
                <div class="detail-item">
                  <label>主刀醫生:</label>
                  <span>{{ selectedSurgery.surgeon }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>時間安排</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>日期:</label>
                  <span>{{ selectedSurgery.date }}</span>
                </div>
                <div class="detail-item">
                  <label>時間:</label>
                  <span>{{ selectedSurgery.startTime }} - {{ selectedSurgery.endTime }}</span>
                </div>
                <div class="detail-item">
                  <label>預計時長:</label>
                  <span>{{ selectedSurgery.duration }} 分鐘</span>
                </div>
                <div class="detail-item">
                  <label>狀態:</label>
                  <span :class="`status-${selectedSurgery.status}`">
                    {{ getSurgeryStatusText(selectedSurgery.status) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="detail-section" v-if="selectedSurgery.notes">
              <h4>手術說明</h4>
              <p>{{ selectedSurgery.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Surgery {
  id: string
  patientId: string
  patientName: string
  roomId: string
  roomName: string
  type: string
  surgeonId: string
  surgeon: string
  date: string
  startTime: string
  endTime: string
  duration: number
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'normal' | 'high' | 'urgent'
  notes?: string
}

interface OperatingRoom {
  id: string
  name: string
  status: 'available' | 'in-use' | 'maintenance' | 'cleaning'
  size: string
  equipment: string[]
  cleaningTime: number
  currentSurgery?: Surgery
  nextSurgery?: Surgery
}

// 模擬數據
const operatingRooms = ref<OperatingRoom[]>([
  {
    id: 'OR1',
    name: '手術室一',
    status: 'in-use',
    size: '大型',
    equipment: ['麻醉機', '監護儀', '腹腔鏡', '超聲刀'],
    cleaningTime: 30,
    currentSurgery: {
      id: 'S1',
      patientId: 'P001',
      patientName: '張小明',
      roomId: 'OR1',
      roomName: '手術室一',
      type: 'major',
      surgeonId: 'D1',
      surgeon: '陳小美',
      date: '2024-01-18',
      startTime: '08:00',
      endTime: '12:00',
      duration: 240,
      status: 'in-progress',
      priority: 'high',
      notes: '腹腔鏡膽囊切除術'
    }
  },
  {
    id: 'OR2',
    name: '手術室二',
    status: 'available',
    size: '中型',
    equipment: ['麻醉機', '監護儀', '關節鏡'],
    cleaningTime: 25,
    nextSurgery: {
      id: 'S2',
      patientId: 'P002',
      patientName: '李美華',
      roomId: 'OR2',
      roomName: '手術室二',
      type: 'elective',
      surgeonId: 'D2',
      surgeon: '張偉強',
      date: '2024-01-18',
      startTime: '14:00',
      endTime: '15:30',
      duration: 90,
      status: 'scheduled',
      priority: 'normal',
      notes: '膝關節鏡檢查'
    }
  },
  {
    id: 'OR3',
    name: '手術室三',
    status: 'maintenance',
    size: '小型',
    equipment: ['麻醉機', '監護儀'],
    cleaningTime: 20
  },
  {
    id: 'OR4',
    name: '手術室四',
    status: 'available',
    size: '大型',
    equipment: ['麻醉機', '監護儀', '神經導航', '顯微鏡'],
    cleaningTime: 35
  }
])

const viewMode = ref<'grid' | 'list'>('grid')
const showScheduleModal = ref(false)
const selectedSurgery = ref<Surgery | null>(null)
const currentDate = ref('2024-01-18')

const newSurgery = ref({
  patientId: '',
  roomId: '',
  surgeonId: '',
  type: 'elective',
  date: '',
  startTime: '',
  duration: 120,
  priority: 'normal',
  notes: ''
})

// 模擬可用數據
const availablePatients = ref([
  { id: 'P001', name: '張小明', diagnosis: '高血壓' },
  { id: 'P003', name: '陳大勇', diagnosis: '股骨骨折' },
  { id: 'P004', name: '王小寶', diagnosis: '急性支氣管炎' }
])

const surgeons = ref([
  { id: 'D1', name: '陳小美', specialty: '外科' },
  { id: 'D2', name: '張偉強', specialty: '骨科' },
  { id: 'D3', name: '林志雄', specialty: '神經外科' }
])

// 統計數據
const stats = computed(() => {
  const totalRooms = operatingRooms.value.length
  const availableRooms = operatingRooms.value.filter(room => room.status === 'available').length
  const inUseRooms = operatingRooms.value.filter(room => room.status === 'in-use').length
  const maintenanceRooms = operatingRooms.value.filter(room => room.status === 'maintenance').length
  const todaySurgeries = operatingRooms.value.reduce((count, room) => {
    if (room.currentSurgery?.date === currentDate.value) count++
    if (room.nextSurgery?.date === currentDate.value) count++
    return count
  }, 0)

  return {
    totalRooms,
    availableRooms,
    inUseRooms,
    maintenanceRooms,
    todaySurgeries
  }
})

// 可用手術室
const availableRooms = computed(() => 
  operatingRooms.value.filter(room => 
    room.status === 'available' || room.status === 'cleaning'
  )
)

// 即將開始的手術
const upcomingSurgeries = computed(() => {
  const surgeries: Surgery[] = []
  operatingRooms.value.forEach(room => {
    if (room.nextSurgery && room.nextSurgery.date === currentDate.value) {
      surgeries.push(room.nextSurgery)
    }
  })
  return surgeries.sort((a, b) => a.startTime.localeCompare(b.startTime))
})

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'available': '可用',
    'in-use': '使用中',
    'maintenance': '維護中',
    'cleaning': '清潔中'
  }
  return statusMap[status] || status
}

const getSurgeryTypeText = (type: string) => {
  const typeMap: { [key: string]: string } = {
    'elective': '擇期手術',
    'emergency': '急診手術',
    'major': '大手術',
    'minor': '小手術'
  }
  return typeMap[type] || type
}

const getSurgeryStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'scheduled': '已預約',
    'in-progress': '進行中',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return statusMap[status] || status
}

const selectRoom = (room: OperatingRoom) => {
  console.log('選擇手術室:', room.name)
}

const scheduleSurgery = (room: OperatingRoom) => {
  newSurgery.value.roomId = room.id
  showScheduleModal.value = true
}

const completeSurgery = (room: OperatingRoom) => {
  if (room.currentSurgery && confirm(`確定完成 ${room.currentSurgery.patientName} 的手術嗎？`)) {
    room.currentSurgery.status = 'completed'
    room.status = 'cleaning'
    
    // 模擬清潔完成
    setTimeout(() => {
      room.status = 'available'
      room.currentSurgery = undefined
    }, room.cleaningTime * 1000)
  }
}

const completeMaintenance = (room: OperatingRoom) => {
  room.status = 'available'
}

const setMaintenance = (room: OperatingRoom) => {
  room.status = 'maintenance'
  room.currentSurgery = undefined
  room.nextSurgery = undefined
}

const getTodaySurgeries = (room: OperatingRoom) => {
  const surgeries: Surgery[] = []
  if (room.currentSurgery && room.currentSurgery.date === currentDate.value) {
    surgeries.push(room.currentSurgery)
  }
  if (room.nextSurgery && room.nextSurgery.date === currentDate.value) {
    surgeries.push(room.nextSurgery)
  }
  return surgeries
}

const getSurgeryBlockStyle = (surgery: Surgery) => {
  const startHour = Number(surgery.startTime.split(':')[0])
  const startMinute = Number(surgery.startTime.split(':')[1])
  const durationHours = surgery.duration / 60
  
  const left = (startHour + startMinute / 60) * 4.1667 // 100% / 24 hours
  const width = durationHours * 4.1667
  
  return {
    left: `${left}%`,
    width: `${width}%`
  }
}

const viewSurgeryDetails = (surgery: Surgery) => {
  selectedSurgery.value = surgery
}

const startSurgery = (surgery: Surgery) => {
  const room = operatingRooms.value.find(r => r.id === surgery.roomId)
  if (room) {
    room.currentSurgery = surgery
    room.status = 'in-use'
    surgery.status = 'in-progress'
  }
}

const scheduleNewSurgery = () => {
  const patient = availablePatients.value.find(p => p.id === newSurgery.value.patientId)
  const room = operatingRooms.value.find(r => r.id === newSurgery.value.roomId)
  const surgeon = surgeons.value.find(d => d.id === newSurgery.value.surgeonId)
  
  if (!patient || !room || !surgeon) return

  const startTime = newSurgery.value.startTime
  const endTime = calculateEndTime(startTime, newSurgery.value.duration)
  
  const newSurgeryData: Surgery = {
    id: `S${Date.now()}`,
    patientId: newSurgery.value.patientId,
    patientName: patient.name,
    roomId: newSurgery.value.roomId,
    roomName: room.name,
    type: newSurgery.value.type,
    surgeonId: newSurgery.value.surgeonId,
    surgeon: surgeon.name,
    date: newSurgery.value.date,
    startTime: startTime,
    endTime: endTime,
    duration: newSurgery.value.duration,
    status: 'scheduled',
    priority: newSurgery.value.priority as 'normal' | 'high' | 'urgent',
    notes: newSurgery.value.notes
  }

  // 分配給手術室
  room.nextSurgery = newSurgeryData
  showScheduleModal.value = false
  resetNewSurgeryForm()
}

const calculateEndTime = (startTime: string, duration: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number)
  const totalMinutes = hours! * 60 + minutes! + duration
  const endHours = Math.floor(totalMinutes / 60) % 24
  const endMinutes = totalMinutes % 60
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`
}

const resetNewSurgeryForm = () => {
  newSurgery.value = {
    patientId: '',
    roomId: '',
    surgeonId: '',
    type: 'elective',
    date: '',
    startTime: '',
    duration: 120,
    priority: 'normal',
    notes: ''
  }
}

const previousDay = () => {
  // 簡化的日期切換邏輯
  console.log('前一天')
}

const nextDay = () => {
  // 簡化的日期切換邏輯
  console.log('後一天')
}

const refreshData = () => {
  console.log('刷新數據')
}

onMounted(() => {
  // 設置默認日期為今天
  const today = new Date()
  newSurgery.value.date = today.toISOString().split('T')[0]!
  currentDate.value = today.toISOString().split('T')[0]!
})
</script>

<style scoped>
.operating-rooms-view{
  padding:20px;
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

.total .stat-icon { background-color: var(--primary); }
.in-use .stat-icon { background-color: #ef4444; }
.available .stat-icon { background-color: var(--secondary); }
.maintenance .stat-icon { background-color: #f59e0b; }
.today .stat-icon { background-color: var(--primary); }

/* 手術室管理特定樣式 */
.operating-rooms-view {
  padding: 20px;
  background-color: #f8fafc;
  min-height: 100vh;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 20px;
  margin-top: 20px;
}

.rooms-section {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.schedule-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--dark);
  margin: 0;
  font-size: 18px;
}

.view-toggle {
  display: flex;
  gap: 4px;
  background: #f1f5f9;
  border-radius: 6px;
  padding: 4px;
}

.toggle-btn {
  padding: 6px 10px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: #64748b;
}

.toggle-btn.active {
  background: white;
  color: var(--primary);
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

/* 手術室卡片 */
.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.room-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
}

.room-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.room-card.status-available {
  border-left-color: var(--secondary);
}

.room-card.status-in-use {
  border-left-color: var(--primary);
}

.room-card.status-maintenance {
  border-left-color: #f59e0b;
}

.room-card.status-cleaning {
  border-left-color: #8b5cf6;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.room-number {
  font-size: 16px;
  font-weight: bold;
  color: var(--dark);
}

.room-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.room-status.status-available {
  background: #dcfce7;
  color: var(--secondary);
}

.room-status.status-in-use {
  background: #dbeafe;
  color: var(--primary);
}

.room-status.status-maintenance {
  background: #fef3c7;
  color: #d97706;
}

.room-status.status-cleaning {
  background: #e0e7ff;
  color: #8b5cf6;
}

.room-info {
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
}

/* 手術資訊 */
.current-surgery, .next-surgery {
  background: #f8fafc;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
  border-left: 3px solid var(--primary);
}

.next-surgery {
  border-left-color: #f59e0b;
}

.surgery-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 6px;
}

.patient-name {
  font-weight: 600;
  color: var(--dark);
  margin-bottom: 2px;
}

.surgery-type {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}

.surgery-time {
  font-size: 11px;
  color: #94a3b8;
}

.surgical-team {
  margin-top: 4px;
}

.surgeon {
  font-size: 11px;
  color: #64748b;
}

.room-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* 時間軸視圖 */
.timeline-view {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.timeline-header {
  margin-bottom: 10px;
}

.time-slots {
  display: flex;
  margin-left: 80px;
}

.time-slot {
  flex: 1;
  font-size: 10px;
  color: #64748b;
  text-align: center;
  padding: 4px 0;
}

.timeline-content {
  max-height: 400px;
  overflow-y: auto;
}

/* 時間軸行 */
.timeline-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  min-height: 50px;
}

.room-label {
  width: 80px;
  font-weight: 600;
  color: var(--dark);
  font-size: 14px;
  text-align: center;
  flex-shrink: 0;
}

.time-track {
  flex: 1;
  height: 40px;
  background: #f8fafc;
  border-radius: 6px;
  position: relative;
  border: 1px solid #e2e8f0;
}

.surgery-block {
  position: absolute;
  height: 36px;
  top: 2px;
  background: var(--primary);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  min-width: 80px;
}

.surgery-block:hover {
  transform: scale(1.02);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.surgery-block.priority-normal {
  background: var(--primary);
}

.surgery-block.priority-high {
  background: #f59e0b;
}

.surgery-block.priority-urgent {
  background: #ef4444;
}

.surgery-info {
  padding: 4px 6px;
  color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.surgery-info .patient {
  font-weight: 600;
  font-size: 12px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.surgery-info .type {
  font-size: 10px;
  opacity: 0.9;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.surgery-info .time {
  font-size: 9px;
  opacity: 0.8;
  line-height: 1.2;
}

/* 即將開始的手術 */
.upcoming-surgeries {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.upcoming-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.upcoming-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid var(--primary);
  transition: all 0.2s ease;
}

.upcoming-item:hover {
  background: #f1f5f9;
  transform: translateX(2px);
}

.surgery-time {
  font-weight: 600;
  color: var(--dark);
  font-size: 14px;
  min-width: 60px;
}

.surgery-details {
  flex: 1;
}

.patient-room {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.patient-room .patient {
  font-weight: 600;
  color: var(--dark);
}

.patient-room .room {
  font-size: 12px;
  color: #64748b;
  background: #e2e8f0;
  padding: 2px 6px;
  border-radius: 4px;
}

.surgery-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
}

.surgery-actions {
  flex-shrink: 0;
}

/* 列表視圖 */
.rooms-list {
  margin-top: 15px;
}

.rooms-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.rooms-table th {
  background: #f8fafc;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
}

.rooms-table td {
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.room-name .name {
  font-weight: 600;
  color: var(--dark);
}

.room-name .equipment {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}



/* 日期導航 */
.date-navigation {
  display: flex;
  align-items: center;
  gap: 12px;
}

.current-date {
  font-weight: 600;
  color: var(--dark);
  min-width: 120px;
  text-align: center;
}

.nav-btn {
  padding: 6px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* 響應式設計 */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .schedule-section {
    order: -1;
  }
}

@media (max-width: 768px) {
  .rooms-grid {
    grid-template-columns: 1fr;
  }
  
  .timeline-row {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 15px;
  }
  
  .room-label {
    width: 100%;
    text-align: left;
    margin-bottom: 8px;
    padding-left: 10px;
  }
  
  .time-slots {
    margin-left: 0;
    overflow-x: auto;
  }
  
  .time-slot {
    min-width: 60px;
  }
  
  .upcoming-item {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .surgery-time {
    min-width: auto;
  }
  
  .surgery-actions {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .rooms-table {
    font-size: 12px;
  }
  
  .rooms-table th,
  .rooms-table td {
    padding: 8px 6px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
}

/* 手術詳情樣式 */
.surgery-details .detail-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
}

.surgery-details .detail-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.surgery-details .detail-section h4 {
  margin-bottom: 12px;
  color: var(--dark);
  font-size: 16px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}




/* 表單區段樣式 */
.form-section {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h4 {
  margin-bottom: 15px;
  color: var(--dark);
  font-size: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
}

/* 滾動條樣式 */
.timeline-content::-webkit-scrollbar {
  width: 6px;
}

.timeline-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.timeline-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.timeline-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}


</style>