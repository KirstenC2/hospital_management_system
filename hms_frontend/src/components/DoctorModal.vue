<template>
  <BaseModal
    :show="show"
    :title="isEdit ? '編輯醫生' : '新增醫生'"
    width="500px"
    @update:show="$emit('update:show', $event)"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="surgery-room-form">
      <div class="form-group">
        <label for="name">醫生名稱 *</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          required
          :placeholder="isEdit ? doctor?.name : '請輸入醫生名稱'"
          :disabled="isEdit"
        />
        <div v-if="isEdit" class="form-hint">
          醫生名稱不可修改
        </div>
      </div>

      <div class="form-group">
        <BaseDropdown
          v-model="formData.departmentId"
          :options="departmentOptions"
          label="科室 *"
          placeholder="請選擇科室"
          required
        />
      </div>

      <div class="form-group">
        <BaseDropdown
          v-model="formData.title"
          :options="titleOptions"
          label="職位 *"
          placeholder="請選擇職位"
          required
        />
      </div>

      <div class="form-group">
        <label for="phone">電話</label>
        <input
          id="phone"
          v-model="formData.phone"
          type="tel"
          placeholder="請輸入電話號碼"
        />
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input
            v-model="formData.isActive"
            type="checkbox"
          />
          啟用狀態
        </label>
      </div>
    </form>

    <template #footer>
      <button
        type="button"
        @click="handleClose"
        class="btn btn-secondary"
      >
        取消
      </button>
      <button
        type="submit"
        @click="handleSubmit"
        :disabled="!isFormValid"
        class="btn btn-primary"
      >
        {{ isEdit ? '更新' : '新增' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import BaseModal from './BaseModal.vue';
import { type Doctor } from '../services/doctors_api';
import BaseDropdown from './BaseDropdown.vue';

interface Props {
  show: boolean;
  isEdit?: boolean;
  doctor?: Doctor | null;
  departments: { id: number; displayName: string }[];
}

interface Emits {
  (e: 'update:show', value: boolean): void;
  (e: 'close'): void;
  (e: 'create', data: any): void;
  (e: 'update', data: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  departments: () => []
});

const emit = defineEmits<Emits>();

const formData = ref({
  name: '',
  departmentId: '',
  title: '',
  phone: '',
  isActive: true
});

// 职位选项
const titleOptions = [
  { value: '主治醫生', label: '主治醫生' },
  { value: '副主治醫生', label: '副主治醫生' },
  { value: '住院醫生', label: '住院醫生' },
  { value: '實習醫生', label: '實習醫生' },
  { value: '主任醫生', label: '主任醫生' }
];

// 计算属性：科室选项
const departmentOptions = computed(() => {
  return props.departments.map(dept => ({
    value: dept.id.toString(),
    label: dept.displayName
  }));
});

// 计算属性：表单验证
const isFormValid = computed(() => {
  return formData.value.name.trim() && 
         formData.value.departmentId && 
         formData.value.title;
});

const resetForm = () => {
  formData.value = {
    name: '',
    departmentId: '',
    title: '',
    phone: '',
    isActive: true
  };
};

const handleClose = () => {
  resetForm();
  emit('close');
};

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  const submitData = {
    ...formData.value,
    departmentId: parseInt(formData.value.departmentId)
  };

  // 根据模式发出不同的事件
  if (props.isEdit) {
    // 编辑模式：发出 update 事件，包含医生ID
    const updateData = {
      ...submitData,
      id: props.doctor?.id
    };
    emit('update', updateData);
  } else {
    // 创建模式：发出 create 事件
    emit('create', submitData);
  }
};

// 监听 doctor prop 的变化
watch(() => props.doctor, (newDoctor) => {
  if (newDoctor && props.isEdit) {
    formData.value = {
      name: newDoctor.name || '',
      departmentId: newDoctor.departmentId?.toString() || '',
      title: newDoctor.title || '',
      phone: newDoctor.phone || '',
      isActive: newDoctor.isActive !== undefined ? newDoctor.isActive : true
    };
  } else {
    resetForm();
  }
}, { immediate: true });
</script>

<style scoped>
.surgery-room-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: #374151;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.form-hint {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.checkbox-label input[type="checkbox"] {
  margin-top: 0.125rem;
}

.checkbox-desc {
  color: #6b7280;
  font-size: 0.75rem;
}

.edit-info {
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 0.375rem;
  border-left: 4px solid #3b82f6;
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  color: #374151;
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
  background-color: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}
</style>