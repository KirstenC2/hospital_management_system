<template>
    <div class="patients-view">
        <div class="header">
            <h1>患者 - {{ patient.name }} - 個資</h1>
            <div class="header-actions">
                <a-button v-if="!isEditing" @click="startEditing" type="primary">
                    <template #icon>
                        <EditOutlined />
                    </template>
                    編輯
                </a-button>
                <template v-else>
                    <a-button @click="cancelEditing" class="mr-2">
                        <template #icon>
                            <CloseOutlined />
                        </template>
                        取消
                    </a-button>
                    <a-button @click="saveChanges" type="primary" :loading="saving">
                        <template #icon>
                            <SaveOutlined />
                        </template>
                        保存
                    </a-button>
                </template>
            </div>
        </div>
        <a-row v-if="patient.id" :gutter="16" class="mb-6">
            <a-col :xs="24" :lg="16">

                <a-card :title="isEditing ? '編輯基本資料' : '基本資料'" class="profile-card">

                    <a-form v-if="isEditing" :model="editablePatient" layout="vertical">

                        <a-row :gutter="16">
                            <a-col :span="24">
                                <a-form-item label="病人 ID">
                                    <a-input :value="editablePatient.id" disabled />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item label="姓名" required>
                                    <a-input v-model:value="editablePatient.name" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item label="性別" required>
                                    <a-select v-model:value="editablePatient.gender" placeholder="請選擇性別">
                                        <a-select-option value="Male">男</a-select-option>
                                        <a-select-option value="Female">女</a-select-option>
                                        <a-select-option value="Other">其他</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item label="年齡">
                                    <a-input-number v-model:value="editablePatient.age" :min="0" :max="150"
                                        style="width: 100%;" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item label="電話">
                                    <a-input v-model:value="editablePatient.phone" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="24">
                                <a-form-item label="地址">
                                    <a-input v-model:value="editablePatient.address" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-form>

                    <a-row v-else :gutter="16">
                        <a-col :span="12">
                            <a-descriptions  size="small" :column="1">
                                <a-descriptions-item label="病人 ID">{{ patient.id }}</a-descriptions-item>
                                <a-descriptions-item label="姓名">{{ patient.name }}</a-descriptions-item>
                                <a-descriptions-item label="性別">{{ patient.gender }}</a-descriptions-item>
                            </a-descriptions>
                        </a-col>
                        <a-col :span="12">
                            <a-descriptions size="small" :column="1">
                                <a-descriptions-item label="年齡">{{ patient.age }}</a-descriptions-item>
                                <a-descriptions-item label="電話">{{ patient.phone || '-' }}</a-descriptions-item>
                                <a-descriptions-item label="地址">{{ patient.address || '-' }}</a-descriptions-item>
                            </a-descriptions>
                        </a-col>
                    </a-row>
                </a-card>
            </a-col>

            <a-col :xs="24" :lg="8">
                <a-card :title="isEditing ? '編輯緊急聯絡人' : '緊急聯絡人'" class="emergency-card">
                    <a-form v-if="isEditing" :model="editablePatient" layout="vertical" class="emergency-form">
                        <a-form-item label="姓名" required>
                            <a-input v-model:value="editablePatient.emergencyContact" />
                        </a-form-item>
                        <a-form-item label="電話">
                            <a-input v-model:value="editablePatient.emergencyPhone" />
                        </a-form-item>
                    </a-form>

                    <a-descriptions v-else size="small" :column="1" class="emergency-descriptions">
                        <a-descriptions-item label="姓名">{{ editablePatient.emergencyContact || '-'
                            }}</a-descriptions-item>
                        <a-descriptions-item label="電話">{{ editablePatient.emergencyPhone || '-'
                            }}</a-descriptions-item>
                    </a-descriptions>
                </a-card>
            </a-col>
        </a-row>

        <a-card v-if="patient.id" title="病歷記錄" class="card">
            <a-tabs v-model:activeKey="activeTab">
                <a-tab-pane key="records" tab="病歷列表" class="card-body">
                    <a-table :columns="medicalRecordColumns" :data-source="medicalRecords" :loading="loading"
                        class="data-table" rowKey="id">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.dataIndex === 'status'">
                                <a-tag :color="getStatusColor(record.status)">
                                    {{ getStatus(record.status) }}
                                </a-tag>
                            </template>

                            <template v-else-if="column.key === 'doctor'">
                                {{ record.doctor ? record.doctor.name + ' (' + record.doctor.title + ')' : '-' }}
                            </template>

                            <template v-else-if="column.dataIndex === 'priority'">
                                <a-tag :color="record.priority === 'high' ? 'red' : 'blue'">
                                    {{ record.priority === 'high' ? '高' : '一般' }}
                                </a-tag>
                            </template>
                        </template>
                    </a-table>
                </a-tab-pane>
            </a-tabs>
        </a-card>

        <a-card v-if="patient.id" title="預約紀錄" class="card">
            <a-table :columns="appointmentRecordColumns" :data-source="appointmentRecords" :loading="loading" rowKey="id"
                class="data-table">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'status'">
                        <a-tag :color="getStatusColor(record.status)">
                            {{ getStatus(record.status) }}
                        </a-tag>
                    </template>

                    <template v-else-if="column.key === 'department'">
                        {{  record.department.displayName}}
                    </template>

                    <template v-else-if="column.key === 'doctor'">
                        {{ record.doctor ? record.doctor.name + ' (' + record.doctor.title + ')' : '-' }}
                    </template>
                </template>
            </a-table>
        </a-card>

        <a-card v-if="patient.id" title="住院紀錄" class="card">
            <a-table :columns="inpatientRecordColumns" :data-source="inpatientRecords" :loading="loading" rowKey="id"
                class="data-table">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'status'">
                        <a-tag :color="getStatusColor(record.status)">
                            {{ getStatus(record.status) }}
                        </a-tag>
                    </template>
                </template>
            </a-table>
        </a-card>

        <a-spin v-else class="w-full text-center py-12" tip="載入中..." />
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { AppointmentResponse } from '../services/appointment_api'
// 導入需要的 Ant Design 組件
import {
    Card as ACard,
    Button as AButton,
    Descriptions,
    Spin as ASpin,
    Form as AForm,
    Input as AInput,
    Select as ASelect,
    InputNumber as AInputNumber,
    message
} from 'ant-design-vue'
// 導入編輯所需的圖標
import { ArrowLeftOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons-vue'
import PatientsService from '@/services/patients_api'
import AppointmentsService from '@/services/appointment_api'
import type { BasePatient } from '@/services/patients_api'
import DepartmentsService from '@/services/departments_api'
import '@/assets/main.css'
import { getStatusColor, getStatus } from '@/utils/helper.utils'

// 為了在模板中正確使用，需要從 Descriptions 提取 Item
const ADescriptions = Descriptions
const ADescriptionsItem = Descriptions.Item
const AFormItem = AForm.Item // 添加 FormItem

const router = useRouter()

// 原始病人數據
const patient = ref<BasePatient>({} as BasePatient)
// 可編輯的病人數據副本，用於編輯模式
const editablePatient = ref<BasePatient>({} as BasePatient)
const medicalRecords = ref([])
const inpatientRecords = ref([])
const appointmentRecords = ref<AppointmentResponse[]>([])
const loading = ref(false)
const saving = ref(false) // 儲存狀態
const activeTab = ref('records')
const departmentId = ref(0)


// **新增：編輯狀態**
const isEditing = ref(false)

// 病歷列表的欄位定義... (保持不變)
const medicalRecordColumns = [
    { title: '病歷單號', dataIndex: 'id', key: 'id' },
    { title: '診斷', dataIndex: 'diagnosis', key: 'diagnosis' },
    { title: '醫生', key: 'doctor' },
    { title: '症狀', dataIndex: 'symptoms', key: 'symptoms' },
    { title: '優先級', dataIndex: 'priority', key: 'priority' },
    { title: '狀態', dataIndex: 'status', key: 'status' }
]

const appointmentRecordColumns = [
    { title: '預約單號', dataIndex: 'id', key: 'id' },
    { title: '預約日期', dataIndex: 'appointmentDate', key: 'appointmentDate' },
    { title: '醫生', key: 'doctor' },
    { title: '科室', dataIndex: 'department', key: 'department' },
    { title: '狀態', dataIndex: 'status', key: 'status' }
]

const inpatientRecordColumns = [
    { title: '住院單號', dataIndex: 'id', key: 'id' },
    { title: '診斷', dataIndex: 'diagnosis', key: 'diagnosis' },
    { title: '床位', dataIndex: 'bedId', key: 'bedId' },
    { title: '入院日期', dataIndex: 'admissionDate', key: 'admissionDate' },
    { title: '預計出院日期', dataIndex: 'expectedDischargeDate', key: 'expectedDischargeDate' },
    { title: '狀態', dataIndex: 'status', key: 'status' }
]

const departmentName = ref('')

// **新增：進入編輯模式**
const startEditing = () => {
    // 複製當前病人數據到可編輯副本
    editablePatient.value = { ...patient.value }
    isEditing.value = true
}

// **新增：取消編輯**
const cancelEditing = () => {
    // 簡單地退出編輯模式，不做任何儲存
    isEditing.value = false
    message.info('已取消編輯。')
}

// **新增：儲存更改 (重要：請替換為實際 API 邏輯)**
const saveChanges = async () => {
    saving.value = true
    try {
        // 模擬 API 更新調用
        // **!!! 替換成實際的 PatientsService.updatePatient(editablePatient.value) !!!**
        await PatientsService.updatePatient(editablePatient.value)

        // 假設更新成功，用 editablePatient 的數據覆蓋 patient
        patient.value = { ...editablePatient.value }
        isEditing.value = false
        message.success('病人資料更新成功！')

    } catch (error) {
        console.error('更新病人資料失敗:', error)
        message.error('更新失敗，請檢查網路或資料格式。')
    } finally {
        saving.value = false
    }
}

// 獲取病人詳情
const fetchPatientDetail = async () => {
    try {
        const patientId = router.currentRoute.value.params.id as string
        const response = await PatientsService.getPatientById(Number(patientId))
        patient.value = response
        // 首次載入時，將副本也設置為原始數據
        editablePatient.value = { ...response }
    } catch (error) {
        console.error('獲取病人詳情失敗:', error)
    }
}


const fetchInpatientRecords = async () => {
    try {
        const patientId = router.currentRoute.value.params.id as string
        const response = await PatientsService.getPatientRecordList(Number(patientId))
        inpatientRecords.value = response
        console.log(inpatientRecords.value)
    } catch (error) {
        console.error('獲取病歷記錄失敗:', error)
    }
}

const fetchAppointmentRecords = async () => {
    try {
        const patientId = router.currentRoute.value.params.id as string
        const response = await AppointmentsService.getPatientRecordList(Number(patientId))
        appointmentRecords.value = response
        console.log(appointmentRecords.value)
    } catch (error) {
        console.error('獲取病歷記錄失敗:', error)
    }
}

interface Department {
    id: number
    departmentName: string
}

const departments = ref<Department[]>([])

const fetchDepartments = async () => {
    try {
        const response = await DepartmentsService.getDepartmentList()
        departments.value = response
    } catch (error) {
        console.error('獲取科室列表失敗:', error)
    }
}

// 返回邏輯
const goBack = () => {
    if (window.history.state.back) {
        router.back()
    } else {
        router.push('/patients')
    }
}

// 獲取病歷記錄
const fetchMedicalRecords = async () => {
    try {
        const patientId = router.currentRoute.value.params.id as string
        const response = await PatientsService.getMedicalRecordsByPatientId(Number(patientId))
        medicalRecords.value = response
    } catch (error) {
        console.error('獲取病歷記錄失敗:', error)
    }
}

// 此函數在此組件中不再需要，因為這已經是詳情頁
// const navigateToPatientDetail = (patient: BasePatient) => { ... } 

onMounted(() => {
    fetchPatientDetail()
    fetchMedicalRecords()
    fetchDepartments()
    fetchInpatientRecords()
    fetchAppointmentRecords()
})
</script>

<style scoped>
.patients-view {
    padding: 24px;
}

.mb-6 {
    margin-bottom: 24px;

}

.mr-3 {
    margin-right: 12px;
}

.ml-2 {
    margin-left: 8px;
}

.profile-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    margin-bottom: 16px;
}

