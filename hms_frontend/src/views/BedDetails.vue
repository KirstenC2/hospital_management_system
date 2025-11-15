<template>
  <div class="beds-view">
    <div class="header">
      <h1>病床 - {{beds?.bedNumber}} - 詳情</h1>
      <div class="header-actions">
        <a-button type="primary" @click="goBack">返回</a-button>
      </div>
      
    </div>
    <a-card class="status-indicator" :class="getStatusColor(beds?.status?.status || '')">
          <span>{{ getStatus(beds?.status?.status) }}</span>
    </a-card>
    <div class="bed-container">
      <h3 class="section-title">病床状态</h3>

      <div class="bed-frame">
        <div class="left-rail bed-rails">
          <div class="rail-section"></div>
          <div class="rail-section"></div>
          <div class="rail-section"></div>
        </div>
        <div class="right-rail bed-rails">
          <div class="rail-section"></div>
          <div class="rail-section"></div>
          <div class="rail-section"></div>
        </div>
        <div class="mattress">
          <div class="mattress-stitching stitching-1"></div>
          <div class="mattress-stitching stitching-2"></div>
          <div class="mattress-stitching stitching-3"></div>
          <div class="pillow"></div>
          <!-- 根据病床状态显示病人 -->
          <div v-if="isBedOccupied" class="patient-outline">
            <div class="head"></div>
            <div class="body"></div>
            <div class="arm left-arm"></div>

          </div>
          <div v-else class="empty-bed-indicator">
            <span>空床</span>
          </div>
        </div>

        <div class="bed-controls-panel">
          <!-- 可以在这里添加控制面板内容 -->
        </div>
      </div>

      <!-- 病床状态信息 -->
      <div class="bed-status-info">
       
        

        <div v-if="beds?.patient" class="patient-info">
          <a-card title="病人信息">
            <a-row><strong>病人姓名:</strong> {{ beds.patient?.patient?.name }}</a-row>
            <a-row><strong>年龄:</strong> {{ beds.patient?.patient?.age }}</a-row>
            <a-row><strong>性别:</strong> {{ beds.patient?.patient?.gender }}</a-row>
          </a-card>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BedsService from '@/services/beds_api';

import { getStatus, getStatusColor } from '../utils/helper.utils';

const router = useRouter();
const bedId = ref<number>(Number(router.currentRoute.value.params.id));

interface beds{
  id: number;
  bedNumber: string;
  floor: number;
  ward: string;
  roomNumber: string;
  departmentId: number;
  statusId: number;
  isActive: boolean;
  status: {
    id: number;
    status: string;
    displayName: string;
    colorCode: string;
    isAvailable: boolean;
  };
  patient: {
    id: number;
    patientId: number;
    doctorId: number;
    bedId: number;
    admissionDate: string;
    dischargeDate: string;
    expectedDischargeDate: string;
    diagnosis: string;
    chiefComplaint: string;
    status: string;
    medicalHistory: string;
    treatmentPlan: string;
    insuranceInfo: string;
    admissionNotes: string;
    dischargeNotes: string;
    createdAt: string;
    updatedAt: string;
    patient: {
      id: number;
      name: string;
      gender: string;
      age: number;
      birthDate: string;
      phone: string;
      address: string;
      emergencyContact: string;
      emergencyPhone: string;
      createdAt: string;
      updatedAt: string;
    };
  };
} 

const beds = ref<beds>();

// 计算属性：判断病床是否被占用
const isBedOccupied = computed(() => {
  return beds.value?.status?.status === 'occupied' || beds.value?.status?.status === 'in_use';
});




const fetchBedDetails = async () => {
  try {
    const response = await BedsService.findById(bedId.value);
    const data = response;
    beds.value = data;
    console.log('病床详情:', data);
  } catch (error) {
    console.error('获取病床详情失败:', error);
  }
};

const goBack = () => {
  router.go(-1);
};

onMounted(() => {
  fetchBedDetails();
});
</script>

<style scoped>
.bed-rails {
  background: #839db6;
}

.left-rail {
  left: 0;
  border-radius: 10px 0 0 10px;
}

.right-rail {
  right: 0;
  border-radius: 0 10px 10px 0;
}

/* 病床样式 */
.bed-container {
  position: relative;
  background: rgba(51, 96, 186, 0.1);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(96, 178, 219, 0.2);
  overflow: hidden;
}

.bed-frame {
  position: relative;
  width: 100%;
  height: 300px;
  background: #3a6ea5;
  border-radius: 10px;
  margin: 0 auto;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.3);
}

.pillow {
  position: absolute;
  top: 25px;
  left: 30px;
  width: 120px;
  height: 200px;
  background: #f5f5dc;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
}

.mattress {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  background: linear-gradient(to bottom, #88dcdc 0%, #92b1e0 100%);
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 病人轮廓样式 */
.patient-outline {
  position: absolute;
  top: 50%;
  left: 30%;
  transform: translate(-50%, -50%);
  width: 220px;
  height: 80px;
}

.patient-outline .head {
  position: absolute;
  top: 10%;
  left: -10%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  background: #e8f4f8;
  border-radius: 50%;
  border: 2px solid #b8d4e3;
}

.patient-outline .body {
  position: absolute;
  top: 2%;
  left: 66%;
  transform: translateX(-90%);
  width: 150px;
  height: 70px;
  background: #e8f4f8;
  border-radius: 20px 10px 10px 20px;
  border: 2px solid #b8d4e3;
}

.patient-outline .arm {
  position: absolute;
  width: 20px;
  height: 60px;
  background: #e8f4f8;
  border: 2px solid #b8d4e3;
  border-radius: 8px;
}

.patient-outline .left-arm {
  top: 45px;
  left: 30px;
  transform: rotate(-20deg);
}



.patient-outline .right-leg {
  top: 30px;
  right: 21px;
  transform: rotate(-90deg);
}

/* .patient-outline .leg {
  position: absolute;
  width: 35px;
  height: 110px;
  background: #e8f4f8;
  border: 2px solid #b8d4e3;
  border-radius: 8px;
} */

/* .patient-outline .left-leg {
  top: 45px;
  left: 260px;
  transform: rotate(-10deg);
}

.patient-outline .right-leg {
  top: 45px;
  left: 30px;
  transform: rotate(-20deg);
} */

/* 空床指示器 */
.empty-bed-indicator {
  color: #666;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

/* 病床状态信息 */
.bed-status-info {
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-occupied .status-dot {
  background: #ff4757;
}

.status-available .status-dot {
  background: #2ed573;
}

.status-maintenance .status-dot {
  background: #ffa502;
}

.status-unknown .status-dot {
  background: #747d8c;
}

.status-text {
  font-weight: bold;
  font-size: 16px;
}

.patient-info {
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.patient-info p {
  margin: 5px 0;
  color: #333;
}

/* 床栏杆样式 */
.bed-rails {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 0;
}

.rail-section {
  height: 30%;
  background: #6b8cae;
  border-radius: 5px;
  margin: 0 2px;
}

.mattress-stitching {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
}

.stitching-1 { top: 33%; }
.stitching-2 { top: 50%; }
.stitching-3 { top: 67%; }
</style>