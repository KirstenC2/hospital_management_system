<template>
  <div class="staff-view">
    <div class="header">
      <h1>員工管理</h1>
      <div class="header-actions">
        <button class="btn btn-primary" @click="showAddStaffModal = true">
          <i class="fas fa-user-plus"></i> 新增員工
        </button>
        <button class="btn btn-outline" @click="refreshStaff">
          <i class="fas fa-sync-alt"></i> 刷新
        </button>
      </div>
    </div>

    <!-- 搜索和篩選 -->
    <div class="filters-section">
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜尋員工姓名、職位、部門..."
          @input="handleSearch"
        >
      </div>
      
      <div class="filter-group">
        <div class="filter-title">部門篩選:</div>
        <div class="filter-buttons">
          <button 
            v-for="dept in departmentOptions" 
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
            全部
          </button>
        </div>
      </div>

      <div class="filter-group">
        <div class="filter-title">職位篩選:</div>
        <div class="filter-buttons">
          <button 
            v-for="position in positionOptions" 
            :key="position.value"
            class="filter-btn"
            :class="{ active: selectedPosition === position.value }"
            @click="selectPosition(position.value)"
          >
            {{ position.label }}
          </button>
          <button 
            class="filter-btn"
            :class="{ active: selectedPosition === 'all' }"
            @click="selectPosition('all')"
          >
            全部
          </button>
        </div>
      </div>

      <div class="filter-group">
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
            全部
          </button>
        </div>
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
            <div class="stat-value">{{ stats.totalStaff }}</div>
            <div class="stat-label">總員工數</div>
          </div>
        </div>
        <div class="stat-card doctors">
          <div class="stat-icon">
            <i class="fas fa-user-md"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.doctorCount }}</div>
            <div class="stat-label">醫生</div>
          </div>
        </div>
        <div class="stat-card nurses">
          <div class="stat-icon">
            <i class="fas fa-user-nurse"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.nurseCount }}</div>
            <div class="stat-label">護理師</div>
          </div>
        </div>
        <div class="stat-card admin">
          <div class="stat-icon">
            <i class="fas fa-user-tie"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.adminCount }}</div>
            <div class="stat-label">行政人員</div>
          </div>
        </div>
        <div class="stat-card active">
          <div class="stat-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.activeCount }}</div>
            <div class="stat-label">在職中</div>
          </div>
        </div>
      </div>

      <!-- 視圖切換 -->
      <div class="view-controls">
        <div class="view-toggle">
          <button 
            class="toggle-btn" 
            :class="{ active: viewMode === 'grid' }"
            @click="viewMode = 'grid'"
          >
            <i class="fas fa-th"></i>
            卡片視圖
          </button>
          <button 
            class="toggle-btn" 
            :class="{ active: viewMode === 'list' }"
            @click="viewMode = 'list'"
          >
            <i class="fas fa-list"></i>
            列表視圖
          </button>
          <button 
            class="toggle-btn" 
            :class="{ active: viewMode === 'table' }"
            @click="viewMode = 'table'"
          >
            <i class="fas fa-table"></i>
            表格視圖
          </button>
        </div>
        
        <div class="sort-controls">
          <select v-model="sortBy" @change="sortStaff">
            <option value="name">按姓名排序</option>
            <option value="department">按部門排序</option>
            <option value="position">按職位排序</option>
            <option value="hireDate">按入職日期</option>
          </select>
        </div>
      </div>

      <!-- 卡片視圖 -->
      <div v-if="viewMode === 'grid'" class="staff-grid">
        <div 
          v-for="staff in filteredStaff" 
          :key="staff.id"
          class="staff-card"
          :class="`status-${staff.status}`"
        >
          <div class="staff-avatar">
            <img v-if="staff.avatar" :src="staff.avatar" :alt="staff.name">
            <div v-else class="avatar-placeholder">
              {{ staff.name.charAt(0) }}
            </div>
            <div class="online-status" :class="`status-${staff.status}`"></div>
          </div>

          <div class="staff-info">
            <div class="staff-name">{{ staff.name }}</div>
            <div class="staff-position">{{ staff.position }}</div>
            <div class="staff-department">{{ staff.department }}</div>
            
            <div class="staff-details">
              <div class="detail-item">
                <i class="fas fa-id-badge"></i>
                <span>工號: {{ staff.employeeId }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-phone"></i>
                <span>{{ staff.phone }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-envelope"></i>
                <span>{{ staff.email }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-calendar-alt"></i>
                <span>入職: {{ staff.hireDate }}</span>
              </div>
            </div>

            <div class="staff-skills" v-if="staff.skills && staff.skills.length > 0">
              <div class="skills-label">專長:</div>
              <div class="skills-list">
                <span 
                  v-for="skill in staff.skills.slice(0, 3)" 
                  :key="skill"
                  class="skill-tag"
                >
                  {{ skill }}
                </span>
                <span v-if="staff.skills.length > 3" class="skill-more">
                  +{{ staff.skills.length - 3 }}
                </span>
              </div>
            </div>
          </div>

          <div class="staff-actions">
            <button class="btn btn-sm btn-outline" @click="viewStaff(staff)">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-outline" @click="editStaff(staff)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-primary" @click="contactStaff(staff)">
              <i class="fas fa-phone"></i>
            </button>
            <button 
              v-if="staff.status === 'active'" 
              class="btn btn-sm btn-warning"
              @click="toggleStatus(staff)"
            >
              <i class="fas fa-pause"></i>
            </button>
            <button 
              v-else 
              class="btn btn-sm btn-success"
              @click="toggleStatus(staff)"
            >
              <i class="fas fa-play"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 列表視圖 -->
      <div v-if="viewMode === 'list'" class="staff-list">
        <div 
          v-for="staff in filteredStaff" 
          :key="staff.id"
          class="staff-list-item"
          :class="`status-${staff.status}`"
        >
          <div class="list-avatar">
            <img v-if="staff.avatar" :src="staff.avatar" :alt="staff.name">
            <div v-else class="avatar-placeholder">
              {{ staff.name.charAt(0) }}
            </div>
          </div>

          <div class="list-info">
            <div class="main-info">
              <div class="staff-name">{{ staff.name }}</div>
              <div class="staff-position">{{ staff.position }}</div>
              <div class="staff-department">{{ staff.department }}</div>
            </div>
            
            <div class="contact-info">
              <div class="contact-item">
                <i class="fas fa-phone"></i>
                <span>{{ staff.phone }}</span>
              </div>
              <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <span>{{ staff.email }}</span>
              </div>
            </div>

            <div class="meta-info">
              <div class="employee-id">工號: {{ staff.employeeId }}</div>
              <div class="hire-date">入職: {{ staff.hireDate }}</div>
            </div>
          </div>

          <div class="list-actions">
            <button class="btn btn-sm btn-outline" @click="viewStaff(staff)">
              查看
            </button>
            <button class="btn btn-sm btn-primary" @click="contactStaff(staff)">
              聯繫
            </button>
          </div>
        </div>
      </div>

      <!-- 表格視圖 -->
      <div v-if="viewMode === 'table'" class="staff-table-section">
        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th>員工資訊</th>
                <th>職位</th>
                <th>部門</th>
                <th>聯繫方式</th>
                <th>入職日期</th>
                <th>狀態</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="staff in filteredStaff" :key="staff.id">
                <td class="staff-info-cell">
                  <div class="staff-avatar-name">
                    <div class="table-avatar">
                      <img v-if="staff.avatar" :src="staff.avatar" :alt="staff.name">
                      <div v-else class="avatar-placeholder">
                        {{ staff.name.charAt(0) }}
                      </div>
                    </div>
                    <div class="staff-details">
                      <div class="staff-name">{{ staff.name }}</div>
                      <div class="employee-id">{{ staff.employeeId }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="position-info">
                    <div class="position">{{ staff.position }}</div>
                    <div v-if="staff.specialty" class="specialty">
                      {{ staff.specialty }}
                    </div>
                  </div>
                </td>
                <td>
                  <span class="department-badge">{{ staff.department }}</span>
                </td>
                <td class="contact-cell">
                  <div class="contact-info">
                    <div class="phone">{{ staff.phone }}</div>
                    <div class="email">{{ staff.email }}</div>
                  </div>
                </td>
                <td>{{ staff.hireDate }}</td>
                <td>
                  <span class="status" :class="`status-${staff.status}`">
                    {{ getStatusText(staff.status) }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn btn-sm btn-outline" @click="viewStaff(staff)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline" @click="editStaff(staff)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" @click="contactStaff(staff)">
                      <i class="fas fa-phone"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分頁 -->
        <div class="pagination" v-if="filteredStaff.length > pageSize">
          <div class="pagination-info">
            顯示第 {{ startIndex + 1 }} - {{ Math.min(endIndex, filteredStaff.length) }} 筆，共 {{ filteredStaff.length }} 筆記錄
          </div>
          <div class="pagination-controls">
            <button 
              class="pagination-btn" 
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            
            <span class="pagination-page">
              第 {{ currentPage }} 頁 / 共 {{ totalPages }} 頁
            </span>
            
            <button 
              class="pagination-btn" 
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredStaff.length === 0" class="empty-state">
        <i class="fas fa-users fa-3x"></i>
        <p>沒有找到符合條件的員工</p>
        <button class="btn btn-primary" @click="showAddStaffModal = true">
          <i class="fas fa-user-plus"></i>
          新增員工
        </button>
      </div>
    </div>

    <!-- 新增員工模態框 -->
    <div v-if="showAddStaffModal" class="modal-overlay" @click="showAddStaffModal = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>新增員工</h3>
          <button class="close-btn" @click="showAddStaffModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addNewStaff">
            <div class="form-section">
              <h4>基本資訊</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>姓名:</label>
                  <input v-model="newStaff.name" type="text" required>
                </div>
                <div class="form-group">
                  <label>性別:</label>
                  <select v-model="newStaff.gender" required>
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>身份證字號:</label>
                  <input v-model="newStaff.idNumber" type="text" required>
                </div>
                <div class="form-group">
                  <label>出生日期:</label>
                  <input v-model="newStaff.birthDate" type="date" required>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h4>工作資訊</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>部門:</label>
                  <select v-model="newStaff.department" required>
                    <option value="">請選擇部門</option>
                    <option 
                      v-for="dept in departmentOptions" 
                      :key="dept.value" 
                      :value="dept.label"
                    >
                      {{ dept.label }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>職位:</label>
                  <select v-model="newStaff.position" required>
                    <option value="">請選擇職位</option>
                    <option 
                      v-for="position in positionOptions" 
                      :key="position.value" 
                      :value="position.label"
                    >
                      {{ position.label }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>專業領域:</label>
                  <input v-model="newStaff.specialty" type="text">
                </div>
                <div class="form-group">
                  <label>職級:</label>
                  <select v-model="newStaff.rank">
                    <option value="初級">初級</option>
                    <option value="中級">中級</option>
                    <option value="高級">高級</option>
                    <option value="資深">資深</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>專長技能:</label>
                <div class="skills-input">
                  <input 
                    v-model="skillInput" 
                    type="text" 
                    placeholder="輸入技能後按Enter添加"
                    @keydown.enter="addSkill"
                  >
                  <div class="skills-tags">
                    <span 
                      v-for="(skill, index) in newStaff.skills" 
                      :key="index"
                      class="skill-tag"
                    >
                      {{ skill }}
                      <button type="button" @click="removeSkill(index)">&times;</button>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h4>聯繫資訊</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>手機號碼:</label>
                  <input v-model="newStaff.phone" type="tel" required>
                </div>
                <div class="form-group">
                  <label>電子郵件:</label>
                  <input v-model="newStaff.email" type="email" required>
                </div>
              </div>

              <div class="form-group">
                <label>住址:</label>
                <input v-model="newStaff.address" type="text">
              </div>
            </div>

            <div class="form-section">
              <h4>帳號資訊</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>員工編號:</label>
                  <input v-model="newStaff.employeeId" type="text" required>
                </div>
                <div class="form-group">
                  <label>入職日期:</label>
                  <input v-model="newStaff.hireDate" type="date" required>
                </div>
              </div>

              <div class="form-group">
                <label>狀態:</label>
                <select v-model="newStaff.status" required>
                  <option value="active">在職</option>
                  <option value="inactive">離職</option>
                  <option value="leave">休假</option>
                </select>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">新增員工</button>
              <button type="button" class="btn btn-outline" @click="showAddStaffModal = false">
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 員工詳情模態框 -->
    <div v-if="selectedStaff" class="modal-overlay" @click="selectedStaff = null">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>員工詳情 - {{ selectedStaff.name }}</h3>
          <button class="close-btn" @click="selectedStaff = null">&times;</button>
        </div>
        <div class="modal-body">
          <div class="staff-details">
            <div class="detail-header">
              <div class="avatar-large">
                <img v-if="selectedStaff.avatar" :src="selectedStaff.avatar" :alt="selectedStaff.name">
                <div v-else class="avatar-placeholder large">
                  {{ selectedStaff.name.charAt(0) }}
                </div>
              </div>
              <div class="header-info">
                <h4>{{ selectedStaff.name }}</h4>
                <p>{{ selectedStaff.position }} • {{ selectedStaff.department }}</p>
                <div class="status-badge" :class="`status-${selectedStaff.status}`">
                  {{ getStatusText(selectedStaff.status) }}
                </div>
              </div>
            </div>

            <div class="detail-sections">
              <div class="detail-section">
                <h5>基本資訊</h5>
                <div class="detail-grid">
                  <div class="detail-item">
                    <label>員工編號:</label>
                    <span>{{ selectedStaff.employeeId }}</span>
                  </div>
                  <div class="detail-item">
                    <label>性別:</label>
                    <span>{{ selectedStaff.gender }}</span>
                  </div>
                  <div class="detail-item">
                    <label>身份證字號:</label>
                    <span>{{ selectedStaff.idNumber }}</span>
                  </div>
                  <div class="detail-item">
                    <label>出生日期:</label>
                    <span>{{ selectedStaff.birthDate }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h5>工作資訊</h5>
                <div class="detail-grid">
                  <div class="detail-item">
                    <label>部門:</label>
                    <span>{{ selectedStaff.department }}</span>
                  </div>
                  <div class="detail-item">
                    <label>職位:</label>
                    <span>{{ selectedStaff.position }}</span>
                  </div>
                  <div class="detail-item">
                    <label>專業領域:</label>
                    <span>{{ selectedStaff.specialty || '未填寫' }}</span>
                  </div>
                  <div class="detail-item">
                    <label>職級:</label>
                    <span>{{ selectedStaff.rank || '未設定' }}</span>
                  </div>
                  <div class="detail-item">
                    <label>入職日期:</label>
                    <span>{{ selectedStaff.hireDate }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-section" v-if="selectedStaff.skills && selectedStaff.skills.length > 0">
                <h5>專長技能</h5>
                <div class="skills-display">
                  <span 
                    v-for="skill in selectedStaff.skills" 
                    :key="skill"
                    class="skill-tag"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>

              <div class="detail-section">
                <h5>聯繫資訊</h5>
                <div class="detail-grid">
                  <div class="detail-item">
                    <label>手機號碼:</label>
                    <span>{{ selectedStaff.phone }}</span>
                  </div>
                  <div class="detail-item">
                    <label>電子郵件:</label>
                    <span>{{ selectedStaff.email }}</span>
                  </div>
                  <div class="detail-item">
                    <label>住址:</label>
                    <span>{{ selectedStaff.address || '未填寫' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Staff {
  id: string
  name: string
  gender: string
  idNumber: string
  birthDate: string
  employeeId: string
  department: string
  position: string
  specialty?: string
  rank?: string
  phone: string
  email: string
  address?: string
  hireDate: string
  status: 'active' | 'inactive' | 'leave'
  skills: string[]
  avatar?: string
}

// 部門選項
const departmentOptions = [
  { value: 'internal', label: '內科' },
  { value: 'surgery', label: '外科' },
  { value: 'pediatrics', label: '兒科' },
  { value: 'obstetrics', label: '婦產科' },
  { value: 'orthopedics', label: '骨科' },
  { value: 'cardiology', label: '心臟科' },
  { value: 'neurology', label: '神經科' },
  { value: 'emergency', label: '急診科' },
  { value: 'nursing', label: '護理部' },
  { value: 'administration', label: '行政部' },
  { value: 'pharmacy', label: '藥劑科' },
  { value: 'laboratory', label: '檢驗科' }
]

// 職位選項
const positionOptions = [
  { value: 'doctor', label: '醫生' },
  { value: 'nurse', label: '護理師' },
  { value: 'specialist', label: '專科醫師' },
  { value: 'surgeon', label: '外科醫師' },
  { value: 'physician', label: '內科醫師' },
  { value: 'head-nurse', label: '護理長' },
  { value: 'administrator', label: '行政人員' },
  { value: 'manager', label: '部門主管' },
  { value: 'technician', label: '技術員' },
  { value: 'pharmacist', label: '藥師' },
  { value: 'therapist', label: '治療師' }
]

// 狀態選項
const statusOptions = [
  { value: 'active', label: '在職' },
  { value: 'inactive', label: '離職' },
  { value: 'leave', label: '休假' }
]

// 模擬員工數據
const staffMembers = ref<Staff[]>([
  {
    id: '1',
    name: '王大明',
    gender: '男',
    idNumber: 'A123456789',
    birthDate: '1980-05-15',
    employeeId: 'DOC001',
    department: '內科',
    position: '醫生',
    specialty: '心臟內科',
    rank: '資深',
    phone: '0912-345-678',
    email: 'wang.daming@hospital.com',
    address: '台北市信義區松仁路100號',
    hireDate: '2010-03-01',
    status: 'active',
    skills: ['心導管手術', '高血壓治療', '心臟超音波']
  },
  {
    id: '2',
    name: '陳小美',
    gender: '女',
    idNumber: 'B234567890',
    birthDate: '1985-08-22',
    employeeId: 'DOC002',
    department: '外科',
    position: '外科醫師',
    specialty: '一般外科',
    rank: '高級',
    phone: '0933-456-789',
    email: 'chen.xiaomei@hospital.com',
    hireDate: '2015-07-15',
    status: 'active',
    skills: ['腹腔鏡手術', '闌尾切除', '膽囊切除']
  },
  {
    id: '3',
    name: '林志雄',
    gender: '男',
    idNumber: 'C345678901',
    birthDate: '1978-12-10',
    employeeId: 'DOC003',
    department: '兒科',
    position: '專科醫師',
    specialty: '小兒心臟科',
    rank: '資深',
    phone: '0922-567-890',
    email: 'lin.zhixiong@hospital.com',
    hireDate: '2008-11-20',
    status: 'active',
    skills: ['小兒心臟超音波', '先天性心臟病治療']
  },
  {
    id: '4',
    name: '吳美麗',
    gender: '女',
    idNumber: 'D456789012',
    birthDate: '1990-03-25',
    employeeId: 'NUR001',
    department: '護理部',
    position: '護理長',
    specialty: '重症護理',
    rank: '高級',
    phone: '0911-222-333',
    email: 'wu.meili@hospital.com',
    hireDate: '2018-06-01',
    status: 'active',
    skills: ['ICU護理', '急救技術', '護理管理']
  },
  {
    id: '5',
    name: '張偉強',
    gender: '男',
    idNumber: 'E567890123',
    birthDate: '1982-07-18',
    employeeId: 'DOC004',
    department: '骨科',
    position: '外科醫師',
    specialty: '骨科手術',
    rank: '中級',
    phone: '0934-555-666',
    email: 'zhang.weiqiang@hospital.com',
    hireDate: '2019-02-14',
    status: 'leave',
    skills: ['關節置換', '骨折固定', '運動醫學']
  },
  {
    id: '6',
    name: '劉心怡',
    gender: '女',
    idNumber: 'F678901234',
    birthDate: '1988-11-30',
    employeeId: 'ADM001',
    department: '行政部',
    position: '行政人員',
    phone: '0920-888-999',
    email: 'liu.xinyi@hospital.com',
    hireDate: '2020-01-10',
    status: 'active',
    skills: ['文書處理', '檔案管理', '會議安排']
  }
])

const searchQuery = ref('')
const selectedDepartment = ref<string | 'all'>('all')
const selectedPosition = ref<string | 'all'>('all')
const selectedStatus = ref<string | 'all'>('all')
const viewMode = ref<'grid' | 'list' | 'table'>('grid')
const sortBy = ref('name')
const showAddStaffModal = ref(false)
const selectedStaff = ref<Staff | null>(null)
const currentPage = ref(1)
const pageSize = 10
const skillInput = ref('')

const newStaff = ref({
  name: '',
  gender: '男',
  idNumber: '',
  birthDate: '',
  employeeId: '',
  department: '',
  position: '',
  specialty: '',
  rank: '初級',
  phone: '',
  email: '',
  address: '',
  hireDate: '',
  status: 'active',
  skills: [] as string[]
})

// 統計數據
const stats = computed(() => {
  const totalStaff = staffMembers.value.length
  const doctorCount = staffMembers.value.filter(s => 
    s.position === '醫生' || s.position === '外科醫師' || s.position === '專科醫師'
  ).length
  const nurseCount = staffMembers.value.filter(s => 
    s.position.includes('護理')
  ).length
  const adminCount = staffMembers.value.filter(s => 
    s.department === '行政部' || s.position === '行政人員'
  ).length
  const activeCount = staffMembers.value.filter(s => s.status === 'active').length

  return {
    totalStaff,
    doctorCount,
    nurseCount,
    adminCount,
    activeCount
  }
})

// 過濾後的員工
const filteredStaff = computed(() => {
  let filtered = staffMembers.value

  // 搜索過濾
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(staff => 
      staff.name.toLowerCase().includes(query) ||
      staff.employeeId.toLowerCase().includes(query) ||
      staff.position.toLowerCase().includes(query) ||
      staff.department.toLowerCase().includes(query) ||
      staff.specialty?.toLowerCase().includes(query)
    )
  }

  // 部門過濾
  if (selectedDepartment.value !== 'all') {
    const deptLabel = departmentOptions.find(d => d.value === selectedDepartment.value)?.label
    filtered = filtered.filter(staff => staff.department === deptLabel)
  }

  // 職位過濾
  if (selectedPosition.value !== 'all') {
    const positionLabel = positionOptions.find(p => p.value === selectedPosition.value)?.label
    filtered = filtered.filter(staff => staff.position === positionLabel)
  }

  // 狀態過濾
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(staff => staff.status === selectedStatus.value)
  }

  // 排序
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'department':
        return a.department.localeCompare(b.department)
      case 'position':
        return a.position.localeCompare(b.position)
      case 'hireDate':
        return new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime()
      default:
        return 0
    }
  })

  return filtered
})

// 分頁數據
const paginatedStaff = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredStaff.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredStaff.value.length / pageSize))
const startIndex = computed(() => (currentPage.value - 1) * pageSize)
const endIndex = computed(() => Math.min(currentPage.value * pageSize, filteredStaff.value.length))

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'active': '在職',
    'inactive': '離職',
    'leave': '休假'
  }
  return statusMap[status] || status
}

const handleSearch = () => {
  currentPage.value = 1
}

const selectDepartment = (department: string | 'all') => {
  selectedDepartment.value = department
  currentPage.value = 1
}

const selectPosition = (position: string | 'all') => {
  selectedPosition.value = position
  currentPage.value = 1
}

const selectStatus = (status: string | 'all') => {
  selectedStatus.value = status
  currentPage.value = 1
}

const sortStaff = () => {
  currentPage.value = 1
}

const viewStaff = (staff: Staff) => {
  selectedStaff.value = staff
}

const editStaff = (staff: Staff) => {
  alert(`編輯員工: ${staff.name}`)
}

const contactStaff = (staff: Staff) => {
  alert(`聯繫 ${staff.name}: ${staff.phone}`)
}

const toggleStatus = (staff: Staff) => {
  if (staff.status === 'active') {
    staff.status = 'inactive'
  } else {
    staff.status = 'active'
  }
}

const addSkill = (event: Event) => {
  event.preventDefault()
  if (skillInput.value.trim()) {
    newStaff.value.skills.push(skillInput.value.trim())
    skillInput.value = ''
  }
}

const removeSkill = (index: number) => {
  newStaff.value.skills.splice(index, 1)
}

const addNewStaff = () => {
  const newStaffData: Staff = {
    id: Date.now().toString(),
    name: newStaff.value.name,
    gender: newStaff.value.gender,
    idNumber: newStaff.value.idNumber,
    birthDate: newStaff.value.birthDate,
    employeeId: newStaff.value.employeeId,
    department: newStaff.value.department,
    position: newStaff.value.position,
    specialty: newStaff.value.specialty || undefined,
    rank: newStaff.value.rank || undefined,
    phone: newStaff.value.phone,
    email: newStaff.value.email,
    address: newStaff.value.address || undefined,
    hireDate: newStaff.value.hireDate,
    status: newStaff.value.status as 'active' | 'inactive' | 'leave',
    skills: [...newStaff.value.skills]
  }

  staffMembers.value.push(newStaffData)
  showAddStaffModal.value = false
  resetNewStaffForm()
}

const resetNewStaffForm = () => {
  newStaff.value = {
    name: '',
    gender: '男',
    idNumber: '',
    birthDate: '',
    employeeId: '',
    department: '',
    position: '',
    specialty: '',
    rank: '初級',
    phone: '',
    email: '',
    address: '',
    hireDate: '',
    status: 'active',
    skills: []
  }
  skillInput.value = ''
}

const refreshStaff = () => {
  console.log('刷新員工數據')
}

onMounted(() => {
  // 設置默認日期為今天
  const today = new Date()
  newStaff.value.hireDate = today.toISOString().split('T')[0]!
  newStaff.value.birthDate = '1990-01-01' // 默認出生日期
})
</script>

<style scoped>

/* 員工管理特定樣式 */
.staff-view {
  padding: 20px;
  background-color: #f8fafc;
  min-height: 100vh;
}

.search-bar {
    display: flex;
    align-items: center;
    background: #f8fafc;
    border-radius: 8px;
    padding: 10px 15px;
    border: 1px solid #e2e8f0;
}


/* 視圖控制 */
.view-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.view-toggle {
  display: flex;
  gap: 8px;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 4px;
}

.toggle-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: #64748b;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: white;
  color: var(--primary);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.sort-controls select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
}

/* 員工卡片視圖 */
.staff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.staff-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  position: relative;
}

