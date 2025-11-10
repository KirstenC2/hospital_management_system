<template>
  <div class="doctors-view p-6 bg-gray-50 min-h-screen">
    <div class="header">
      <h1>醫生管理</h1>
      <div class="header-actions">
        <button class="btn btn-primary" @click="showAddDoctorModal = true">
          <i class="fas fa-plus"></i> 新增醫生
        </button>
        <button class="btn btn-outline" @click="fetchDoctors">
          <i class="fas fa-sync-alt"></i> 刷新
        </button>
      </div>
    </div>

    <a-row :gutter="16">
      <a-col :span="12">
        <a-card title="醫生總數">
          <p class="text-2xl font-bold text-gray-800">{{ doctors.length }}</p>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="科室總數">
          <p class="text-2xl font-bold text-gray-800">{{ departments.length }}</p>
        </a-card>
      </a-col>
    </a-row>
    <div class="doctor-stats-container">
      <h2 class="text-xl font-semibold mb-4 text-gray-700">科室醫生分佈</h2>

      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12" :lg="6" v-for="stat in mappedStats" :key="stat.departmentId">
          <a-card hoverable class="stat-card" :class="getCardClass(stat.departmentId)">
            <a-statistic :title="stat.departmentName" :value="stat.count" :prefix="getIcon(stat.departmentId)"
              class="text-base" />
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :lg="6">
          <a-card hoverable class="stat-card total-card">
            <a-statistic title="醫生總數" :value="doctors.length" prefix="👨‍⚕️" class="text-base" />
          </a-card>
        </a-col>
      </a-row>
    </div>

    <a-card :bodyStyle="{ padding: 0 }">
      <a-table :columns="doctorColumns" :data-source="mappedDoctors" :loading="loading" row-key="id" size="large"
        :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }">
        <template #title>
          <div class="table-header flex justify-between items-center p-4">
            <!-- <span class="text-lg font-semibold text-gray-700">醫生列表 ({{ mappedDoctors.length }})</span> -->
            <a-input-search v-model:value="searchQuery" placeholder="搜尋醫生姓名、科室或職稱" style="width: 300px" allow-clear
              @search="handleSearch" />
          </div>
        </template>

        <template #bodyCell="{ column, record }">

          <!-- 醫生姓名欄位 (包含職稱 Tag) -->
          <template v-if="column.key === 'name'">
            <div class="flex items-center space-x-3">
              <div class="doctor-avatar">
                {{ record.name.charAt(0) }}
              </div>
              <div>
                <div class="font-bold text-base text-gray-800">{{ record.name }}</div>
                <div class="text-sm text-gray-500 mt-1">{{ record.title }}</div>
              </div>
            </div>
          </template>

          <!-- 科室欄位 -->
          <template v-else-if="column.key === 'department'">
            <a-tag color="blue" class="text-base py-1 px-3 rounded-full">
              {{ record.departmentName }}
            </a-tag>
          </template>

          <!-- 操作欄位 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button size="small" @click="viewDoctor(record)">
                <template #icon>
                  <EyeOutlined />
                </template>
                詳情
              </a-button>
              <a-button size="small" type="ghost" @click="editDoctor(record)">
                <template #icon>
                  <EditOutlined />
                </template>
                編輯
              </a-button>
            </a-space>
          </template>
        </template>

      </a-table>
    </a-card>

    <!-- 這裡將用於顯示醫生詳情的 Modal 或抽屜組件 -->
    <a-modal v-model:visible="showDetailsModal" :title="selectedDoctor ? `${selectedDoctor.name} - 詳情` : '醫生詳情'"
      :footer="null">
      <p v-if="selectedDoctor" class="p-4">
        正在查看 **{{ selectedDoctor.name }}** 的資料...
        <br>科室：{{ selectedDoctor.department.displayName }}
        <!-- <br>門診量：{{ selectedDoctor.appointmentCount }} -->
      </p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Doctor } from '@/services/doctors_api';
import type { DepartmentList } from '@/services/departments_api';
import DoctorsService from '@/services/doctors_api';
import DepartmentsService from '@/services/departments_api';
import {
  Table as ATable, Button as AButton, Card as ACard,
  PageHeader as APageHeader, Tag as ATag, Space as ASpace,
  InputSearch as AInputSearch, Modal as AModal
} from 'ant-design-vue';
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons-vue';


// ------------------- 數據和狀態 -------------------

const doctors = ref<Doctor[]>([]);
const departments = ref<DepartmentList[]>([]);
const departmentDoctorsStat = ref<any[]>([]);
const loading = ref(true);
const showDetailsModal = ref(false);
const selectedDoctor = ref<Doctor | null>(null);
const showAddDoctorModal = ref(false);
const searchQuery = ref('');

// ------------------- Computed 屬性 -------------------

/**
 * 將原始醫生數據與部門名稱合併，並添加一些模擬數據以供表格展示
 * 這是為了讓表格的 dataIndex 能夠直接訪問到 departmentName
 */


