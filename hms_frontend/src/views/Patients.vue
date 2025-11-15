<template>
  <div class="patients-view">
    <a-page-header title="病人管理" :style="{ padding: '0 0 20px 0' }">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="showAddPatientModal = true">
            <template #icon>
              <PlusOutlined />
            </template>
            新增病人
          </a-button>
          <a-button @click="fetchPatients">
            <template #icon>
              <SyncOutlined />
            </template>
            刷新
          </a-button>
        </a-space>
      </template>
    </a-page-header>
    <a-row>
      <a-col :span="6">
        <a-card title=" 病人總數">
          {{ totalPatientsCount }}
        </a-card>
      </a-col>
    </a-row>

    <a-card :bordered="false">
      <h3>病人列表</h3>
      <a-table :columns="columns" :data-source="patients" :loading="loading" row-key="id"
        :pagination="{ pageSize: 10, showSizeChanger: true }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button type="link" @click="openPatientInNewTab(record)" >
              <template #icon>
                <EyeOutlined />
              </template>
              查看
            </a-button>
            <a-button type="link" @click="initiateAdmission(record)">
              <template #icon>
                <BedOutlined />
              </template>
              办理住院
            </a-button>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:visible="showAdmissionModal" title="辦理住院" @ok="handleAdmission">
      <a-form :model="newAdmissionRecord" layout="vertical">
        <!-- Existing fields -->
        <a-form-item label="主治醫生" name="doctorId" :rules="[{ required: true, message: '請選擇主治醫生' }]">
          <a-select v-model:value="newAdmissionRecord.doctorId">
            <a-select-option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
              {{ doctor.name + ' - ' + doctor.title }} ({{ doctor.department.displayName }})
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="床位號碼" name="bedId">
          <a-select v-model:value="newAdmissionRecord.bedId">
            <a-select-option v-for="bed in beds" :key="bed.id" :value="bed.id">
               {{ bed.bedNumber }} - {{ bed.floor }}樓 {{ bed.ward }}病房 {{ bed.departmentId }}部門
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="主訴" name="chiefComplaint">
          <a-textarea v-model:value="newAdmissionRecord.chiefComplaint" placeholder="請輸入病人主訴" />
        </a-form-item>

        <a-form-item label="診斷" name="diagnosis" :rules="[{ required: true, message: '請輸入診斷' }]">
          <a-textarea v-model:value="newAdmissionRecord.diagnosis" placeholder="請輸入診斷" />
        </a-form-item>

        <a-form-item label="病史" name="medicalHistory">
          <a-textarea v-model:value="newAdmissionRecord.medicalHistory" placeholder="請輸入病史" />
        </a-form-item>

        <a-form-item label="治療計劃" name="treatmentPlan">
          <a-textarea v-model:value="newAdmissionRecord.treatmentPlan" placeholder="請輸入治療計劃" />
        </a-form-item>

        <a-form-item label="入院備註" name="admissionNotes">
          <a-textarea v-model:value="newAdmissionRecord.admissionNotes" placeholder="請輸入入院備註" />
        </a-form-item>

        <a-form-item label="預計出院日期" name="expectedDischargeDate" :rules="[{ required: true, message: '請選擇預計出院日期' }]">
          <a-date-picker v-model:value="newAdmissionRecord.expectedDischargeDate" style="width: 100%"
            format="YYYY-MM-DD" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Add Patient Modal -->
    <a-modal v-model:visible="showAddPatientModal" title="新增病人" @ok="handleAddPatient"
      :confirm-loading="confirmLoading">
      <a-form :model="newPatient" layout="vertical">
        <a-form-item label="姓名" name="name" :rules="[{ required: true, message: '請輸入姓名' }]">
          <a-input v-model:value="newPatient.name" placeholder="請輸入病人姓名" />
        </a-form-item>

        <a-form-item label="性別" name="gender" :rules="[{ required: true }]">
          <a-select v-model:value="newPatient.gender">
            <a-select-option value="male">男</a-select-option>
            <a-select-option value="female">女</a-select-option>
            <a-select-option value="other">其他</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="年齡" name="age" :rules="[{ required: true, type: 'number', min: 0, max: 150 }]">
          <a-input-number v-model:value="newPatient.age" style="width: 100%" />
        </a-form-item>

        <a-form-item label="出生日期" name="birthDate">
          <a-date-picker v-model:value="newPatient.birthDate" style="width: 100%" format="YYYY-MM-DD" />
        </a-form-item>

        <a-form-item label="電話" name="phone">
          <a-input v-model:value="newPatient.phone" placeholder="請輸入電話號碼" />
        </a-form-item>

        <a-form-item label="地址" name="address">
          <a-textarea v-model:value="newPatient.address" placeholder="請輸入地址" />
        </a-form-item>

        <a-form-item label="緊急聯絡人" name="emergencyContact">
          <a-input v-model:value="newPatient.emergencyContact" placeholder="請輸入緊急聯絡人姓名" />
        </a-form-item>

        <a-form-item label="緊急聯絡電話" name="emergencyPhone">
          <a-input v-model:value="newPatient.emergencyPhone" placeholder="請輸入緊急聯絡電話" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  Table as ATable,
  Button as AButton,
  Card as ACard,
  Modal as AModal,
  Form as AForm,
  Input as AInput,
  InputNumber as AInputNumber,
  Select as ASelect,
  Tag as ATag,
  Space as ASpace,
  PageHeader as APageHeader,
  message
} from 'ant-design-vue';
import {
  PlusOutlined,
  EyeOutlined,
  SyncOutlined
} from '@ant-design/icons-vue';
import PatientsService from '@/services/patients_api';
import type { BasePatient } from '@/services/patients_api';
import DoctorsService from '@/services/doctors_api';
import type { Doctor } from '@/services/doctors_api';
import BedsService from '@/services/beds_api';
import type { Beds } from '@/services/beds_api';
import DepartmentsService from '@/services/departments_api';
import type { DepartmentList } from '@/services/departments_api';
import { getStatusColor } from '@/utils/helper.utils';
import AppointmentService from '@/services/appointment_api';

