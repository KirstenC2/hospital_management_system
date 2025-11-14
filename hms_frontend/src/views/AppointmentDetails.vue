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
        <a-descriptions-item label="预约单号">{{ appointment?.id }}</a-descriptions-item>
        <a-descriptions-item label="姓名">{{ appointment?.patient?.name }}</a-descriptions-item>
        <a-descriptions-item label="预约日期">{{ appointment?.appointmentDate }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="getStatusColor(appointment?.status || '')">
            {{ getStatus(appointment?.status || '') }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="科室">
          {{ departmentName }}
        </a-descriptions-item><a-descriptions-item label="备注">{{ appointment?.notes }}</a-descriptions-item>
        <a-descriptions-item v-if="appointment?.cancelledAt" label="取消时间">{{ appointment?.cancelledAt
          }}</a-descriptions-item>
      </a-descriptions>
      <a-space>
        <!-- Cancel button - show for PENDING, NO_SHOW, CONFIRMED -->
        <a-button 
          v-if="['pending', 'confirmed'].includes(appointment?.status || '')" 
          type="primary"
          danger
          @click="cancelAppointment">
          <template #icon>
            <CloseOutlined />
          </template>
          取消預約
        </a-button>

        <!-- Confirm button - only for PENDING -->
        <a-button 
          v-if="appointment?.status === 'pending'" 
          type="primary"
          @click="confirmAppointment">
          <template #icon>
            <CheckOutlined />
          </template>
          確認預約
        </a-button>

        <!-- Complete button - only for CONFIRMED -->
        <a-button 
          v-if="appointment?.status === 'confirmed'" 
          type="primary"
          @click="completeAppointment">
          <template #icon>
            <CheckCircleOutlined />
          </template>
          完成預約
        </a-button>

        <!-- No Show button - only for PENDING or CONFIRMED -->
        <a-button 
          v-if="['pending', 'confirmed'].includes(appointment?.status || '')" 
          type="primary"
          @click="noShowAppointment">
          <template #icon>
            <ClockCircleOutlined />
          </template>
          標記為失約
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

const confirmAppointment = async () => {
  try {
    const response = await appointmentsService.confirmAppointment(String(router.currentRoute.value.params.id));
    appointment.value = response;
    console.log(appointment.value);
    fetchAppointment();
  } catch (error) {
    console.error('Failed to confirm appointment:', error);
  }
};

const completeAppointment = async () => {
  try {
    const response = await appointmentsService.completeAppointment(String(router.currentRoute.value.params.id));
    appointment.value = response;
    fetchAppointment();
  } catch (error) {
    console.error('Failed to complete appointment:', error);
  }
};

const noShowAppointment = async () => {
  try {
    const response = await appointmentsService.noShowAppointment(String(router.currentRoute.value.params.id));
    appointment.value = response;
    fetchAppointment();
  } catch (error) {
    console.error('Failed to no show appointment:', error);
  }
};

const getStatus = (status: string | undefined) => {
  status = status?.toLowerCase();
  if (status === 'pending') {
    return '待确认';
  } else if (status === 'confirmed') {
    return '确认';
  } else if (status === 'cancelled') {
    return '取消';
  } else if (status === 'completed') {
    return '完成';
  } else if (status === 'no_show') {
    return '失约';
  }
};

const getStatusColor = (status: string) => {
  if (status === 'pending') {
    return 'blue';
  } else if (status === 'confirmed') {
    return 'green';
  } else if (status === 'cancelled') {
    return 'red';
  } else if (status === 'completed') {
    return 'yellow';      
  } else if (status === 'no_show') {
    return '#FF0000';
  }
};

const appointment = ref<AppointmentResponse>();

const fetchAppointment = async () => {
  try {
    const response = await appointmentsService.getAppointmentById(String(router.currentRoute.value.params.id));
    appointment.value = response;
    console.log(appointment.value);
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
