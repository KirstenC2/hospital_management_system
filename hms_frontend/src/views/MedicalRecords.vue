<template>
    <div class="medical-records-view">
        <div class="header">
            <h1>病歷管理</h1>
            <div class="header-actions">
                <button class="btn btn-primary" @click="showAddRecordModal = true">
                    <i class="fas fa-plus"></i> 新增病歷
                </button>
                <button class="btn btn-outline" @click="refreshRecords">
                    <i class="fas fa-sync-alt"></i> 刷新
                </button>
            </div>
        </div>
        <!-- 統計卡片 -->
        <div class="stats-cards">
            <div class="stat-card total">
                <div class="stat-icon">
                    <i class="fas fa-file-medical"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-value">{{ stats.totalRecords }}</div>
                    <div class="stat-label">總病歷數</div>
                </div>
            </div>
            <div class="stat-card active">
                <div class="stat-icon">
                    <i class="fas fa-user-injured"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-value">{{ stats.activeRecords }}</div>
                    <div class="stat-label">治療中</div>
                </div>
            </div>
            <div class="stat-card completed">
                <div class="stat-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-value">{{ stats.completedRecords }}</div>
                    <div class="stat-label">已完成</div>
                </div>
            </div>
            <div class="stat-card critical">
                <div class="stat-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="stat-info">
                    <div class="stat-value">{{ stats.criticalRecords }}</div>
                    <div class="stat-label">重症病例</div>
                </div>
            </div>
        </div>

        <!-- 搜索和篩選 -->
        <div class="filters-section">
            <div class="search-bar">
                <i class="fas fa-search"></i>
                <input v-model="searchQuery" type="text" placeholder="搜尋病人姓名、病歷號、診斷..." @input="handleSearch">
            </div>

            <div class="filter-group">
                <div class="filter-title">狀態篩選:</div>
                <div class="filter-buttons">
                    <button v-for="status in statusOptions" :key="status.value" class="filter-btn"
                        :class="{ active: selectedStatus === status.value }" @click="selectStatus(status.value)">
                        {{ status.label }}
                    </button>
                    <button class="filter-btn" :class="{ active: selectedStatus === 'all' }"
                        @click="selectStatus('all')">
                        全部
                    </button>
                </div>
            </div>

            <div class="filter-group">
                <div class="filter-title">科室篩選:</div>
                <div class="filter-buttons">
                    <button v-for="dept in departmentOptions" :key="dept.value" class="filter-btn"
                        :class="{ active: selectedDepartment === dept.value }" @click="selectDepartment(dept.value)">
                        {{ dept.label }}
                    </button>
                    <button class="filter-btn" :class="{ active: selectedDepartment === 'all' }"
                        @click="selectDepartment('all')">
                        全部
                    </button>
                </div>
            </div>
        </div>

        <div class="content">


            <!-- 病歷表格 -->
            <div class="records-section">
                <div class="section-header">
                    <div class="section-title">
                        <i class="fas fa-list"></i>
                        <span>病歷列表 ({{ filteredRecords.length }})</span>
                    </div>
                    <div class="table-actions">
                        <button class="btn btn-outline btn-sm" @click="exportRecords">
                            <i class="fas fa-download"></i>
                            匯出
                        </button>
                        <button class="btn btn-outline btn-sm" @click="printRecords">
                            <i class="fas fa-print"></i>
                            列印
                        </button>
                    </div>
                </div>

                <div class="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>病歷號</th>
                                <th>病人資訊</th>
                                <th>診斷</th>
                                <th>主治醫生</th>
                                <th>科室</th>
                                <th>狀態</th>
                                <th>入院日期</th>
                                <th>最後更新</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="record in paginatedRecords" :key="record.id">
                                <td class="record-id">
                                    <div class="id-number">{{ record.id }}</div>
                                    <div v-if="record.priority === 'high'" class="priority-badge high">
                                        <i class="fas fa-exclamation-circle"></i>
                                        緊急
                                    </div>
                                </td>
                                <td class="patient-info">
                                    <div class="patient-name">{{ record.patientName }}</div>
                                    <div class="patient-details">
                                        {{ record.patientGender }} / {{ record.patientAge }}歲
                                        <span v-if="record.patientPhone">• {{ record.patientPhone }}</span>
                                    </div>
                                </td>
                                <td class="diagnosis-cell">
                                    <div class="diagnosis">{{ record.diagnosis }}</div>
                                    <div v-if="record.symptoms" class="symptoms">
                                        {{ record.symptoms }}
                                    </div>
                                </td>
                                <td>
                                    <div class="doctor-info">
                                        <div class="doctor-name">{{ record.attendingDoctor }}</div>
                                        <div class="doctor-department">{{ record.doctorDepartment }}</div>
                                    </div>
                                </td>
                                <td>
                                    <span class="department-badge">{{ record.department }}</span>
                                </td>
                                <td>
                                    <span class="status" :class="`status-${record.status}`">
                                        {{ getStatusText(record.status) }}
                                    </span>
                                </td>
                                <td>{{ record.admissionDate }}</td>
                                <td>
                                    <div class="update-info">
                                        <div>{{ record.lastUpdate }}</div>
                                        <div v-if="record.updateBy" class="update-by">by {{ record.updateBy }}</div>
                                    </div>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn btn-sm btn-outline" @click="viewRecord(record)">
                                            查看
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline" @click="editRecord(record)">
                                            編輯
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-sm btn-primary" @click="addProgress(record)">
                                            新增進度
                                            <i class="fas fa-plus"></i>
                                        </button>
                                        <button class="btn btn-sm btn-success" @click="completeRecord(record)">
                                            完成
                                            <i class="fas fa-check"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- 分頁 -->
                    <div class="pagination" v-if="filteredRecords.length > 0">
                        <div class="pagination-info">
                            顯示第 {{ startIndex + 1 }} - {{ endIndex }} 筆，共 {{ filteredRecords.length }} 筆記錄
                        </div>
                        <div class="pagination-controls">
                            <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">
                                <i class="fas fa-chevron-left"></i>
                            </button>

                            <span class="pagination-page">
                                第 {{ currentPage }} 頁 / 共 {{ totalPages }} 頁
                            </span>

                            <button class="pagination-btn" :disabled="currentPage === totalPages"
                                @click="currentPage++">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>

                    <div v-if="filteredRecords.length === 0" class="empty-state">
                        <i class="fas fa-file-medical fa-3x"></i>
                        <p>沒有找到符合條件的病歷記錄</p>
                        <button class="btn btn-primary" @click="showAddRecordModal = true">
                            <i class="fas fa-plus"></i>
                            新增病歷
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 新增病歷模態框 -->
        <div v-if="showAddRecordModal" class="modal-overlay" @click="showAddRecordModal = false">
            <div class="modal-content large" @click.stop>
                <div class="modal-header">
                    <h3>新增病歷</h3>
                    <button class="close-btn" @click="showAddRecordModal = false">&times;</button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="addNewRecord">
                        <div class="form-section">
                            <h4>病人基本資訊</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>姓名:</label>
                                    <input v-model="newRecord.patientName" type="text" required>
                                </div>
                                <div class="form-group">
                                    <label>性別:</label>
                                    <select v-model="newRecord.patientGender" required>
                                        <option value="男">男</option>
                                        <option value="女">女</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>年齡:</label>
                                    <input v-model="newRecord.patientAge" type="number" min="0" max="120" required>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label>身份證字號:</label>
                                    <input v-model="newRecord.patientId" type="text">
                                </div>
                                <div class="form-group">
                                    <label>電話:</label>
                                    <input v-model="newRecord.patientPhone" type="tel">
                                </div>
                            </div>
                        </div>

                        <div class="form-section">
                            <h4>醫療資訊</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>主治醫生:</label>
                                    <select v-model="newRecord.attendingDoctor" required>
                                        <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.name">
                                            {{ doctor.name }} - {{ doctor.specialty }}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>科室:</label>
                                    <select v-model="newRecord.department" required>
                                        <option v-for="dept in departmentOptions" :key="dept.value" :value="dept.label">
                                            {{ dept.label }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>主要診斷:</label>
                                <input v-model="newRecord.diagnosis" type="text" required>
                            </div>

                            <div class="form-group">
                                <label>症狀描述:</label>
                                <textarea v-model="newRecord.symptoms" rows="3" placeholder="請詳細描述病人的症狀..."></textarea>
                            </div>

                            <div class="form-group">
                                <label>過敏史:</label>
                                <input v-model="newRecord.allergies" type="text" placeholder="無已知過敏">
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label>優先級:</label>
                                    <select v-model="newRecord.priority">
                                        <option value="normal">一般</option>
                                        <option value="high">緊急</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>狀態:</label>
                                    <select v-model="newRecord.status" required>
                                        <option value="active">治療中</option>
                                        <option value="completed">已完成</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">新增病歷</button>
                            <button type="button" class="btn btn-outline" @click="showAddRecordModal = false">
                                取消
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- 病歷詳情模態框 -->
        <div v-if="selectedRecord" class="modal-overlay" @click="selectedRecord = null">
            <div class="modal-content xlarge" @click.stop>
                <div class="modal-header">
                    <h3>病歷詳情 - {{ selectedRecord.id }}</h3>
                    <button class="close-btn" @click="selectedRecord = null">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="record-details">
                        <div class="detail-section">
                            <h4>病人資訊</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label>姓名:</label>
                                    <span>{{ selectedRecord.patientName }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>性別/年齡:</label>
                                    <span>{{ selectedRecord.patientGender }} / {{ selectedRecord.patientAge }}歲</span>
                                </div>
                                <div class="detail-item">
                                    <label>電話:</label>
                                    <span>{{ selectedRecord.patientPhone || '未提供' }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>身份證字號:</label>
                                    <span>{{ selectedRecord.patientId || '未提供' }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h4>醫療資訊</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label>主治醫生:</label>
                                    <span>{{ selectedRecord.attendingDoctor }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>科室:</label>
                                    <span>{{ selectedRecord.department }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>診斷:</label>
                                    <span class="diagnosis-text">{{ selectedRecord.diagnosis }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>症狀:</label>
                                    <span>{{ selectedRecord.symptoms || '無詳細症狀描述' }}</span>
                                </div>
                                <div class="detail-item">
                                    <label>過敏史:</label>
                                    <span>{{ selectedRecord.allergies || '無已知過敏' }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h4>治療進度</h4>
                            <div class="progress-timeline">
                                <div v-for="progress in selectedRecord.progressNotes" :key="progress.id"
                                    class="progress-item">
                                    <div class="progress-date">{{ progress.date }}</div>
                                    <div class="progress-content">
                                        <div class="progress-title">{{ progress.title }}</div>
                                        <div class="progress-description">{{ progress.description }}</div>
                                        <div class="progress-doctor">記錄醫生: {{ progress.doctor }}</div>
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

interface ProgressNote {
    id: string
    date: string
    title: string
    description: string
    doctor: string
}

interface MedicalRecord {
    id: string
    patientName: string
    patientGender: string
    patientAge: number
    patientId?: string
    patientPhone?: string
    diagnosis: string
    symptoms?: string
    allergies?: string
    attendingDoctor: string
    doctorDepartment: string
    department: string
    status: 'active' | 'completed' | 'archived'
    priority: 'normal' | 'high'
    admissionDate: string
    lastUpdate: string
    updateBy?: string
    progressNotes: ProgressNote[]
}

// 狀態選項
const statusOptions = [
    { value: 'active', label: '治療中' },
    { value: 'completed', label: '已完成' },
    { value: 'archived', label: '已歸檔' }
]

// 科室選項
const departmentOptions = [
    { value: 'internal', label: '內科' },
    { value: 'surgery', label: '外科' },
    { value: 'pediatrics', label: '兒科' },
    { value: 'obstetrics', label: '婦產科' },
    { value: 'orthopedics', label: '骨科' },
    { value: 'cardiology', label: '心臟科' },
    { value: 'neurology', label: '神經科' }
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

// 模擬病歷數據
const medicalRecords = ref<MedicalRecord[]>([
    {
        id: 'MR2024001',
        patientName: '張小明',
        patientGender: '男',
        patientAge: 45,
        patientId: 'A123456789',
        patientPhone: '0912-345-678',
        diagnosis: '高血壓二期',
        symptoms: '頭暈、心悸、血壓偏高',
        allergies: '無',
        attendingDoctor: '王大明',
        doctorDepartment: '內科',
        department: '內科',
        status: 'active',
        priority: 'normal',
        admissionDate: '2024-01-15',
        lastUpdate: '2024-01-18 14:30',
        updateBy: '王大明',
        progressNotes: [
            {
                id: '1',
                date: '2024-01-15 10:00',
                title: '初診評估',
                description: '病人血壓160/95mmHg，開立降血壓藥物處方',
                doctor: '王大明'
            },
            {
                id: '2',
                date: '2024-01-18 14:30',
                title: '複診檢查',
                description: '血壓改善至140/85mmHg，調整藥物劑量',
                doctor: '王大明'
            }
        ]
    },
    {
        id: 'MR2024002',
        patientName: '李美華',
        patientGender: '女',
        patientAge: 28,
        patientPhone: '0933-456-789',
        diagnosis: '急性闌尾炎',
        symptoms: '右下腹疼痛、發燒、噁心',
        attendingDoctor: '陳小美',
        doctorDepartment: '外科',
        department: '外科',
        status: 'completed',
        priority: 'high',
        admissionDate: '2024-01-16',
        lastUpdate: '2024-01-17 16:45',
        updateBy: '陳小美',
        progressNotes: [
            {
                id: '1',
                date: '2024-01-16 09:15',
                title: '急診入院',
                description: '確診急性闌尾炎，安排緊急手術',
                doctor: '陳小美'
            },
            {
                id: '2',
                date: '2024-01-16 14:00',
                title: '手術完成',
                description: '闌尾切除手術順利完成，病人情況穩定',
                doctor: '陳小美'
            }
        ]
    }
])

const searchQuery = ref('')
const selectedStatus = ref<string | 'all'>('all')
const selectedDepartment = ref<string | 'all'>('all')
const showAddRecordModal = ref(false)
const selectedRecord = ref<MedicalRecord | null>(null)
const currentPage = ref(1)
const pageSize = 10

const newRecord = ref({
    patientName: '',
    patientGender: '男',
    patientAge: 0,
    patientId: '',
    patientPhone: '',
    diagnosis: '',
    symptoms: '',
    allergies: '',
    attendingDoctor: '王大明',
    department: '內科',
    status: 'active',
    priority: 'normal'
})

// 統計數據
const stats = computed(() => {
    const totalRecords = medicalRecords.value.length
    const activeRecords = medicalRecords.value.filter(r => r.status === 'active').length
    const completedRecords = medicalRecords.value.filter(r => r.status === 'completed').length
    const criticalRecords = medicalRecords.value.filter(r => r.priority === 'high').length

    return {
        totalRecords,
        activeRecords,
        completedRecords,
        criticalRecords
    }
})

// 過濾後的記錄
const filteredRecords = computed(() => {
    let filtered = medicalRecords.value

    // 搜索過濾
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(record =>
            record.patientName.toLowerCase().includes(query) ||
            record.id.toLowerCase().includes(query) ||
            record.diagnosis.toLowerCase().includes(query) ||
            record.attendingDoctor.toLowerCase().includes(query)
        )
    }

    // 狀態過濾
    if (selectedStatus.value !== 'all') {
        filtered = filtered.filter(record => record.status === selectedStatus.value)
    }

    // 科室過濾
    if (selectedDepartment.value !== 'all') {
        const deptLabel = departmentOptions.find(d => d.value === selectedDepartment.value)?.label
        filtered = filtered.filter(record => record.department === deptLabel)
    }

    return filtered
})

// 分頁數據
const paginatedRecords = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize
    return filteredRecords.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredRecords.value.length / pageSize))
const startIndex = computed(() => (currentPage.value - 1) * pageSize)
const endIndex = computed(() => Math.min(currentPage.value * pageSize, filteredRecords.value.length))

const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
        'active': '治療中',
        'completed': '已完成',
        'archived': '已歸檔'
    }
    return statusMap[status] || status
}

const handleSearch = () => {
    currentPage.value = 1
}

const selectStatus = (status: string | 'all') => {
    selectedStatus.value = status
    currentPage.value = 1
}

const selectDepartment = (department: string | 'all') => {
    selectedDepartment.value = department
    currentPage.value = 1
}

const viewRecord = (record: MedicalRecord) => {
    selectedRecord.value = record
}

const editRecord = (record: MedicalRecord) => {
    alert(`編輯病歷: ${record.id}`)
}

const addProgress = (record: MedicalRecord) => {
    const note = prompt('輸入治療進度記錄:')
    if (note) {
        const newProgress: ProgressNote = {
            id: Date.now().toString(),
            date: new Date().toLocaleString('zh-TW'),
            title: '進度更新',
            description: note,
            doctor: '當前醫生'
        }
        record.progressNotes.push(newProgress)
        record.lastUpdate = new Date().toLocaleString('zh-TW')
        record.updateBy = '當前醫生'
    }
}

const completeRecord = (record: MedicalRecord) => {
    if (confirm(`確定要標記病歷 ${record.id} 為已完成嗎？`)) {
        record.status = 'completed'
        record.lastUpdate = new Date().toLocaleString('zh-TW')
        record.updateBy = '系統'
    }
}

const addNewRecord = () => {
    const newRecordData: MedicalRecord = {
        id: `MR2024${String(medicalRecords.value.length + 1).padStart(3, '0')}`,
        patientName: newRecord.value.patientName,
        patientGender: newRecord.value.patientGender,
        patientAge: newRecord.value.patientAge,
        patientId: newRecord.value.patientId || undefined,
        patientPhone: newRecord.value.patientPhone || undefined,
        diagnosis: newRecord.value.diagnosis,
        symptoms: newRecord.value.symptoms || undefined,
        allergies: newRecord.value.allergies || undefined,
        attendingDoctor: newRecord.value.attendingDoctor,
        doctorDepartment: departmentOptions.find(d => d.label === newRecord.value.department)?.value || 'internal',
        department: newRecord.value.department,
        status: newRecord.value.status as 'active' | 'completed',
        priority: newRecord.value.priority as 'normal' | 'high',
        admissionDate: new Date().toISOString().split('T')[0]!,
        lastUpdate: new Date().toLocaleString('zh-TW'),
        updateBy: '新增醫生',
        progressNotes: []
    }

    medicalRecords.value.push(newRecordData)
    showAddRecordModal.value = false
    resetNewRecordForm()
}

const resetNewRecordForm = () => {
    newRecord.value = {
        patientName: '',
        patientGender: '男',
        patientAge: 0,
        patientId: '',
        patientPhone: '',
        diagnosis: '',
        symptoms: '',
        allergies: '',
        attendingDoctor: '王大明',
        department: '內科',
        status: 'active',
        priority: 'normal'
    }
}

const refreshRecords = () => {
    console.log('刷新病歷數據')
}

const exportRecords = () => {
    alert('匯出病歷資料')
}

const printRecords = () => {
    window.print()
}

onMounted(() => {
    console.log('病歷管理頁面加載完成')
})
</script>

<style scoped>
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
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
}

th {
    background-color: #f8fafc;
    font-weight: 600;
    color: #64748b;
}

tr:last-child td {
    border-bottom: none;
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
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border-left: 4px solid transparent;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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

.active .stat-icon {
    background-color: var(--primary);
    border-left-color: var(--primary);
}

.completed .stat-icon {
    background-color: var(--secondary);
    border-left-color: var(--primary);
}

.critical .stat-icon {
    background-color: var(--primary-dark);
    border-left-color: var(--primary);
}

/* 模態框 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
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
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
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


.content {
    padding: 20px 0;
}

.medical-records-view {
    padding: 20px;
    background-color: #f8fafc;
    min-height: 100vh;
}

.filters-section {
    background: white;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 15px;
}


/* 狀態篩選 */
.status-filter {
    background: white;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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


.search-bar {
    display: flex;
    align-items: center;
    background: #f8fafc;
    border-radius: 8px;
    padding: 10px 15px;
    border: 1px solid #e2e8f0;
}

.search-bar i {
    color: #64748b;
    margin-right: 10px;
}

.search-bar input {
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
    font-size: 14px;
}

.record-id {
    position: relative;
}

.priority-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    margin-top: 4px;
}

.priority-badge.high {
    background: #fee2e2;
    color: #dc2626;
}

.patient-info .patient-name {
    font-weight: 600;
    color: var(--dark);
}

.patient-info .patient-details {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
}

.diagnosis-cell .diagnosis {
    font-weight: 500;
    color: var(--dark);
}

.diagnosis-cell .symptoms {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
}

.doctor-info .doctor-name {
    font-weight: 500;
}

.doctor-info .doctor-department {
    font-size: 12px;
    color: #64748b;
}

.department-badge {
    background: #e0e7ff;
    color: #3730a3;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.update-info .update-by {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 2px;
}

.status {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.status-active {
    background: #dbeafe;
    color: var(--primary);
}

.status-completed {
    background: #dcfce7;
    color: var(--secondary);
}

.status-archived {
    background: #f1f5f9;
    color: #64748b;
}

.action-buttons {
    display: flex;
    gap: 4px;
}

.pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-top: 1px solid #e2e8f0;
    background: #f8fafc;
}

.pagination-info {
    color: #64748b;
    font-size: 14px;
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: 15px;
}

.pagination-btn {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: white;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
    border-color: var(--primary);
    color: var(--primary);
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination-page {
    font-size: 14px;
    color: #64748b;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #64748b;
}

.empty-state i {
    margin-bottom: 15px;
    color: #cbd5e1;
}

.empty-state p {
    margin-bottom: 20px;
    font-size: 16px;
}

/* 模態框尺寸 */
.modal-content.large {
    max-width: 700px;
}

.modal-content.xlarge {
    max-width: 900px;
}

.form-section {
    margin-bottom: 25px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e2e8f0;
}

.form-section h4 {
    margin-bottom: 15px;
    color: var(--dark);
    font-size: 16px;
}

.form-section:last-child {
    border-bottom: none;
}

textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    resize: vertical;
    min-height: 80px;
}

.record-details .detail-section {
    margin-bottom: 25px;
}

.record-details .detail-section h4 {
    margin-bottom: 15px;
    color: var(--dark);
    font-size: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e2e8f0;
}

.diagnosis-text {
    font-weight: 500;
    color: #dc2626;
}

.progress-timeline {
    border-left: 2px solid #e2e8f0;
    margin-left: 10px;
    padding-left: 20px;
}

.progress-item {
    margin-bottom: 20px;
    position: relative;
}

.progress-item:before {
    content: '';
    position: absolute;
    left: -26px;
    top: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--primary);
}

.progress-date {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 4px;
}

.progress-content {
    background: #f8fafc;
    padding: 12px;
    border-radius: 6px;
    border-left: 3px solid var(--primary);
}

.progress-title {
    font-weight: 600;
    color: var(--dark);
    margin-bottom: 4px;
}

.progress-description {
    color: #64748b;
    font-size: 14px;
    margin-bottom: 4px;
}

.progress-doctor {
    font-size: 12px;
    color: #94a3b8;
}
</style>