<template>
  <BaseTable
    :columns="tableColumns"
    :data="patients"
    :show-empty-state="showEmptyState"
    :table-class="tableClass"
  >
    <template #header v-if="$slots.header">
      <slot name="header"></slot>
    </template>

    <template #tbody>
      <tr 
        v-for="patient in patients" 
        :key="patient.id"
        :class="getRowClass(patient)"
      >
        <td>{{ patient.id }}</td>
        
        <td class="patient-name-cell">
          <div class="name">{{ patient.name }}</div>
          <div v-if="patient.contactNumber" class="contact">
            {{ patient.contactNumber }}
          </div>
          <div v-if="patient.diagnosis" class="diagnosis">
            {{ patient.diagnosis }}
          </div>
        </td>
        
        <td>
          <span class="gender-badge" :class="`gender-${patient.gender}`">
            {{ patient.gender }}
          </span>
        </td>
        
        <td>{{ patient.age }}歲</td>
        
        <td>
          <span class="status" :class="`status-${patient.status}`">
            {{ getStatusText(patient.status) }}
          </span>
        </td>
        
        <td>
          <span v-if="patient.bedId" class="bed-number">
            <i class="fas fa-bed"></i>
            {{ patient.bedId }}
          </span>
          <span v-else class="no-bed">無</span>
        </td>
        
        <td>
          <div class="action-buttons">
            <button 
              class="btn btn-sm btn-outline" 
              @click="handleView(patient)"
              title="查看詳細資料"
            >
              <i class="fas fa-eye"></i>
              查看
            </button>
            <button 
              class="btn btn-sm btn-outline" 
              @click="handleEdit(patient)"
              title="編輯病人資料"
            >
              <i class="fas fa-edit"></i>
              編輯
            </button>
            <button 
              v-if="showDischargeButton && patient.status === 'inpatient'" 
              class="btn btn-sm btn-warning"
              @click="handleDischarge(patient)"
              title="辦理出院"
            >
              <i class="fas fa-sign-out-alt"></i>
              出院
            </button>
            <slot name="actions" :patient="patient"></slot>
          </div>
        </td>
      </tr>
    </template>

    <template #empty>
      <div class="empty-patient-state">
        <i class="fas fa-user-injured"></i>
        <span>暫無病人資料</span>
        <button v-if="showAddButton" class="btn btn-primary btn-sm" @click="handleAddPatient">
          <i class="fas fa-plus"></i>
          新增病人
        </button>
      </div>
    </template>

    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </BaseTable>
</template>

<script>
import BaseTable from './BaseTable.vue'

export default {
  name: 'PatientTable',
  components: {
    BaseTable
  },
  props: {
    patients: {
      type: Array,
      required: true,
      default: () => []
    },
    showDischargeButton: {
      type: Boolean,
      default: true
    },
    showAddButton: {
      type: Boolean,
      default: false
    },
    showEmptyState: {
      type: Boolean,
      default: true
    },
    tableClass: {
      type: String,
      default: ''
    },
    statusMap: {
      type: Object,
      default: () => ({
        'waiting': '等待床位',
        'inpatient': '住院中',
        'discharged': '已出院',
        'transferred': '已轉院'
      })
    }
  },
  computed: {
    tableColumns() {
      return [
        { label: '病歷號', class: 'col-id' },
        { label: '姓名', class: 'col-name' },
        { label: '性別', class: 'col-gender' },
        { label: '年齡', class: 'col-age' },
        { label: '狀態', class: 'col-status' },
        { label: '床位', class: 'col-bed' },
        { label: '操作', class: 'col-actions' }
      ]
    }
  },
  methods: {
    getStatusText(status) {
      return this.statusMap[status] || status
    },
    
    getRowClass(patient) {
      const classes = []
      if (patient.urgent) classes.push('urgent-patient')
      if (patient.status === 'discharged') classes.push('discharged-patient')
      return classes
    },
    
    handleView(patient) {
      this.$emit('view', patient)
    },
    
    handleEdit(patient) {
      this.$emit('edit', patient)
    },
    
    handleDischarge(patient) {
      this.$emit('discharge', patient)
    },
    
    handleAddPatient() {
      this.$emit('add-patient')
    }
  }
}
</script>

<style scoped>
.patient-name-cell {
  min-width: 120px;
}

.name {
  font-weight: 600;
  color: #212529;
}

.contact {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.1rem;
}

.diagnosis {
  font-size: 0.8rem;
  color: #495057;
  background: #f8f9fa;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  margin-top: 0.2rem;
  display: inline-block;
}

.gender-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.gender-男 {
  background: #d1ecf1;
  color: #0c5460;
}

.gender-女 {
  background: #f8d7da;
  color: #721c24;
}

.status {
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  display: inline-block;
  min-width: 80px;
}

.status-waiting {
  background: #fff3cd;
  color: #856404;
}

.status-inpatient {
  background: #d1ecf1;
  color: #0c5460;
}

.status-discharged {
  background: #d4edda;
  color: #155724;
}

.status-transferred {
  background: #e2e3e5;
  color: #383d41;
}

.bed-number {
  background: #007bff;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.no-bed {
  color: #6c757d;
  font-style: italic;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.btn-outline {
  background: transparent;
  border: 1px solid #6c757d;
  color: #6c757d;
}

.btn-outline:hover {
  background: #6c757d;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background: #e0a800;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.urgent-patient {
  background-color: #fff3cd !important;
}

.discharged-patient {
  opacity: 0.7;
}

.empty-patient-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.empty-patient-state i {
  font-size: 3rem;
  color: #adb5bd;
}
</style>