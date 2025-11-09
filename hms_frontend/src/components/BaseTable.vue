<template>
  <div class="data-table-container">
    <div v-if="$slots.header" class="table-header">
      <slot name="header"></slot>
    </div>
    
    <div class="data-table-wrapper">
      <table class="data-table" :class="tableClass">
        <thead>
          <tr>
            <th 
              v-for="(column, index) in columns" 
              :key="index"
              :class="column.class"
              :style="column.style"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <slot name="tbody"></slot>
          <tr v-if="showEmptyState && (!data || data.length === 0)">
            <td :colspan="columns.length" class="empty-state">
              <slot name="empty">
                <div class="empty-content">
                  <i class="fas fa-inbox"></i>
                  <span>暫無資料</span>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="$slots.footer" class="table-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseTable',
  props: {
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    showEmptyState: {
      type: Boolean,
      default: true
    },
    tableClass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.data-table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.data-table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.data-table th {
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 1px solid #dee2e6;
  white-space: nowrap;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

.data-table tbody tr {
  transition: background-color 0.2s ease;
}

.data-table tbody tr:hover {
  background-color: #f8f9fa;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.empty-content i {
  font-size: 2rem;
  color: #adb5bd;
}

.table-footer {
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
}
</style>