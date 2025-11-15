<template>
  <div class="beds-view">
    <a-page-header title="床位管理" />
    
    <div class="beds-container">
      <a-table :columns="bedsColumns" :data-source="beds">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'isActive'">
            <a-switch v-model:checked="record.isActive" />
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
import { onMounted } from 'vue';
import { ref } from 'vue';
import type { Beds } from '@/services/beds_api';
import { getStatus, getStatusColor } from '@/utils/helper.utils';
import { useRouter } from 'vue-router';

const router = useRouter();
const beds = ref<Beds[]>([]);

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

const openPage = (id: number) => {
  router.push('/bed-details/' + id);
}
onMounted(async () => {
  beds.value = await BedsService.listAllBeds();
  console.log(beds.value);
});
</script>

<style scoped>
.beds-view {
  padding: 20px;
}
</style>