<template>
    <div class="doctor-view">
        <div class="header">
            <h1 v-if="doctor">醫生 - {{ doctor.name }} - 個資</h1>
            <h1 v-else>載入中...</h1>
            <div class="header-actions">
                <a-button type="primary" @click="router.back()">
                    <template #icon>
                        <ArrowLeftOutlined />
                    </template>
                    返回
                </a-button>
                <a-button v-if="!isEditing" type="primary" @click="startEditing">
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

        <a-spin v-if="loading" class="w-full text-center py-12" tip="載入中..." />
        <div v-else-if="doctor" class="doctor-details">
            <!-- Add your doctor details content here -->
            <a-card>
                <h2>基本資料</h2>
                <a-descriptions bordered>
                    <a-form v-if="isEditing" :model="editableDoctor" layout="vertical"></a-form>
                    <a-descriptions-item label="姓名">{{ doctor.name }}</a-descriptions-item>
                    <a-descriptions-item label="職稱">{{ doctor.title }}</a-descriptions-item>
                    <a-descriptions-item label="科室">{{ doctor.department?.displayName }}</a-descriptions-item>
                    <a-descriptions-item label="電話">{{ doctor.phone }}</a-descriptions-item>
                    <a-descriptions-item label="加入日期">{{ doctor.createdAt }}</a-descriptions-item>
                    <a-descriptions-item label="狀態">
                        <a-tag :color="doctor.isActive ? 'green' : 'red'">
                            {{ doctor.isActive ? '在職' : '離職' }}
                        </a-tag>
                    </a-descriptions-item>
                </a-descriptions>
            </a-card>
        </div>


        <div v-if="patients && patients.length > 0">
            <a-card>
                <h2>負責的住院病患</h2>
                <a-table :columns="inpatientRecordColumns" :data-source="patients">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'patientName'">
                            <a-button @click="router.push('/patient/' + record.patient.id)">{{ record.patient.name
                                }}</a-button>
                        </template>
                    </template>
                </a-table>
            </a-card>
        </div>
        <div v-else-if="!loading" class="text-center py-12">
            <a-alert message="沒有找到負責的住院病患" type="info" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
    Card as ACard,
    Button as AButton,
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
    Spin as ASpin,
    Tag as ATag,
    Alert as AAlert
} from 'ant-design-vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import DoctorsService from '@/services/doctors_api'
import type { Doctor } from '@/services/doctors_api'
import type { BasePatient } from '@/services/patients_api'
import PatientsService from '@/services/patients_api'
import DepartmentsService from '@/services/departments_api'

const router = useRouter()
const route = useRoute()
const doctor = ref<Doctor | null>(null)
const patients = ref<BasePatient[] | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const isEditing = ref(false)
const saving = ref(false)
const editableDoctor = ref<Doctor | null>(null)
const departmentName = ref<string | null>(null)
const inpatientRecordColumns = [
    {
        title: '病患姓名',
        dataIndex: 'patientName',
        key: 'patientName',
    },
    {
        title: '入院日期',
        dataIndex: 'admissionDate',
        key: 'admissionDate',
    },
    {
        title: '狀態',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
    },
]

const startEditing = () => {
    editableDoctor.value = { ...doctor.value }
    isEditing.value = true
}

const cancelEditing = () => {
    editableDoctor.value = null
    isEditing.value = false
}

const saveChanges = async () => {
    try {
        saving.value = true
        const response = await DoctorsService.updateDoctor(+editableDoctor.value!.id, editableDoctor.value!)
        doctor.value = response
        editableDoctor.value = null
        isEditing.value = false
    } catch (e) {
        console.error('Failed to update doctor:', e)
        error.value = '更新醫生資料失敗'
    } finally {
        saving.value = false
    }
}

const fetchDepartmentName = async () => {
    try {
        const response = await DepartmentsService.getDepartmentById(String(doctor.value!.departmentId))
        departmentName.value = response.name
    } catch (e) {
        console.error('Failed to fetch department name:', e)
    }
}

onMounted(async () => {
    try {
        const id = route.params.id as string
        const response = await DoctorsService.getDoctorById(id)
        doctor.value = response
        const response2 = await PatientsService.getPatientsByDoctorId(+id)
        patients.value = response2
        console.log(patients.value)
        fetchDepartmentName()
    } catch (e) {
        console.error('Failed to fetch doctor:', e)
        error.value = '載入醫生資料失敗'
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.doctor-view {
    padding: 24px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.doctor-details {
    margin-top: 24px;
}
</style>