// src/stores/employeeStore.js
import { defineStore } from 'pinia';

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    // Geçici Mock Veriler
    employees: [
      { id: 1, name: 'Ali Yılmaz', department: 'Yazılım', title: 'Backend Developer' },
      { id: 2, name: 'Ayşe Demir', department: 'Tasarım', title: 'UI/UX Designer' }
    ],
    recentLeaves: [
      { id: 1, name: 'Ali Yılmaz', type: 'Yıllık İzin', days: 5, status: 'Beklemede' },
      { id: 2, name: 'Ayşe Demir', type: 'Mazeret İzni', days: 1, status: 'Onaylandı' },
      { id: 3, name: 'Mehmet Kaya', type: 'Sağlık Raporu', days: 3, status: 'Reddedildi' },
    ]
  }),
  
  getters: {
    totalEmployees: (state) => state.employees.length,
    pendingLeavesCount: (state) => state.recentLeaves.filter(l => l.status === 'Beklemede').length
  },
  
  actions: {
    // İleride buraya axios.post('/api/employees', newEmployee) gelecek
    addEmployee(newEmployee) {
      this.employees.push({
        id: this.employees.length + 1,
        ...newEmployee
      });
    },
    updateLeaveStatus(leaveId, newStatus) {
      const leave = this.recentLeaves.find(l => l.id === leaveId);
      if (leave) {
        leave.status = newStatus;
      }
    }
  }
});