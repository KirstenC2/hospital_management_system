<template>
    <div class="patients-view">
        <h1 class="header">{{ patient.name }}</h1>
        <a-row v-if="patient.id" :gutter="16" class="mb-6">
            <a-col :xs="24" :lg="16">
                <a-card :title="isEditing ? '編輯基本資料' : '基本資料'">
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
                                    <a-input-number v-model:value="editablePatient.age" :min="0" :max="150" style="width: 100%;" />
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
                            <a-descriptions bordered size="small" :column="1">
                                <a-descriptions-item label="病人 ID">{{ patient.id }}</a-descriptions-item>
                                <a-descriptions-item label="姓名">{{ patient.name }}</a-descriptions-item>
                                <a-descriptions-item label="性別">{{ patient.gender }}</a-descriptions-item>
                            </a-descriptions>
                        </a-col>
                        <a-col :span="12">
                            <a-descriptions bordered size="small" :column="1">
                                <a-descriptions-item label="年齡">{{ patient.age }}</a-descriptions-item>
                                <a-descriptions-item label="電話">{{ patient.phone || '-' }}</a-descriptions-item>
                                <a-descriptions-item label="地址">{{ patient.address || '-' }}</a-descriptions-item>
                            </a-descriptions>
                        </a-col>
                    </a-row>
                </a-card>
            </a-col>

            <a-col :xs="24" :lg="8">
                <a-card :title="isEditing ? '編輯緊急聯絡人' : '緊急聯絡人'">
                    <a-form v-if="isEditing" :model="editablePatient" layout="vertical">
                        <a-form-item label="姓名">
                            <a-input v-model:value="editablePatient.emergencyContact" />
                        </a-form-item>
                        <a-form-item label="電話">
                            <a-input v-model:value="editablePatient.emergencyPhone" />
                        </a-form-item>
                    </a-form>

                    <a-descriptions v-else bordered size="small" :column="1">
                        <a-descriptions-item label="姓名">{{ editablePatient.emergencyContact || '-' }}</a-descriptions-item>
                        <a-descriptions-item label="電話">{{ editablePatient.emergencyPhone || '-' }}</a-descriptions-item>
                    </a-descriptions>
                </a-card>
            </a-col>
        </a-row>
        
        <a-card v-if="patient.id" title="病歷記錄" class="mb-6">
            <a-tabs v-model:activeKey="activeTab">
                <a-tab-pane key="records" tab="病歷列表">
                    <a-table :columns="medicalRecordColumns" :data-source="medicalRecords" :loading="loading"
                        rowKey="id">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.dataIndex === 'status'">
                                <a-tag :color="getStatusColor(record.status)">
                                    {{ getStatusText(record.status) }}
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

        <a-spin v-else class="w-full text-center py-12" tip="載入中..." />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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
import type { BasePatient } from '@/services/patients_api'
import '@/assets/main.css'

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
const loading = ref(false)
const saving = ref(false) // 儲存狀態
const activeTab = ref('records')

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

// 狀態文字和顏色函數... (保持不變)
const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'green'
        case 'inactive': return 'red'
        default: return 'gray'
    }
}
const getStatusText = (status: string) => {
    switch (status) {
        case 'active': return 'Active'
        case 'inactive': return 'Inactive'
        default: return 'Unknown'
    }
}

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
        await new Promise(resolve => setTimeout(resolve, 1000))

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
})
</script>

<style scoped>
.patients-view {
    padding: 24px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.header h1 {
    font-size: 24px;
    margin: 0;
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
</style>