const AFormItem = AForm.Item;
const ASelectOption = ASelect.Option;
const ATextarea = AInput.TextArea;

const router = useRouter();
const loading = ref(false);
const confirmLoading = ref(false);
const showAddPatientModal = ref(false);
const patients = ref<BasePatient[]>([]);
const doctors = ref<Doctor[]>([]);
const beds = ref<Beds[]>([]);
const totalPatientsCount = ref(0);
const departments = ref<DepartmentList[]>([]);
// 新增狀態
const showAdmissionModal = ref(false); // 控制住院 Modal 顯示
const patientToAdmit = ref<BasePatient | null>(null); // 儲存待辦理住院的病人
const admissionLoading = ref(false); // 住院辦理按鈕的載入狀態
const selectedDepartmentId = ref<number | 'all'>('all');
// const inpatientRecords = ref<any[]>([]);
// 新增住院表單數據
const newAdmissionRecord = ref({
  patientId: 0,
  doctorId: 0,  // This will be set from the form
  bedId: undefined as number | undefined,
  admissionDate: new Date().toISOString().split('T')[0],
  expectedDischargeDate: '',
  diagnosis: '',
  chiefComplaint: '',
  medicalHistory: '',
  treatmentPlan: '',
  admissionNotes: '',
  status: 'waiting' as const
});
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '性別',
    dataIndex: 'gender',
    key: 'gender',
  },
  {
    title: '年齡',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '電話',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
  },
];

const newPatient = ref<Partial<BasePatient>>({
  name: '',
  gender: 'male',
  age: 0,
  phone: '',
  address: '',
  emergencyContact: '',
  emergencyPhone: '',
  status: 'inpatient'
});


/**
 * 點擊「辦理住院」按鈕，打開住院表單 Modal
 */
const initiateAdmission = (patient: BasePatient) => {
  patientToAdmit.value = patient;

  // Initialize the form with default values
  newAdmissionRecord.value = {
    patientId: patient.id,
    doctorId: 101, // Default doctor
    bedId: undefined,
    admissionDate: new Date().toISOString().split('T')[0],
    expectedDischargeDate: '',
    diagnosis: '',
    chiefComplaint: '',
    medicalHistory: '',
    treatmentPlan: '',
    admissionNotes: '',
    status: 'waiting'
  };

  showAdmissionModal.value = true;
};

