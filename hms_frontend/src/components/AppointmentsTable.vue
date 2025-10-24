<template>
    <div class="appointments-section">
      <div class="section-title">
        <i class="fas fa-list"></i>
        <span>今日預約</span>
      </div>
  
      <div class="data-table">
        <table>
          <thead>
            <tr>
              <th>病人姓名</th>
              <th>醫生</th>
              <th>部門</th>
              <th>時間</th>
              <th>狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="appointment in appointments" :key="appointment.id">
              <td>{{ appointment.patientName }}</td>
              <td>{{ appointment.doctorName }}</td>
              <td>{{ appointment.department }}</td>
              <td>{{ appointment.time }}</td>
              <td>
                <span class="status" :class="`status-${appointment.status}`">
                  {{ getStatusText(appointment.status) }}
                </span>
              </td>
              <td>
                <button class="btn btn-outline" @click="viewAppointment(appointment)">
                  查看
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  
  interface Appointment {
    id: number
    patientName: string
    doctorName: string
    department: string
    time: string
    status: string
  }
  
  export default defineComponent({
    name: 'AppointmentsTable',
    data() {
      return {
        appointments: [
          {
            id: 1,
            patientName: '張小明',
            doctorName: '王醫生',
            department: '心臟內科',
            time: '09:00 AM',
            status: 'admitted'
          },
          {
            id: 2,
            patientName: '李美華',
            doctorName: '陳醫生',
            department: '兒科',
            time: '10:30 AM',
            status: 'pending'
          },
          {
            id: 3,
            patientName: '劉大偉',
            doctorName: '林醫生',
            department: '骨科',
            time: '11:15 AM',
            status: 'discharged'
          }
        ] as Appointment[]
      }
    },
    methods: {
      getStatusText(status: string): string {
        const statusMap: { [key: string]: string } = {
          'admitted': '已入院',
          'discharged': '已出院',
          'pending': '待處理'
        }
        return statusMap[status] || status
      },
      viewAppointment(appointment: Appointment) {
        alert(`查看預約: ${appointment.patientName} - ${appointment.doctorName}`)
      }
    }
  })
  </script>
  
  <style scoped>
  .appointments-section {
    margin-bottom: 30px;
  }
  
  .section-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }
  
  .section-title i {
    margin-right: 10px;
    color: var(--primary);
  }
  
  .data-table {
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  
  th {
    background-color: #f8fafc;
    font-weight: 600;
    color: #64748b;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  .status {
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  
  .status-admitted { background-color: #fef3c7; color: #d97706; }
  .status-discharged { background-color: #dcfce7; color: #16a34a; }
  .status-pending { background-color: #dbeafe; color: #2563eb; }
  
  .btn {
    padding: 8px 15px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }
  
  .btn-outline {
    background-color: transparent;
    border: 1px solid var(--primary);
    color: var(--primary);
  }
  
  .btn-outline:hover {
    background-color: var(--primary);
    color: white;
  }
  </style>