.staff-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.staff-card.status-active {
  border-left-color: var(--secondary);
}

.staff-card.status-inactive {
  border-left-color: #64748b;
}

.staff-card.status-leave {
  border-left-color: #f59e0b;
}

.staff-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 15px;
}

.staff-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.avatar-placeholder.large {
  width: 100px;
  height: 100px;
  font-size: 36px;
}

.online-status {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.online-status.status-active {
  background: var(--secondary);
}

.online-status.status-inactive {
  background: #64748b;
}

.online-status.status-leave {
  background: #f59e0b;
}

.staff-info {
  text-align: center;
  margin-bottom: 15px;
}

.staff-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--dark);
  margin-bottom: 4px;
}

.staff-position {
  font-size: 14px;
  color: var(--primary);
  font-weight: 500;
  margin-bottom: 2px;
}

.staff-department {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 12px;
}

.staff-details {
  text-align: left;
  margin-bottom: 15px;
}


.staff-skills {
  text-align: left;
}

.skills-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 6px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.skill-tag {
  background: #e0e7ff;
  color: #3730a3;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.skill-more {
  background: #f1f5f9;
  color: #64748b;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
}

.staff-actions {
  display: flex;
  justify-content: center;
  gap: 6px;
}

/* 列表視圖 */
.staff-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.staff-list-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border-left: 4px solid transparent;
}