const fetchPatients = async () => {
  try {
    loading.value = true;
    // 假設 PatientsService.getAllPatients 支持傳入 departmentId 作為篩選條件
    const params: { departmentId?: number } = {};
    if (selectedDepartmentId.value !== 'all' && selectedDepartmentId.value !== undefined) {
      params.departmentId = selectedDepartmentId.value;
    }
    
    // ⚠️ 實際應用中，您可能需要修改 PatientsService.getAllPatients 來接受 params
    const response = await PatientsService.getAllPatients(params); 
    
    patients.value = response.map(patient => ({
      ...patient,
      id: Number(patient.id)
    }));

    
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    message.error('獲取病人列表失敗');
  } finally {
    loading.value = false;
  }
};

const fetchDepartments = async () => {
  try {
    const response = await DepartmentsService.getDepartmentList();
    departments.value = response;
  } catch (error) {
    console.error('Failed to fetch departments:', error);
    message.error('獲取科室列表失敗');
  }
};

const fetchTotalPatientsCount = async () => {
  try {
    const response = await PatientsService.getTotalPatientsCount();
    totalPatientsCount.value = response;
  } catch (error) {
    console.error('Failed to fetch total patients count:', error);
    message.error('獲取病人總數失敗');
  }
};

const fetchBeds = async () => {
  try {
    loading.value = true;
    const response = await BedsService.getAvailableBeds();
    beds.value = response; 
  } catch (error) {
    console.error('Failed to fetch beds:', error);
    message.error('獲取病床列表失敗');
  } finally {
    loading.value = false;
  }
};

const openPatientInNewTab = (patient: BasePatient) => {
  router.push({
    name: 'PatientDetail',
    params: { id: patient.id }
  });
};

// Update the handleAddPatient function
const handleAddPatient = async () => {
  try {
    confirmLoading.value = true;

    // Prepare the patient data according to the entity
    const patientData = {
      name: newPatient.value.name || '',
      gender: newPatient.value.gender || 'male',
      age: newPatient.value.age || 0,
      admissionDate: new Date(),
      phone: newPatient.value.phone || '',
      address: newPatient.value.address || '',
      emergencyContact: newPatient.value.emergencyContact || '',
      emergencyPhone: newPatient.value.emergencyPhone || '',
      status: 'inpatient' // Default status
    };

    // Call the API to create a new patient
    await PatientsService.createPatient(patientData);

    message.success('病人添加成功');
    showAddPatientModal.value = false;
    await fetchPatients();

    // Reset the form
    newPatient.value = {
      name: '',
      gender: 'male',
      age: 0,
      phone: '',
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      status: 'inpatient'
    };
  } catch (error) {
    console.error('Failed to add patient:', error);
    message.error('添加病人失敗');
  } finally {
    confirmLoading.value = false;
  }
};

/**
 * 處理住院表單提交邏輯
 */
const handleAdmission = async () => {
  if (!patientToAdmit.value) return;

  try {
    admissionLoading.value = true;

    // Format the data for the API
    const admissionData = {
      ...newAdmissionRecord.value,
      patientId: patientToAdmit.value.id,
      admissionDate: new Date().toISOString(),
      status: 'inpatient' as const
    };

    // Call the API
    await PatientsService.createInpatientRecord(admissionData);

    // Show success message and refresh the list
    message.success(`病人 ${patientToAdmit.value.name} 已成功辦理住院`);
    showAdmissionModal.value = false;
    await fetchPatients();

  } catch (error) {
    console.error('Failed to handle admission:', error);
    message.error('辦理住院手續失敗');
  } finally {
    admissionLoading.value = false;
  }
};

const fetchDoctors = async () => {
  try {
    loading.value = true;
    const response = await DoctorsService.getAllDoctors();
    doctors.value = response;
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
    message.error('獲取醫生列表失敗');
  } finally {
    loading.value = false;
  }
};


onMounted(() => {
  fetchPatients();
  fetchDepartments();
  fetchTotalPatientsCount();
  // fetchInpatientRecords();
  fetchBeds();
  fetchDoctors();
});
</script>

<style scoped>
.patients-view {
  padding: 20px;
}

.ant-page-header {
  padding: 0 0 20px 0;
}

.ant-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>