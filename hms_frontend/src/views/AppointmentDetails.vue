<template>
  <div class="appointment-details-view">


    <a-page-header :style="{ padding: '0 0 20px 0' }">
      <div class="header">
        <h2>患者 - {{ appointment?.patient?.name }} - 門診預約詳情</h2>
        <a-space>
          <a-button @click="goBack">
            <template #icon>
              <SyncOutlined />
            </template>
            返回
          </a-button>
        </a-space>
      </div>
    </a-page-header>


    <a-card :bodyStyle="{ padding: 0 }" :bordered="false" class="appointment-details-card">
      <a-descriptions :column="2">
        <a-descriptions-item label="預約單號">{{ appointment?.id }}</a-descriptions-item>
        <a-descriptions-item label="姓名">{{ appointment?.patient?.name }}</a-descriptions-item>
        <a-descriptions-item label="預約日期">{{ appointment?.appointmentDate }}</a-descriptions-item>
        <a-descriptions-item label="狀態">{{ appointment?.status }}</a-descriptions-item>
        <a-descriptions-item label="科室">
          {{ departmentName }}
        </a-descriptions-item><a-descriptions-item label="備註">{{ appointment?.notes }}</a-descriptions-item>
        <a-descriptions-item v-if="appointment?.cancelledAt" label="取消時間">{{ appointment?.cancelledAt }}</a-descriptions-item>
      </a-descriptions>
      <a-space>
        <a-button type="primary" @click="cancelAppointment">
          <template #icon>
            <EyeOutlined />
          </template>
          取消預約
        </a-button>
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { SyncOutlined, EyeOutlined } from '@ant-design/icons-vue';
import appointmentsService from '@/services/appointment_api';
import { onMounted } from 'vue';
import type { AppointmentResponse } from '@/services/appointment_api';
import DepartmentService from '@/services/departments_api';

const router = useRouter();
const departmentName = ref<string>('-');
const goBack = () => {
  router.back();
};

const cancelAppointment = async () => {
  try {
    const response = await appointmentsService.cancelAppointment(String(router.currentRoute.value.params.id));
    appointment.value = response;
    fetchAppointment();
  } catch (error) {
    console.error('Failed to cancel appointment:', error);
  }
};

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

const appointment = ref<AppointmentResponse>();

const fetchAppointment = async () => {
  try {
    const response = await appointmentsService.getAppointmentById(String(router.currentRoute.value.params.id));
    appointment.value = response;

  } catch (error) {
    console.error('Failed to fetch appointment:', error);
  }
};

const updateDepartmentName = async () => {
  if (appointment.value?.doctor?.departmentId) {
    const name = await DepartmentService.getDepartmentById(String(appointment.value.doctor.departmentId));
    departmentName.value = name.displayName || '-';
  } else {
    departmentName.value = '-';
  }
};

onMounted(() => {
  fetchAppointment().then(() => updateDepartmentName());
});

watch(appointment, () => updateDepartmentName());
</script>

<style scoped>
.appointment-details-view {
  padding: 20px;
}

.appointment-details-card {
  margin-top: 20px;
  padding: 30px;
  border-radius: 10px;
}
</style>
