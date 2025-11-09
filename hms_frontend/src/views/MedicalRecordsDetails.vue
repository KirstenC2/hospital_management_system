<template>
    <div class="medical-records-view">
        <div class="header">
            <h1>{{ medicalRecord?.patient.name }} - 病歷詳情</h1>
            <a-button @click="goBack" class="back-button">
                <template #icon>
                    <ArrowLeftOutlined />
                </template>
                返回
            </a-button>

        </div>

        <div v-if="loading" class="loading-container">
            <a-spin size="large" />
            <p>載入中...</p>
        </div>

        <div v-else-if="error" class="error-container">
            <a-alert message="錯誤" :description="error" type="error" show-icon />
            <a-button @click="fetchMedicalRecord" type="primary" class="mt-4">
                <template #icon>
                    <ReloadOutlined />
                </template>
                重試
            </a-button>
        </div>

        <div v-else-if="medicalRecord" class="record-details">
            <a-card :title="`病歷編號: ${medicalRecord.id}`" class="mb-4">
                <a-descriptions bordered>
                    <a-descriptions-item label="病人姓名" :span="2">{{ medicalRecord.patient.name || 'N/A'
                    }}</a-descriptions-item>
                    <a-descriptions-item label="性別/年齡">{{ medicalRecord.patient.gender || 'N/A' }} / {{
                        medicalRecord.patient.age || 'N/A' }}歲</a-descriptions-item>
                    <a-descriptions-item label="入院日期" :span="2">{{ medicalRecord.admissionDate || 'N/A'
                    }}</a-descriptions-item>
                    <a-descriptions-item label="主治醫生">{{ medicalRecord.doctor.name || 'N/A' }}</a-descriptions-item>
                    <a-descriptions-item label="科室" :span="2">
                        <a-tag color="blue">{{ departmentName || '載入中...' }}</a-tag>
                    </a-descriptions-item>
                    <a-descriptions-item label="狀態">
                        <a-tag :color="getStatusColor(medicalRecord.status)">
                            {{ getStatusText(medicalRecord.status) }}
                        </a-tag>
                    </a-descriptions-item>
                </a-descriptions>
            </a-card>

            <a-card title="診斷資訊" class="mb-4">
                <a-descriptions>
                    <a-descriptions-item label="主訴症狀" :span="3">
                        {{ medicalRecord.symptoms || 'N/A' }}
                    </a-descriptions-item>
                    <a-descriptions-item label="診斷結果" :span="3">
                        {{ medicalRecord.diagnosis || 'N/A' }}
                    </a-descriptions-item>
                    <a-descriptions-item label="過敏史" :span="3">
                        {{ medicalRecord.allergies || '無已知過敏' }}
                    </a-descriptions-item>
                </a-descriptions>
            </a-card>

            <a-card title="治療進度" v-if="medicalRecord.progressNotes?.length">
                <a-timeline>
                    <a-timeline-item v-for="note in medicalRecord.progressNotes" :key="note.id">
                        <p class="note-date">{{ note.record_date }}</p>
                        <p class="note-title">{{ note.title }}</p>
                        <p class="note-content">{{ note.description }}</p>
                    </a-timeline-item>
                </a-timeline>
            </a-card>
        </div>

        <div v-else class="no-data">
            <a-empty description="找不到相關病歷資料" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
    ArrowLeftOutlined,
    ReloadOutlined
} from '@ant-design/icons-vue';
import type { MedicalRecord } from '@/services/medical_records_api';
import MedicalRecordService from '@/services/medical_records_api';
import DepartmentsService from '@/services/departments_api';

const router = useRouter();
const route = useRoute();

const departmentName = ref<string>('');
const medicalRecord = ref<MedicalRecord | null>(null);
const loading = ref(true);
const error = ref('');

const fetchMedicalRecord = async () => {
    try {
        loading.value = true;
        error.value = '';
        const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
        if (!id) {
            throw new Error('Invalid ID');
        }
        const response = await MedicalRecordService.getMedicalRecordById(id);
        medicalRecord.value = response;
        
        // Fetch department name after setting the medical record
        if (response.doctor?.departmentId) {
            departmentName.value = await getDepartmentName(response.doctor.departmentId);
        }
    } catch (err) {
        console.error('Failed to fetch medical record:', err);
        error.value = '無法載入病歷資料，請稍後再試';
    } finally {
        loading.value = false;
    }
};

async function getDepartmentName(id: string) {
    try {
        console.log('Fetching department with ID:', id);
        const response = await DepartmentsService.getDepartmentById(id);
        console.log('Department API response:', response);
        const department = response.data || response;
        console.log('Department data:', department);
        return department?.displayName || department?.name || 'N/A';
    } catch (err) {
        console.error('Error fetching department:', err);
        return 'N/A';
    }
}

const goBack = () => {
    router.push('/medical-records');
};

const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
        'active': '治療中',
        'completed': '已完成',
        'archived': '已歸檔'
    };
    return statusMap[status] || status;
};

const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
        'active': 'blue',
        'completed': 'green',
        'archived': 'gray'
    };
    return colorMap[status] || 'default';
};

onMounted(() => {
    fetchMedicalRecord();
});
</script>

<style scoped>
.medical-records-view {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    gap: 16px;
}

.header h1 {
    margin: 0;
    font-size: 24px;
}

.loading-container,
.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 16px;
}

.record-details {
    margin-top: 16px;
}

.note-date {
    color: #666;
    margin-bottom: 4px;
    font-size: 14px;
}

.note-title {
    font-weight: 500;
    margin-bottom: 4px;
}

.note-content {
    color: #333;
    white-space: pre-line;
}

.back-button {
    margin-right: 8px;
}

.mb-4 {
    margin-bottom: 16px;
}

.mt-4 {
    margin-top: 16px;
}
</style>