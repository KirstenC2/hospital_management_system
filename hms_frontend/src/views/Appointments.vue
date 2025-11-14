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
        <a-row>
            <a-col :span="6" >
                <a-card title="今日預約總數">
                    {{ todayAppointmentsCount }}
                </a-card>
            </a-col>
        </a-row>
        <a-card :bodyStyle="{ padding: 0 }">
            <a-table :columns="columns" :data-source="appointments">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'action'">
                        <a-space>
                            <a-button size="medium" @click="viewAppointment(record)" class="action-button">
                                <template #icon>
                                    <EyeOutlined />
                                </template>
                                詳情
                            </a-button>
                        </a-space>
                    </template>
                    <template v-if="column.key === 'status'">
                        <a-tag :size="'medium'" :color="getStatusColor(record.status)">
                            {{ getStatus(record.status) }}
                        </a-tag>
                    </template>
                </template>
            </a-table>
        </a-card>
        <a-modal v-model:visible="showAddOutpatientModal" title="新增門診預約" @ok="handleAddOutpatient">
            <a-form :model="newAppointment" layout="vertical">
                <a-form-item label="病人" name="patientId" :rules="[{ required: true, message: '請選擇病人' }]">
                    <a-select v-model:value="newAppointment.patientId" placeholder="請選擇病人">
                        <a-select-option v-for="patient in patients" :key="patient.id" :value="patient.id">
                            {{ patient.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="科室" name="departmentId" :rules="[{ required: true, message: '請選擇科室' }]">
                    <a-select v-model:value="newAppointment.departmentId" placeholder="請選擇科室">
                        <a-select-option v-for="department in departments" :key="department.id" :value="department.id">
                            {{ department.displayName }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="醫生" name="doctorId" :rules="[{ required: true, message: '請選擇醫生' }]">
                    <a-select v-model:value="newAppointment.doctorId" placeholder="請先選擇科室"
                        :disabled="!newAppointment.departmentId">
                        <a-select-option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
                            {{ doctor.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="預約日期" name="appointmentDate" :rules="[{ required: true, message: '請選擇預約日期' }]">
                    <a-date-picker v-model:value="newAppointment.appointmentDate" />
                </a-form-item>
                <a-form-item label="備註" name="notes">
                    <a-textarea v-model:value="newAppointment.notes" :rows="4" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons-vue';
import appointmentsService from '@/services/appointment_api';
import type { AppointmentResponse, BaseAppointment, CreateAppointmentDto } from '@/services/appointment_api';
import { message } from 'ant-design-vue';
import router from '@/router';
import { EyeOutlined } from '@ant-design/icons-vue';
import patientsService from '@/services/patients_api';
import doctorsService from '@/services/doctors_api';
import type { BasePatient } from '@/services/patients_api';
import type { Doctor } from '@/services/doctors_api';
import type { DepartmentList } from '@/services/departments_api';
import departmentsService from '@/services/departments_api';
import { getStatus, getStatusColor } from '@/utils/helper.utils';

const showAddOutpatientModal = ref(false);
const appointments = ref<AppointmentResponse[]>([]);
const patients = ref<BasePatient[]>([]);
const doctors = ref<Doctor[]>([]);
const departments = ref<DepartmentList[]>([]);
const todayAppointmentsCount = ref(0);
const newAppointment = ref<CreateAppointmentDto>({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    departmentId: 0,
    notes: ''
});
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

const handleAddOutpatient = async () => {
    try {
        const response = await appointmentsService.createAppointment(newAppointment.value);
        appointments.value.push(response);
        showAddOutpatientModal.value = false;
        message.success('新增門診預約成功');
    } catch (error) {
        console.error('Failed to create appointment:', error);
        message.error('新增門診預約失敗');
    }
};
const fetchDepartments = async () => {
    try {
        const response = await departmentsService.getDepartmentList();
        departments.value = response;
    } catch (error) {
        console.error('Failed to fetch departments:', error);
        message.error('獲取科室列表失敗');
    }
};

const fetchPatients = async () => {
    try {
        const response = await patientsService.getAllPatients();
        patients.value = response;
    } catch (error) {
        console.error('Failed to fetch patients:', error);
        message.error('獲取病人列表失敗');
    }
};

const fetchTodayAppointmentsCount = async () => {
    try {
        const response = await appointmentsService.getTodayAppointmentsCount();
        todayAppointmentsCount.value = response;
    } catch (error) {
        console.error('Failed to fetch today appointments count:', error);
        message.error('獲取今日預約總數失敗');
    }
};

const fetchDoctors = async (departmentIds: number[]) => {
    try {
        const response = await doctorsService.getDoctorsByDepartmentIds(departmentIds);
        doctors.value = response;
    } catch (error) {
        console.error('Failed to fetch doctors:', error);
        message.error('獲取醫生列表失敗');
    }
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
    fetchDepartments();
    fetchPatients();
    fetchTodayAppointmentsCount();
    // fetchDoctors();
});

// Add this watch after your existing code
watch(() => newAppointment.value.departmentId, (newDepartmentId) => {
    if (newDepartmentId) {
        // Clear the selected doctor when department changes
        newAppointment.value.doctorId = '';
        // Fetch doctors for the selected department
        fetchDoctors([newDepartmentId]);
    } else {
        // If no department is selected, clear the doctors list
        doctors.value = [];
    }
});
</script>

<style scoped>
.outpatients-encounters-view {
    padding: 20px;
}

.action-button {
    margin-right: 8px;
    color: #1890ff;
    font-weight: bold;
    border-radius: 8px;
}
</style>