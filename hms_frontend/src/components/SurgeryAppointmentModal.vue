<template>
  <BaseModal
    :show="show"
    :title="isEdit ? '編輯手術預約' : '創建手術預約'"
    width="600px"
    @update:show="$emit('update:show', $event)"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="surgery-appointment-form">
      <!-- 患者信息 -->
      <div class="form-section">
        <h4>患者信息</h4>
        <div class="form-group">
          <BaseDropdown
            v-model="formData.patientId"
            :options="patientOptions"
            label="選擇患者 *"
            placeholder="請選擇患者"
            required
            :invalid="!!errors.patientId"
            :error-message="errors.patientId"
          />
        </div>
      </div>

      <!-- 手术信息 -->
      <div class="form-section">
        <h4>手術信息</h4>
        <div class="form-row">
          <div class="form-group">
            <BaseDropdown
              v-model="formData.surgeryTypeId"
              :options="surgeryTypeOptions"
              label="手術類型 *"
              placeholder="請選擇手術類型"
              required
              :invalid="!!errors.surgeryTypeId"
              :error-message="errors.surgeryTypeId"
            />
          </div>
          <div class="form-group">
            <BaseDropdown
              v-model="formData.operatingRoomId"
              :options="operatingRoomOptions"
              label="手術室 *"
              placeholder="請選擇手術室"
              required
              :invalid="!!errors.operatingRoomId"
              :error-message="errors.operatingRoomId"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="diagnosis">診斷</label>
          <textarea
            id="diagnosis"
            v-model="formData.diagnosis"
            placeholder="請輸入診斷信息"
            rows="2"
          />
        </div>

        <div class="form-group">
          <label for="procedureDescription">手術說明</label>
          <textarea
            id="procedureDescription"
            v-model="formData.procedureDescription"
            placeholder="請輸入手術說明"
            rows="3"
          />
        </div>
      </div>

      <!-- 医生团队 -->
      <div class="form-section">
        <h4>醫生團隊</h4>
        <div class="form-row">
          <div class="form-group">
            <BaseDropdown
              v-model="formData.surgeonId"
              :options="doctorOptions"
              label="主刀醫生 *"
              placeholder="請選擇主刀醫生"
              required
              :invalid="!!errors.surgeonId"
              :error-message="errors.surgeonId"
            />
          </div>
          <div class="form-group">
            <BaseDropdown
              v-model="formData.assistantSurgeonId"
              :options="doctorOptions"
              label="助理醫生"
              placeholder="請選擇助理醫生"
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <BaseDropdown
              v-model="formData.anesthesiologistId"
              :options="doctorOptions"
              label="麻醉醫生"
              placeholder="請選擇麻醉醫生"
            />
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="formData.isEmergency"
                type="checkbox"
              />
              急診手術
            </label>
          </div>
        </div>
      </div>

      <!-- 时间安排 -->
      <div class="form-section">
        <h4>時間安排</h4>
        <div class="form-row">
          <div class="form-group">
            <label for="scheduledDate">手術日期 *</label>
            <input
              id="scheduledDate"
              v-model="formData.scheduledDate"
              type="date"
              required
              :min="minDate"
              :class="{ 'is-invalid': !!errors.scheduledDate }"
            />
            <div v-if="errors.scheduledDate" class="error-message">
              {{ errors.scheduledDate }}
            </div>
          </div>
          <div class="form-group">
            <label for="estimatedDuration">預計時長 (分鐘) *</label>
            <input
              id="estimatedDuration"
              v-model="formData.estimatedDuration"
              type="number"
              min="30"
              max="480"
              required
              placeholder="60"
              :class="{ 'is-invalid': !!errors.estimatedDuration }"
            />
            <div v-if="errors.estimatedDuration" class="error-message">
              {{ errors.estimatedDuration }}
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="startTime">開始時間 *</label>
            <input
              id="startTime"
              v-model="formData.startTime"
              type="time"
              required
              :class="{ 'is-invalid': !!errors.startTime }"
            />
            <div v-if="errors.startTime" class="error-message">
              {{ errors.startTime }}
            </div>
          </div>
          <div class="form-group">
            <label for="endTime">結束時間</label>
            <input
              id="endTime"
              v-model="computedEndTime"
              type="time"
              disabled
              class="disabled-input"
            />
            <div class="form-hint">根據開始時間和時長自動計算</div>
          </div>
        </div>

        <!-- 时间冲突提示 -->
        <div v-if="timeConflict" class="time-conflict-warning">
          <i class="fas fa-exclamation-triangle"></i>
          <span>該時間段已有預約，請選擇其他時間</span>
        </div>

        <!-- 可用时间建议 -->
        <div v-if="availableTimeSlots.length > 0" class="available-slots">
          <h5>推薦可用時間段：</h5>
          <div class="slot-buttons">
            <button
              v-for="slot in availableTimeSlots"
              :key="slot.startTime"
              type="button"
              class="slot-btn"
              @click="selectTimeSlot(slot)"
            >
              {{ slot.startTime }} - {{ slot.endTime }}
            </button>
          </div>
        </div>
      </div>

      <!-- 备注 -->
      <div class="form-section">
        <h4>備注信息</h4>
        <div class="form-group">
          <label for="notes">備注</label>
          <textarea
            id="notes"
            v-model="formData.notes"
            placeholder="請輸入其他備注信息"
            rows="2"
          />
        </div>
      </div>
    </form>

    <template #footer>
      <button
        type="button"
        @click="handleClose"
        class="btn btn-secondary"
        :disabled="loading"
      >
        取消
      </button>
      <button
        type="submit"
        @click="handleSubmit"
        :disabled="loading || !isFormValid || timeConflict"
        class="btn btn-primary"
      >
        {{ loading ? '保存中...' : isEdit ? '更新' : '創建' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import BaseModal from './BaseModal.vue';
import BaseDropdown from './BaseDropdown.vue';
import surgeryRoomsService from '../services/surgery_rooms_api';
import type { Doctor } from '@/services/doctors_api';

interface Patient {
  id: number;
  name: string;
  bedNumber?: string;
}

interface SurgeryType {
  id: number;
  name: string;
  displayName: string;
  defaultDuration: number;
}

interface OperatingRoom {
  id: number;
  roomNumber: string;
  name: string;
  status: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface Props {
  show: boolean;
  isEdit?: boolean;
  appointment?: any;
  patients: Patient[];
  surgeryTypes: SurgeryType[];
  operatingRooms: OperatingRoom[];
  doctors: Doctor[];
  loading?: boolean;
}

interface Emits {
  (e: 'update:show', value: boolean): void;
  (e: 'close'): void;
  (e: 'create', data: any): void;
  (e: 'update', data: any): void;
  (e: 'check-availability', data: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  loading: false,
  patients: () => [],
  surgeryTypes: () => [],
  operatingRooms: () => [],
  doctors: () => []
});

const emit = defineEmits<Emits>();

const loading = ref(props.loading);
const timeConflict = ref(false);
const availableTimeSlots = ref<TimeSlot[]>([]);

const formData = ref({
  patientId: '',
  surgeryTypeId: '',
  operatingRoomId: '',
  surgeonId: '',
  assistantSurgeonId: '',
  anesthesiologistId: '',
  scheduledDate: '',
  startTime: '',
  estimatedDuration: 60,
  diagnosis: '',
  procedureDescription: '',
  notes: '',
  isEmergency: false
});

const errors = ref({
  patientId: '',
  surgeryTypeId: '',
  operatingRoomId: '',
  surgeonId: '',
  scheduledDate: '',
  startTime: '',
  estimatedDuration: ''
});

// 计算属性
const minDate = computed(() => {
  return new Date().toISOString().split('T')[0];
});

const computedEndTime = computed(() => {
  if (!formData.value.startTime || !formData.value.estimatedDuration) return '';
  
  const [hours, minutes] = formData.value.startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours!, minutes, 0, 0);
  
  const endDate = new Date(startDate.getTime() + formData.value.estimatedDuration * 60000);
  return endDate.toTimeString().slice(0, 5);
});

const isFormValid = computed(() => {
  return formData.value.patientId &&
         formData.value.surgeryTypeId &&
         formData.value.operatingRoomId &&
         formData.value.surgeonId &&
         formData.value.scheduledDate &&
         formData.value.startTime &&
         formData.value.estimatedDuration;
});

// 选项数据
const patientOptions = computed(() => {
  return props.patients.map(patient => ({
    value: patient.id.toString(),
    label: `${patient.name}${patient.bedNumber ? ` (${patient.bedNumber})` : ''}`
  }));
});

const surgeryTypeOptions = computed(() => {
  return props.surgeryTypes.map(type => ({
    value: type.id.toString(),
    label: type.displayName
  }));
});

const operatingRoomOptions = computed(() => {
    return surgeryRoomsService.getSurgeryRoomsList().then((data) => {
        return data.map(room => ({
            value: room.id.toString(),
            label: `${room.name} (${room.room_number})`
        }));
    });
});


const doctorOptions = computed(() => {
  return props.doctors.map(doctor => ({
    value: doctor.id.toString(),
    label: `${doctor.name} - ${doctor.department.displayName ? ` - ${doctor.department.displayName}` : ''}`
  }));
});

// 方法
const resetForm = () => {
  formData.value = {
    patientId: '',
    surgeryTypeId: '',
    operatingRoomId: '',
    surgeonId: '',
    assistantSurgeonId: '',
    anesthesiologistId: '',
    scheduledDate: '',
    startTime: '',
    estimatedDuration: 60,
    diagnosis: '',
    procedureDescription: '',
    notes: '',
    isEmergency: false
  };
  errors.value = {
    patientId: '',
    surgeryTypeId: '',
    operatingRoomId: '',
    surgeonId: '',
    scheduledDate: '',
    startTime: '',
    estimatedDuration: ''
  };
  timeConflict.value = false;
  availableTimeSlots.value = [];
};

const validateForm = () => {
  let isValid = true;
  errors.value = {
    patientId: '',
    surgeryTypeId: '',
    operatingRoomId: '',
    surgeonId: '',
    scheduledDate: '',
    startTime: '',
    estimatedDuration: ''
  };

  if (!formData.value.patientId) {
    errors.value.patientId = '請選擇患者';
    isValid = false;
  }
  if (!formData.value.surgeryTypeId) {
    errors.value.surgeryTypeId = '請選擇手術類型';
    isValid = false;
  }
  if (!formData.value.operatingRoomId) {
    errors.value.operatingRoomId = '請選擇手術室';
    isValid = false;
  }
  if (!formData.value.surgeonId) {
    errors.value.surgeonId = '請選擇主刀醫生';
    isValid = false;
  }
  if (!formData.value.scheduledDate) {
    errors.value.scheduledDate = '請選擇手術日期';
    isValid = false;
  }
  if (!formData.value.startTime) {
    errors.value.startTime = '請選擇開始時間';
    isValid = false;
  }
  if (!formData.value.estimatedDuration || formData.value.estimatedDuration < 30) {
    errors.value.estimatedDuration = '預計時長至少30分鐘';
    isValid = false;
  }

  return isValid;
};

const checkAvailability = () => {
  if (formData.value.operatingRoomId && formData.value.scheduledDate && formData.value.startTime) {
    emit('check-availability', {
      operatingRoomId: parseInt(formData.value.operatingRoomId),
      scheduledDate: formData.value.scheduledDate,
      startTime: formData.value.startTime,
      estimatedDuration: formData.value.estimatedDuration
    });
  }
};

const selectTimeSlot = (slot: TimeSlot) => {
  formData.value.startTime = slot.startTime;
  // 可以根据slot的时长自动调整estimatedDuration
};

const handleClose = () => {
  resetForm();
  emit('close');
};

const handleSubmit = async () => {
  if (loading.value || !validateForm() || timeConflict.value) return;

  try {
    loading.value = true;

    const submitData = {
      ...formData.value,
      patientId: parseInt(formData.value.patientId),
      surgeryTypeId: parseInt(formData.value.surgeryTypeId),
      operatingRoomId: parseInt(formData.value.operatingRoomId),
      surgeonId: parseInt(formData.value.surgeonId),
      assistantSurgeonId: formData.value.assistantSurgeonId ? parseInt(formData.value.assistantSurgeonId) : null,
      anesthesiologistId: formData.value.anesthesiologistId ? parseInt(formData.value.anesthesiologistId) : null,
      endTime: computedEndTime.value
    };

    if (props.isEdit) {
      emit('update', { ...submitData, id: props.appointment?.id });
    } else {
      emit('create', submitData);
    }
    
  } catch (error) {
    console.error('保存失敗:', error);
  } finally {
    loading.value = false;
  }
};

// 监听数据变化
watch(() => props.appointment, (newAppointment) => {
  if (newAppointment && props.isEdit) {
    formData.value = {
      patientId: newAppointment.patientId?.toString() || '',
      surgeryTypeId: newAppointment.surgeryTypeId?.toString() || '',
      operatingRoomId: newAppointment.operatingRoomId?.toString() || '',
      surgeonId: newAppointment.surgeonId?.toString() || '',
      assistantSurgeonId: newAppointment.assistantSurgeonId?.toString() || '',
      anesthesiologistId: newAppointment.anesthesiologistId?.toString() || '',
      scheduledDate: newAppointment.scheduledDate || '',
      startTime: newAppointment.startTime || '',
      estimatedDuration: newAppointment.estimatedDuration || 60,
      diagnosis: newAppointment.diagnosis || '',
      procedureDescription: newAppointment.procedureDescription || '',
      notes: newAppointment.notes || '',
      isEmergency: newAppointment.isEmergency || false
    };
  } else {
    resetForm();
  }
}, { immediate: true });

watch(() => props.loading, (newLoading) => {
  loading.value = newLoading;
});

// 监听时间变化检查可用性
watch([
  () => formData.value.operatingRoomId,
  () => formData.value.scheduledDate,
  () => formData.value.startTime,
  () => formData.value.estimatedDuration
], () => {
  if (formData.value.operatingRoomId && formData.value.scheduledDate && formData.value.startTime) {
    checkAvailability();
  }
});

onMounted(() => {
  resetForm();
});
</script>

<style scoped>
.surgery-appointment-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  padding: 1.25rem;
  background-color: #f8f9fa;
}

.form-section h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 600;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input.is-invalid,
.form-group textarea.is-invalid,
.form-group select.is-invalid {
  border-color: #ef4444;
}

.form-group input.disabled-input {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.form-group textarea {
  resize: vertical;
  min-height: 60px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-top: 1.5rem;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.form-hint {
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.time-conflict-warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.available-slots {
  margin-top: 1rem;
}

.available-slots h5 {
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
}

.slot-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.slot-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #3b82f6;
  border-radius: 0.375rem;
  background-color: white;
  color: #3b82f6;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.slot-btn:hover {
  background-color: #3b82f6;
  color: white;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #5a6268;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .slot-buttons {
    flex-direction: column;
  }
  
  .slot-btn {
    width: 100%;
  }
}
</style>