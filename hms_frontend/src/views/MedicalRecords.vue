<template>
    <div class="medical-records-view">
        <h1>病歷列表</h1>
        <a-card :bodyStyle="{ padding: 0 }">
            <a-table
                :columns="medicalRecordColumns"
                :data-source="paginatedRecords"
                :loading="loading"
                :pagination="false"
                row-key="id"
                size="middle"
            >
                <template #title>
                    <div class="table-header">
                        <span class="section-title">病歷列表 ({{ filteredRecords?.length || 0 }})</span>
                        <div class="table-actions">
                            <a-button @click="exportRecords">
                                <template #icon><DownloadOutlined /></template>
                                匯出
                            </a-button>
                            <a-button @click="printRecords">
                                <template #icon><PrinterOutlined /></template>
                                列印
                            </a-button>
                        </div>
                    </div>
                </template>

                <template #bodyCell="{ column, record }">
                    <template v-if="column">
                        <template v-if="column.key === 'record_id'">
                            <div class="id-number">{{ record.id }}</div>
                            <a-tag v-if="record.priority === 'high'" color="red" class="priority-tag">
                                <template #icon><ExclamationCircleOutlined /></template>
                                緊急
                            </a-tag>
                        </template>

                        <template v-else-if="column.key === 'patient_info'">
                            <div class="patient-name">{{ record.patient.name }}</div>
                            <div class="patient-details">
                                {{ record.patient.gender }} / {{ record.patient.age }}歲
                            </div>
                        </template>

                        <template v-else-if="column.key === 'status'">
                             <a-tag :color="getStatusColor(record.status)">
                                {{ getStatusText(record.status) }}
                            </a-tag>
                        </template>


                        <template v-else-if="column.key === 'action'">
                            <a-space>
                                <a-button size="small" @click="openMedicalRecordPage(record)">
                                    <template #icon><EyeOutlined /></template>
                                    查看
                                </a-button>
                                <!-- <a-button size="small" @click="editRecord(record)">
                                    <template #icon><EditOutlined /></template>
                                    編輯
                                </a-button>
                                <a-button size="small" type="primary" @click="addProgress(record)">
                                    <template #icon><PlusOutlined /></template>
                                    進度
                                </a-button>
                                <a-popconfirm title="確定完成該病歷嗎?" @confirm="completeRecord(record)">
                                    <a-button size="small" type="ghost" class="btn-success">
                                        <template #icon><CheckOutlined /></template>
                                        完成
                                    </a-button>
                                </a-popconfirm> -->
                            </a-space>
                        </template>
                    </template>
                </template>
            </a-table>
            
            <div class="pagination-footer">
                 <a-pagination
                    v-model:current="currentPage"
                    :total="filteredRecords?.length || 0" 
                    :page-size="pageSize"
                    show-size-changer
                    show-quick-jumper

                />
            </div>
        </a-card>

    </div>
</template>
<script setup lang="ts">
import type { MedicalRecord } from '@/services/medical_records_api'
import { ref, computed, onMounted } from 'vue'
import MedicalRecordService, { type ProgressNote } from '@/services/medical_records_api'
import {
    PlusOutlined, ReloadOutlined,
    CheckCircleOutlined, ExclamationCircleOutlined, DownloadOutlined, PrinterOutlined,
    EyeOutlined, EditOutlined, CheckOutlined,
} from '@ant-design/icons-vue'
import router from '@/router'
// 移除未使用的 Ant Design 導入，保持簡潔
// import { Table, Tag, Button, InputSearch, Select, Row, Col, Card, PageHeader, Statistic, RadioGroup, Pagination, Space, Popconfirm } from 'ant-design-vue';


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

const medicalRecordColumns = [  
    {
        title: '病歷編號',
        dataIndex: 'id',
        // 🚨 修復: 將 key 更改為 'record_id' 以匹配模板
        key: 'record_id', 
    },
    {
        title: '病人資訊',
        dataIndex: 'patientName',
        // 🚨 新增 key: 'patient_info' 以匹配模板
        key: 'patient_info', 
    },
    {
        title: '診斷',
        dataIndex: 'diagnosis',
        key: 'diagnosis',
    },
    {
        title: '狀態',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: '優先級',
        dataIndex: 'priority',
        key: 'priority',
    },
    {
        title: '入院日期',
        dataIndex: 'admissionDate',
        key: 'admissionDate',
    },
    {
        title: '操作', // 模板中使用了 action key, 這裡需要一個 action 欄位
        key: 'action', 
    },
    // 移除 '最後更新' 和 '更新人' 欄位，因為模板中沒有對應的 bodyCell 處理
    // 如果需要顯示，請在模板中為其添加 #bodyCell 邏輯
]

