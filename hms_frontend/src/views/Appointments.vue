<template>
    <div class="outpatients-encounters-view">
        <div class="header">
            <h1>門診預約管理</h1>
            <div class="header-actions">
                <a-space>
                    <a-button type="primary" @click="showAddOutpatientModal = true">
                        <template #icon>
                            <PlusOutlined />
                        </template>
                        新增門診預約
                    </a-button>
                    <a-button @click="refreshOutpatientsEncounters">
                        <template #icon>
                            <SyncOutlined />
                        </template>
                        刷新
                    </a-button>
                </a-space>
            </div>
        </div>
        <a-card :bodyStyle="{ padding: 0 }">
            <a-table :columns="columns" :data-source="appointments">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'action'">
                        <a-space>
                            <a-button size="small" @click="viewAppointment(record)">
                                <template #icon>
                                    <EyeOutlined />
                                </template>
                                詳情
                            </a-button>
                        </a-space>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons-vue';
import appointmentsService from '@/services/appointment_api';
import type { AppointmentResponse } from '@/services/appointment_api';
import { message } from 'ant-design-vue';
import router from '@/router';
import { EyeOutlined } from '@ant-design/icons-vue';

const showAddOutpatientModal = ref(false);
const appointments = ref<AppointmentResponse[]>([]);
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
    },
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '預約日期',
        dataIndex: 'appointmentDate',
        key: 'appointmentDate',
    },
    {
        title: '狀態',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: '操作',
        key: 'action',
        width: 100,
    },
];
const refreshOutpatientsEncounters = () => {
    fetchappointments();
};

const viewAppointment = (appointment: AppointmentResponse) => {
    router.push({ name: 'AppointmentDetails', params: { id: appointment.id } });
};

const fetchappointments = async () => {
    try {
        const response = await appointmentsService.getAllAppointments();
        appointments.value = response.map(appt => ({
            ...appt,
            patientId: appt.patient.id,
            doctorId: appt.doctor.id,
            age: appt.patient.age,
            gender: appt.patient.gender,
            phone: appt.patient.phone,
            name: appt.patient.name
        }));
    } catch (error) {
        console.error('Failed to fetch appointments:', error);
        message.error('獲取門診預約列表失敗');
    }
};
onMounted(() => {
    fetchappointments();
});
</script>

<style scoped>
.outpatients-encounters-view {
    padding: 20px;
}
</style>