.profile-card :deep(.ant-card-head) {
    background-color: #7eb0ae;
    border-bottom: 1px solid #9ed2d0;
    border-radius: 8px 8px 0 0;
    padding: 12px 16px;
}

.profile-card :deep(.ant-card-head-title) {
    color: #fff;
    font-weight: bold;
    font-size: 20px;
}

.profile-card :deep(.ant-card-body) {
    padding: 16px;
    
}

.profile-card :deep(.ant-descriptions) {
    padding: 0px;
}

.profile-card :deep(.ant-descriptions-item-label) {
    color: #06357653;
    /* Red-800 */
    font-weight: medium;
    width: 40%;
    padding: 6px;
}

.profile-card :deep(.ant-descriptions-item-content) {
    border-radius: 6px;
    padding: 6px;
    width: 60%;
    font-size: medium;
    /* Soft red background on hover */
}

.emergency-card {
    background-color: #fff5f6;
    /* Light red background */
    border: 1px solid #ffccd5;
    /* Soft red border */
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    margin-bottom: 16px;
}

.emergency-card :deep(.ant-card-head) {
    background-color: #fff1f2;
    border-bottom: 1px solid #ffe4e6;
    border-radius: 8px 8px 0 0;
    padding: 12px 16px;
}

.emergency-card :deep(.ant-card-head-title) {
    color: #e11d48;
    /* Red-600 */
    font-weight: bold;
}

