<template>
  <div class="beds-view">
    <div class="header">
      <h1>床位管理</h1>
      <a-button type="primary" @click="openCreateBedPage">新增床位</a-button>
    </div>

    <div class="beds-container">
      <a-space>
        <a-form layout="inline">
          <a-form-item label="科室">
            <a-select v-model:value="selectedDepartment" show-search placeholder="请选择科室" style="width: 200px"
              :options="departments.map(dept => ({ value: dept.id, label: dept.displayName }))" @change="fetchBeds">
            </a-select>
          </a-form-item>
        </a-form>
      </a-space>
      <a-table :columns="bedsColumns" :data-source="beds">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'isActive'">
            <a-switch v-model:checked="record.isActive" @change="activationStatusUpdate(record.id)" />

          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status.status)">
              {{ getStatus(record.status.status) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-button type="primary" @click="openPage(record.id)">详情</a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BedsService from '@/services/beds_api';
import { onMounted, watch } from 'vue';
import { ref } from 'vue';
import type { Beds } from '@/services/beds_api';
import { getStatus, getStatusColor } from '@/utils/helper.utils';
import { useRouter } from 'vue-router';
import DepartmentsService from '@/services/departments_api';
const router = useRouter();
const beds = ref<Beds[]>([]);
const selectedDepartment = ref('');
const departments = ref<any[]>([]);

const openPage = (id: number) => {
  router.push('/bed-details/' + id);
}
const bedsColumns = [
  {
    title: '床位编号',
    dataIndex: 'bedNumber',
    key: 'bedNumber',
  },
  {
    title: '楼层',
    dataIndex: 'floor',
    key: 'floor',
  },
  {
    title: '病房',
    dataIndex: 'ward',
    key: 'ward',
  },
  {
    title: '房间号',
    dataIndex: 'roomNumber',
    key: 'roomNumber',
  },
  {
    title: '科室',
    dataIndex: 'departmentId',
    key: 'departmentId',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '是否激活',
    dataIndex: 'isActive',
    key: 'isActive',
  },
  {
    title: '操作',
    key: 'action',
  },
];

const activationStatusUpdate = async (id: number) => {
  try {
    await BedsService.activationStatusUpdate(id);
    fetchBeds();
  } catch (error) {
    console.error('更新病床激活状态失败:', error);
  }
};

const fetchBeds = async (departmentId?: number) => {
  try {
    let departmentIdToFilter: number | undefined;
    // 1. 檢查 selectedDepartment.value 是否為有效值且不是 'all'
    // 假設 'all' 是您用來表示不篩選的值
    if (selectedDepartment.value && selectedDepartment.value !== 'all') {
      departmentIdToFilter = Number(selectedDepartment.value);
    }
    
    // 2. 構造 API 呼叫所需的參數對象
    const params: { department_id?: number } = {};
    
    if (departmentIdToFilter !== undefined) {
        // 🎯 注意：這裡使用後端 API 期望的參數名 department_id
        params.department_id = departmentIdToFilter; 
    }

    // 3. 呼叫服務，Axios 會自動處理查詢參數
    beds.value = await BedsService.listAllBeds(params); 
    
    // 檢查數據是否正確返回
    console.log("Fetched beds with params:", params, "Result:", beds.value); 

  } catch (error) {
    console.error('Failed to fetch beds:', error);
  }
}

const fetchDepartments = async () => {
  const list = await DepartmentsService.getDepartmentList();
  
  // 🎯 1. 添加 '所有科室' 選項
  departments.value = [{ id: 'all', displayName: '所有科室' }, ...list];
  
  // 🎯 2. 初始化選中的部門為 'all' (表示不篩選)
  selectedDepartment.value = 'all';
}

const openCreateBedPage = () => {
  router.push('/beds/new');
}
onMounted(async () => {
  // 🎯 確保先加載部門列表並設置 selectedDepartment = 'all'
  await fetchDepartments(); 
  
  // 🎯 然後執行第一次數據獲取
  await fetchBeds(); 
});
watch(selectedDepartment, () => {
  fetchBeds(Number(selectedDepartment.value));
});
</script>

<style scoped>
.beds-view {
  padding: 20px;
}
</style>