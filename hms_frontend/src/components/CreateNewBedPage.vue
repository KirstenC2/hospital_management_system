<template>
    <div class="details-view">
        <div class="header">
            <h1>创建新病床</h1>
            <div class="header-actions">
                <a-button type="primary" @click="goBack">返回</a-button>
            </div>
        </div>
        <div class="form-container">
            <a-form class="form-group">
                <a-form-item label="病床编号">
                    <a-input v-model:value="bed.bedNumber" />
                </a-form-item>
                <a-form-item label="楼层">
                    <a-input v-model:value="bed.floor" />
                </a-form-item>
                <a-form-item label="病房">
                    <a-input v-model:value="bed.ward" />
                </a-form-item>
                <a-form-item label="房间号">
                    <a-input v-model:value="bed.roomNumber" />
                </a-form-item>
                <a-form-item label="科室">
                    <a-select v-model:value="bed.departmentId">
                        <a-select-option v-for="dept in departments" :key="dept.id" :value="dept.id">
                            {{ dept.displayName }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="状态">
                    <a-select v-model:value="bed.statusId">
                        <a-select-option v-for="status in bedStatuses" :key="status.id" :value="status.id">
                            {{ status.displayName }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="是否激活">
                    <a-switch v-model:checked="bed.is_active" />
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="createBed">创建</a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import BedsService, { type CreateBedDto } from '@/services/beds_api';
import DepartmentsService, { type DepartmentList } from '@/services/departments_api';
import { type BedStatus } from '@/services/beds_api';
const router = useRouter();

const bedStatuses = ref<BedStatus[]>([]);


const departments = ref<DepartmentList[]>([])
const bed = ref<CreateBedDto>(
    {
        bedNumber: 0,
        roomNumber: 0,
        ward: '',
        statusId: 0,
        is_active: false,
        location_info: '',
        notes: '',
        departmentId: 0,
        floor: 0,
    }
);

const goBack = () => {
    router.go(-1);
};

const fetchDepartments = async () => {
    try {
        const response = await DepartmentsService.getDepartmentList();
        departments.value = response;
    } catch (e) {
        console.error('Failed to fetch departments:', e);
    }
};

const fetchStatus = async () => {
    try {
        const response = await BedsService.listBedStatus();
        console.log(response)
        bedStatuses.value = response;
    } catch (error) {
        console.error('获取病床状态列表失败:', error);
    }
}


const createBed = async () => {
    try {
        if (!bed.value) {
            return;
        }
        console.log(bed.value)
        let result = await BedsService.createBed({
            bedNumber: bed.value.bedNumber,
            roomNumber: bed.value.roomNumber,
            ward: bed.value.ward,
            statusId: bed.value.statusId,
            is_active: bed.value.is_active,
            location_info: bed.value.location_info,
            notes: bed.value.notes,
            departmentId: bed.value.departmentId,
            floor: bed.value.floor,
        });
        console.log(result)
        router.push('/beds');
    } catch (error) {
        console.error('创建病床失败:', error);
    }
};

onMounted(() => {
    fetchDepartments();
    fetchStatus();
});
</script>

<style scoped>
.details-view {

    padding: 24px;

}

.form-container{
    max-width: 600px;
    margin: 0 auto;
    padding: 24px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
}

.header h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
}

.form-group {
    max-width: 600px;
    margin: 0 auto;
}

:deep(.ant-form-item) {
    margin-bottom: 16px;
}

:deep(.ant-form-item-label) {
    font-weight: 500;
}

:deep(.ant-input),
:deep(.ant-select) {
    width: 100%;
}

:deep(.ant-btn) {
    margin-right: 8px;
}

:deep(.ant-btn-primary) {
    min-width: 120px;
}

:deep(.ant-switch) {
    margin-left: 8px;
}

:deep(.ant-form-item-label > label) {
    color: rgba(0, 0, 0, 0.85);
}
</style>