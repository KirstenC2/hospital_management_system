<!-- src/components/SurgeryRoomModal.vue -->
<template>
  <BaseModal
    :show="show"
    :title="room ? '編輯手術室' : '創建手術室'"
    width="500px"
    @update:show="$emit('update:show', $event)"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="surgery-room-form">
      <div class="form-group">
        <label for="name">手術室名稱 *</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          required
          placeholder="請輸入手術室名稱"
        />
      </div>

      <div class="form-group">
        <label for="description">描述</label>
        <textarea
          id="description"
          v-model="formData.description"
          placeholder="請輸入手術室描述"
          rows="3"
        />
      </div>
      <div class="form-group">
        <label for="size">規格 *</label>
        <select
          id="size"
          v-model="formData.size"
          required
        >
          <option value="small">小型</option>
          <option value="medium">中型</option>
          <option value="large">大型</option>
        </select>
      </div>

      <div class="form-group">
        <label>設備列表</label>
        <div class="equipment-list">
          <div
            v-for="(equipment, index) in formData.equipment"
            :key="index"
            class="equipment-item"
          >
            <input
              v-model="formData.equipment[index]"
              type="text"
              placeholder="輸入設備名稱"
            />
            <button
              type="button"
              @click="removeEquipment(index)"
              class="btn btn-danger btn-sm"
              :disabled="formData.equipment.length === 1"
            >
              刪除
            </button>
          </div>
          <button type="button" @click="addEquipment" class="btn btn-secondary btn-sm">
            添加設備
          </button>
        </div>
      </div>

      <div v-if="room" class="form-group">
        <label class="checkbox-label">
          <input
            v-model="formData.status"
            type="checkbox"
          />
          可用狀態
        </label>
      </div>
    </form>

    <template #footer>
      <button
        type="button"
        @click="$emit('close')"
        class="btn btn-secondary"
      >
        取消
      </button>
      <button
        type="submit"
        @click="handleSubmit"
        :disabled="loading"
        class="btn btn-primary"
      >
        {{ loading ? '保存中...' : '保存' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import BaseModal from './BaseModal.vue';
import { type SurgeryRoom } from '../services/surgery_rooms_api';

interface Props {
  show: boolean;
  room?: SurgeryRoom | null;
}

interface Emits {
  (e: 'update:show', value: boolean): void;
  (e: 'close'): void;
  (e: 'save', data: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const loading = ref(false);
const formData = ref({
  name: '',
  description: '', 
  size: '', 
  equipment: [''],
  cleaningTime: 0,
  status: 'maintenance'
});



const addEquipment = () => {
  formData.value.equipment.push('');
};

const removeEquipment = (index: number) => {
  if (formData.value.equipment.length > 1) {
    formData.value.equipment.splice(index, 1);
  }
};

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    size: '',
    equipment: [''],
    cleaningTime: 0,
    status: 'maintenance'
  };
};

const handleSubmit = async () => {
  if (loading.value) return;

  try {
    loading.value = true;

    // 過濾空設備
    const submitData = {
      ...formData.value,
      equipment: formData.value.equipment.filter(eq => eq.trim() !== '')
    };

    emit('save', submitData);
    emit('update:show', false);
    resetForm();
    
  } catch (error) {
    console.error('保存失敗:', error);
  } finally {
    loading.value = false;
  }
};
// 使用 onMounted 进行初始设置
onMounted(() => {
  if (props.room) {
    formData.value = {
      name: props.room.name,
      description: props.room.description || '',
      size: props.room.size,
      equipment: props.room.equipment.length > 0 ? [...props.room.equipment] : [''],
      cleaningTime: props.room.cleaningTime,
      status: props.room.status
    };
  } else {
    resetForm();
  }
});

// 只监听 room prop 的变化（去掉 immediate）
watch(() => props.room, (newRoom) => {
  if (newRoom) {
    formData.value = {
      name: newRoom.name,
      description: newRoom.description || '',
      size: newRoom.size,
      equipment: newRoom.equipment.length > 0 ? [...newRoom.equipment] : [''],
      cleaningTime: newRoom.cleaningTime,
      status: newRoom.status
    };
  } else {
    resetForm();
  }
});
</script>

<style scoped>
.surgery-room-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 4px;
  color: #495057;
}

input, textarea {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.equipment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.equipment-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.equipment-item input {
  flex: 1;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
  cursor: pointer;
}

.checkbox-label input {
  width: auto;
}
</style>