const mappedDoctors = computed(() => {
  let list = (doctors.value || []).map(doc => {
    // 假設 doc.department 已經是一個包含 displayName 的物件，
    // 如果實際應用中它是 ID，則需要在此處進行映射查找。
    const departmentName = (doc.department as any)?.displayName || doc.department || '未分配';

    // Mock 數據以填充表格欄位
    return {
      ...doc,
      departmentName,
      phone: doc.phone
    };
  });

  // 篩選邏輯
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    list = list.filter(d =>
      d.name.toLowerCase().includes(query) ||
      d.title.toLowerCase().includes(query) ||
      d.departmentName.toLowerCase().includes(query)
    );
  }

  return list;
});

/**
 * 將部門 ID 計數數據與部門名稱映射列表進行合併。
 */
const mappedStats = computed(() => {
  // 建立 ID 到名稱的快速查找表
  const deptLookup = departments.value.reduce<Record<any, string>>((acc, dept) => {
    acc[dept.id] = dept.displayName;
    return acc;
  }, {});

  return departmentDoctorsStat.value.map(item => ({
    departmentId: item.departmentId,
    // 確保 count 是數字，即使它是從字串 "3" 傳入
    count: parseInt(item.count, 10),
    // 查找部門名稱，若找不到則顯示 ID
    departmentName: deptLookup[item.departmentId] || `ID ${item.departmentId}`,
  })).sort((a, b) => b.count - a.count); // 依計數降序排列
});
// ------------------- 表格定義 -------------------

const doctorColumns = [
  {
    title: '醫生姓名/職稱',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left' as const,
    width: 250,
  },
  {
    title: '科室',
    dataIndex: 'departmentName',
    key: 'department',
    width: 150,
    sorter: (a: any, b: any) => a.departmentName.localeCompare(b.departmentName, 'zh-Hans'),
  },
  {
    title: '聯絡電話',
    dataIndex: 'phone',
    key: 'phone',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right' as const,
    width: 150,
  },
];

// ------------------- 方法 -------------------

const fetchDoctors = async () => {
  try {
    const response = await DoctorsService.getAllDoctors();
    doctors.value = response;
  } catch (e) {
    console.error('Failed to fetch doctors:', e);
  }
};

const fetchDepartments = async () => {
  try {
    const response = await DepartmentsService.getDepartmentList();
    departments.value = response;
  } catch (e) {
    console.error('Failed to fetch departments:', e);
  }
};

const fetchDepartmentDoctorsStat = async () => {
  try {
    const response = await DoctorsService.getHeadcount();
    departmentDoctorsStat.value = response;
    console.log(departmentDoctorsStat.value);
  } catch (e) {
    console.error('Failed to fetch department doctors stat:', e);
  }
};

const viewDoctor = (doctor: any) => {
  selectedDoctor.value = doctor;
  showDetailsModal.value = true;
};

const editDoctor = (doctor: any) => {
  console.log('Editing doctor:', doctor.id);
  // 實際應用中會打開編輯表單或導航到編輯頁面
  alert(`準備編輯醫生：${doctor.name}`);
};

const handleSearch = () => {
  // 當 mappedDoctors 是 computed 屬性時，只需觸發 searchQuery 改變即可
  console.log(`Searching for: ${searchQuery.value}`);
};
// ------------------- 輔助函數 (美化) -------------------

/**
 * 根據 ID 賦予不同的圖標 (使用 Emoji 代替 Antd Icon 以簡化)
 */
const getIcon = (id: number) => {
  const icons: { [key: number]: string } = {
    1: '🧠', // 神經科/內科 (假設 1=內科)
    2: '🔪', // 外科
    3: '👶', // 兒科
    4: '🫀', // 心臟科 (假設 4=心臟科)
    // ... 添加其他科室 ID
  };
  return icons[id] || '💼';
};
/**
 * 根據 ID 賦予不同的卡片樣式
 */
const getCardClass = (id: number) => {
  const classes: { [key: number]: string } = {
    1: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    2: 'bg-red-50 border-red-200 text-red-700',
    3: 'bg-green-50 border-green-200 text-green-700',
    4: 'bg-pink-50 border-pink-200 text-pink-700',
  };
  return classes[id] || 'bg-gray-50 border-gray-200 text-gray-700';
};

// ------------------- 生命週期 -------------------

onMounted(async () => {
  loading.value = true;
  await Promise.all([fetchDoctors(), fetchDepartments(), fetchDepartmentDoctorsStat()]);
  loading.value = false;
});
</script>

<style scoped>
/* 刪除原有的 .doctors-grid 相關樣式，專注於表格和組件樣式 */
.search-bar-container {
  padding: 20px;
  background-color: #f8fafc;
  border-radius: 8px;
}

.mb-3 {
  margin-bottom: 12px;
  font-weight: 500;
  color: #333;
}

.doctors-view {
  /* 移除原本的 padding，改用 Tailwind/Antd 類 */
  padding: 20px;
}

/* 自定義 Avatar 樣式 */
.doctor-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3b82f6;
  /* primary blue */
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  flex-shrink: 0;
}


</style>