.emergency-card :deep(.ant-form) {
    padding: 16px;
    
}

.emergency-card :deep(.ant-form-item) {
    margin-bottom: 16px;
}

.emergency-card :deep(.ant-form-item-label > label) {
    color: #c0325aff;
    /* Red-800 */
    font-weight: bold;
}

.emergency-card :deep(.ant-input) {
    border-color: #fecdd3;
    /* Red-200 */
    border-radius: 6px;
}

.emergency-card :deep(.ant-input:hover),
.emergency-card :deep(.ant-input:focus) {
    border-color: #fda4af;
    /* Red-300 */
    box-shadow: 0 0 0 2px rgba(244, 63, 94, 0.1);
    /* Red-500 with opacity */
}

/* For the view mode */
.emergency-card :deep(.ant-descriptions) {
    padding: 5px;
    
}


.emergency-card :deep(.ant-descriptions-item-label) {
    color: #78122f;
    /* Red-800 */
    font-weight: medium;
    width: 40%;
    padding: 6px;
}

.emergency-card :deep(.ant-descriptions-item-content) {
    border-radius: 6px;
    padding: 6px;
    width: 60%;
    font-size: medium;
    /* Soft red background on hover */
}

.emergency-card :deep(.ant-descriptions-item) {
    color: #4b5563;

    /* Gray-600 */
}

/* Add some spacing between form items */
.emergency-card :deep(.ant-form-item) {
    margin-bottom: 16px;
}

/* For the card when in edit mode */
.emergency-card.editing {
    border-color: #fda4af;
    /* Slightly darker border when editing */
}

/* Add transition for smooth hover effect */
.emergency-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
}

</style>