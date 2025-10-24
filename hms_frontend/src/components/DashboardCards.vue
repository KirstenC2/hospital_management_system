<template>
    <div class="dashboard-cards">
      <div class="card patients">
        <div class="card-header">
          <div>
            <div class="card-value">{{ stats.patients }}</div>
            <div class="card-title">住院病人</div>
          </div>
          <div class="card-icon">
            <i class="fas fa-user-injured"></i>
          </div>
        </div>
        <div class="card-trend trend-up">
          <i class="fas fa-arrow-up"></i>
          <span>較上月增加 5%</span>
        </div>
      </div>
  
      <div class="card doctors">
        <div class="card-header">
          <div>
            <div class="card-value">{{ stats.doctors }}</div>
            <div class="card-title">在職醫生</div>
          </div>
          <div class="card-icon">
            <i class="fas fa-user-md"></i>
          </div>
        </div>
        <div class="card-trend trend-up">
          <i class="fas fa-arrow-up"></i>
          <span>較上月增加 2%</span>
        </div>
      </div>
  
      <div class="card appointments">
        <div class="card-header">
          <div>
            <div class="card-value">{{ stats.appointments }}</div>
            <div class="card-title">今日預約</div>
          </div>
          <div class="card-icon">
            <i class="fas fa-calendar-check"></i>
          </div>
        </div>
        <div class="card-trend trend-down">
          <i class="fas fa-arrow-down"></i>
          <span>較昨日減少 3%</span>
        </div>
      </div>
  
      <div class="card revenue">
        <div class="card-header">
          <div>
            <div class="card-value">${{ stats.revenue }}</div>
            <div class="card-title">本月收入</div>
          </div>
          <div class="card-icon">
            <i class="fas fa-dollar-sign"></i>
          </div>
        </div>
        <div class="card-trend trend-up">
          <i class="fas fa-arrow-up"></i>
          <span>較上月增加 12%</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DashboardCards',
    data() {
      return {
        stats: {
          patients: 124,
          doctors: 42,
          appointments: 28,
          revenue: '86,420'
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .dashboard-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .card {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    transition: transform 0.3s;
  }
  
  .card:hover {
    transform: translateY(-5px);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .card-icon {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }
  
  .patients .card-icon { background-color: #dbeafe; color: var(--primary); }
  .doctors .card-icon { background-color: #dcfce7; color: var(--secondary); }
  .appointments .card-icon { background-color: #fef3c7; color: #f59e0b; }
  .revenue .card-icon { background-color: #fce7f3; color: #db2777; }
  
  .card-value {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 5px;
  }
  
  .card-title {
    color: #64748b;
    font-size: 14px;
  }
  
  .card-trend {
    font-size: 14px;
    display: flex;
    align-items: center;
    margin-top: 10px;
  }
  
  .trend-up { color: var(--secondary); }
  .trend-down { color: #ef4444; }
  </style>