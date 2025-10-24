<template>
    <div class="available-beds-list">
      <div class="section-header">
        <div class="section-title">
          <i class="fas fa-bed"></i>
          <span>今日空病床</span>
        </div>
        <router-link to="/beds" class="view-all-link">
          查看全部 <i class="fas fa-chevron-right"></i>
        </router-link>
      </div>
  
      <div class="beds-container">
        <div v-if="availableBeds.length === 0" class="empty-state">
          <i class="fas fa-bed fa-2x"></i>
          <p>暫無空病床</p>
        </div>
  
        <div v-else class="beds-list">
          <div 
            v-for="bed in availableBeds" 
            :key="bed.id"
            class="bed-item"
            @click="viewBedDetails(bed)"
          >
            <div class="bed-info">
              <div class="bed-number">{{ bed.bedNumber }}</div>
              <div class="bed-location">
                <span class="room">{{ bed.room }}</span>
                <span class="department">{{ bed.department }}</span>
              </div>
            </div>
            <div class="bed-status available">
              <i class="fas fa-check-circle"></i>
              <span>可用</span>
            </div>
          </div>
        </div>
      </div>
  
      <div class="quick-actions">
        <button class="btn btn-primary btn-sm" @click="assignBed">
          <i class="fas fa-user-plus"></i>
          分配病人
        </button>
        <button class="btn btn-outline btn-sm" @click="refreshBeds">
          <i class="fas fa-sync-alt"></i>
          刷新
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  
  interface Bed {
    id: string
    bedNumber: string
    room: string
    department: string
    status: string
  }
  
  interface Props {
    availableBeds: Bed[]
  }
  
  const props = defineProps<Props>()
  const router = useRouter()
  
  const viewBedDetails = (bed: Bed) => {
    console.log('查看病床詳情:', bed)
    router.push('/beds')
  }
  
  const assignBed = () => {
    router.push('/beds')
  }
  
  const refreshBeds = () => {
    console.log('刷新病床數據')
  }
  </script>
  
  <style scoped>
  .available-beds-list {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .section-title {
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--dark);
  }
  
  .section-title i {
    color: var(--primary);
  }
  
  .view-all-link {
    color: var(--primary);
    text-decoration: none;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: color 0.2s;
  }
  
  .view-all-link:hover {
    color: var(--primary-dark);
  }
  
  .beds-container {
    margin-bottom: 20px;
  }
  
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #64748b;
  }
  
  .empty-state i {
    margin-bottom: 10px;
    color: #cbd5e1;
  }
  
  .beds-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .bed-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: #f8fafc;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    border-left: 4px solid var(--secondary);
  }
  
  .bed-item:hover {
    background: #f1f5f9;
    transform: translateX(4px);
  }
  
  .bed-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .bed-number {
    font-size: 16px;
    font-weight: 600;
    color: var(--dark);
  }
  
  .bed-location {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #64748b;
  }
  
  .room {
    background: #e2e8f0;
    padding: 2px 6px;
    border-radius: 4px;
  }
  
  .department {
    color: #475569;
  }
  
  .bed-status {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }
  
  .bed-status.available {
    background: #dcfce7;
    color: var(--secondary);
  }
  
  .quick-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  </style>