const statusOptions = [
    { value: 'active', label: '治療中' },
    { value: 'completed', label: '已完成' },
    { value: 'archived', label: '已歸檔' }
]

const priorityOptions = [
    { value: 'normal', label: '正常' },
    { value: 'high', label: '高' }
]

// 模擬病歷數據
let medicalRecords = ref<MedicalRecord[]>([])
const searchQuery = ref('')
const selectedStatus = ref<string | 'all'>('all')
const selectedDepartment = ref<string | 'all'>('all')
const showAddRecordModal = ref(false)
const selectedRecord = ref<MedicalRecord | null>(null)
const currentPage = ref(1)
const pageSize = 10
const progressNotes = ref<ProgressNote[]>([])
let loading = ref(false)

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
    department: '內科', // 中文 Label
    status: 'active',
    priority: 'normal'
})

// 🚨 邏輯優化: 篩選後的數據，所有分頁和計數都應基於此
const filteredRecords = computed(() => {
    let records = medicalRecords.value || []; // 確保從 array 開始

    // 1. 搜尋過濾
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        records = records.filter(r =>
            r.patient.name.toLowerCase().includes(query) ||
            r.id.toLowerCase().includes(query) ||
            r.diagnosis.toLowerCase().includes(query)
        );
    }

    // 2. 狀態篩選
    if (selectedStatus.value !== 'all') {
        records = records.filter(r => r.status === selectedStatus.value);
    }

    // 3. 科室篩選
    if (selectedDepartment.value !== 'all') {
        // 使用 doctorDepartment 的 value 進行過濾
        records = records.filter(r => r.doctor.departmentId === selectedDepartment.value);
    }

    return records;
})


// 統計數據 (依賴原始數據)
const stats = computed(() => {
    const records = medicalRecords.value || [];
    const totalRecords = records.length
    const activeRecords = records.filter(r => r.status === 'active').length
    const completedRecords = records.filter(r => r.status === 'completed').length
    const criticalRecords = records.filter(r => r.priority === 'high').length

    return {
        totalRecords,
        activeRecords,
        completedRecords,
        criticalRecords
    }
})


// 🚨 邏輯優化: 分頁數據 (依賴已篩選的數據)
const paginatedRecords = computed(() => {
    const recordsToPaginate = filteredRecords.value
    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize
    return recordsToPaginate.slice(start, end)
})

const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
        'active': '治療中',
        'completed': '已完成',
        'archived': '已歸檔'
    }
    return statusMap[status] || status
}

const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
        'active': 'blue',
        'completed': 'green',
        'archived': 'red'
    }
    return colorMap[status] || 'default'
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

const openMedicalRecordPage = (record: MedicalRecord) => {
    router.push({
        name: 'MedicalRecordDetails',
        params: { id: record.id }
    });
}

const editRecord = (record: MedicalRecord) => {
    alert(`編輯病歷: ${record.id}`)
}

const addProgress = (record: MedicalRecord) => {
    const note = prompt('輸入治療進度記錄:')
    if (note) {
        const newProgress: ProgressNote = {
            id: Date.now().toString(),
            record_id: record.id,
            record_date: new Date(),
            doctor_id: '3',
            title: '進度更新',
            description: note,
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
        patient: {
            name: newRecord.value.patientName,
            gender: newRecord.value.patientGender,
            age: newRecord.value.patientAge,
            phone: newRecord.value.patientPhone
        },
        diagnosis: newRecord.value.diagnosis,
        symptoms: newRecord.value.symptoms || undefined,
        allergies: newRecord.value.allergies || undefined,
        doctor: {
            name: newRecord.value.attendingDoctor,
            departmentId: departmentOptions.find(d => d.label === newRecord.value.department)?.value || 'internal',
        },
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
    fetchMedicalRecords() // 刷新時應該重新獲取數據
}

const exportRecords = () => {
    alert('匯出病歷資料')
}

const printRecords = () => {
    window.print()
}

const fetchMedicalRecords = async () => {
    // 考慮在數據載入時設置 loading 狀態，這裡為了簡潔省略
    try {
        const response = await MedicalRecordService.getAllMedicalRecords()
        medicalRecords.value = response
    } catch (error) {
        console.error('獲取病歷失敗:', error)
        // 🚨 關鍵修復: 確保在 API 失敗時，medicalRecords 仍是空陣列，避免 length 錯誤
        medicalRecords.value = [] 
    }
}

onMounted(() => {
    console.log('病歷管理頁面加載完成')
    fetchMedicalRecords()
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


.detail-grid {
    display: grid;
    gap: 12px;
}


.medical-records-view {
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