<!-- src/components/BaseDropdown.vue -->
<template>
  <div class="base-dropdown" :class="{ 'is-invalid': invalid }">
    <label v-if="label" :for="id" class="dropdown-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    
    <div class="dropdown-wrapper">
      <select
        :id="id"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        @change="handleChange"
        @blur="handleBlur"
        class="dropdown-select"
        :class="{
          'has-value': modelValue !== '',
          'is-disabled': disabled,
          'is-invalid': invalid
        }"
      >
        <option 
          v-if="placeholder" 
          value="" 
          disabled
          class="placeholder-option"
        >
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="getOptionKey(option)"
          :value="getOptionValue(option)"
          :disabled="getOptionDisabled(option)"
          class="dropdown-option"
        >
          {{ getOptionLabel(option) }}
        </option>
      </select>
      
      <div class="dropdown-icon">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
        </svg>
      </div>
    </div>

    <div v-if="invalid && errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    
    <div v-if="hint" class="hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface DropdownOption {
  value: any;
  label: string;
  disabled?: boolean;
}

interface Props {
  // 双向绑定值
  modelValue?: any;
  
  // 选项列表
  options?: any[] | DropdownOption[];
  
  // 标签相关
  label?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  
  // 验证相关
  invalid?: boolean;
  errorMessage?: string;
  hint?: string;
  
  // 自定义字段名
  valueKey?: string;
  labelKey?: string;
  disabledKey?: string;
}

interface Emits {
  (e: 'update:modelValue', value: any): void;
  (e: 'change', value: any, event: Event): void;
  (e: 'blur', event: Event): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  options: () => [],
  invalid: false,
  required: false,
  disabled: false,
  valueKey: 'value',
  labelKey: 'label',
  disabledKey: 'disabled'
});

const emit = defineEmits<Emits>();

// 处理选项值
const getOptionValue = (option: any): any => {
  if (typeof option === 'object' && option !== null) {
    return option[props.valueKey];
  }
  return option;
};

// 处理选项显示文本
const getOptionLabel = (option: any): string => {
  if (typeof option === 'object' && option !== null) {
    return option[props.labelKey];
  }
  return String(option);
};

// 处理选项禁用状态
const getOptionDisabled = (option: any): boolean => {
  if (typeof option === 'object' && option !== null) {
    return option[props.disabledKey] || false;
  }
  return false;
};

// 处理选项的 key
const getOptionKey = (option: any): string => {
  if (typeof option === 'object' && option !== null) {
    return String(option[props.valueKey]);
  }
  return String(option);
};

// 处理选择变化
const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = target.value;
  
  emit('update:modelValue', value);
  emit('change', value, event);
};

// 处理失去焦点
const handleBlur = (event: Event) => {
  emit('blur', event);
};
</script>

<style scoped>
.base-dropdown {
  margin-bottom: 1rem;
}

.dropdown-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: #374151;
}

.required {
  color: #ef4444;
  margin-left: 0.25rem;
}

.dropdown-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.dropdown-select {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: white;
  font-size: 0.875rem;
  color: #374151;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-select:hover:not(.is-disabled) {
  border-color: #9ca3af;
}

.dropdown-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dropdown-select.has-value {
  color: #111827;
}

.dropdown-select.is-disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.dropdown-select.is-invalid {
  border-color: #ef4444;
}

.dropdown-select.is-invalid:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.dropdown-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
}

.placeholder-option {
  color: #9ca3af;
}

.dropdown-option {
  color: #374151;
}

.dropdown-option:disabled {
  color: #9ca3af;
  background-color: #f9fafb;
}

.error-message {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #ef4444;
}

.hint {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}
</style>