.staff-list-item.status-active {
  border-left-color: var(--secondary);
}

.staff-list-item.status-inactive {
  border-left-color: #64748b;
}

.staff-list-item.status-leave {
  border-left-color: #f59e0b;
}

.list-avatar {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}

.list-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.list-info {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  align-items: center;
}

.main-info .staff-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--dark);
  margin-bottom: 2px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
}

.meta-info {
  font-size: 12px;
  color: #64748b;
}

.list-actions {
  display: flex;
  gap: 6px;
}

/* 表格視圖 */
.staff-table-section {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.staff-info-cell {
  padding: 8px 12px;
}

.staff-avatar-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.table-avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.table-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.staff-details .staff-name {
  font-weight: 600;
  color: var(--dark);
  margin-bottom: 2px;
}

.employee-id {
  font-size: 12px;
  color: #64748b;
}

.position-info .position {
  font-weight: 500;
  color: var(--dark);
}

.position-info .specialty {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.department-badge {
  background: #e0e7ff;
  color: #3730a3;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.contact-cell .phone {
  font-weight: 500;
  color: var(--dark);
}

.contact-cell .email {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-active {
  background: #dcfce7;
  color: var(--secondary);
}

.status-inactive {
  background: #f1f5f9;
  color: #64748b;
}

.status-leave {
  background: #fef3c7;
  color: #d97706;
}

/* 員工詳情 */
.detail-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
}

.avatar-large {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.avatar-large img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.header-info h4 {
  margin: 0 0 4px 0;
  color: var(--dark);
  font-size: 20px;
}

.header-info p {
  margin: 0 0 8px 0;
  color: #64748b;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.detail-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-section h5 {
  margin: 0 0 12px 0;
  color: var(--dark);
  font-size: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.skills-display {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* 技能輸入 */
.skills-input {
  margin-top: 8px;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.skills-tags .skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #e0e7ff;
  color: #3730a3;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.skills-tags .skill-tag button {
  background: none;
  border: none;
  color: #3730a3;
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skills-tags .skill-tag button:hover {
  background: #c7d2fe;
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .staff-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  
  .list-info {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .view-controls {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .view-toggle {
    justify-content: center;
  }
  
  .staff-grid {
    grid-template-columns: 1fr;
  }
  
  .staff-list-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .list-info {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .list-actions {
    justify-content: center;
  }
  
  .detail-header {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .toggle-btn {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .staff-card {
    padding: 15px;
  }
  
  .staff-avatar {
    width: 60px;
    height: 60px;
  }
}
</style>