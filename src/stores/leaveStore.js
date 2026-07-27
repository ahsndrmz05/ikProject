import { defineStore } from 'pinia';
import api from '@/services/api';

export const useLeaveStore = defineStore('leave', {
  state: () => ({
    leaves: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchLeaves(userRole) {
      this.loading = true;
      try {
        // Eğer kullanıcı Çalışan ise sadece kendi izinlerini, yönetici ise tüm izinleri getirir
        const endpoint = userRole === 'Calisan' ? '/Leave/getMyLeaves' : '/Leave/getLeaves';
        const response = await api.get(endpoint);
        this.leaves = response.data;
      } catch (err) {
        console.error('İzinler yüklenirken hata:', err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async addLeave(leaveData) {
      try {
        const response = await api.post('/Leave/createLeave', leaveData);
        this.leaves.push(response.data);
      } catch (err) {
        console.error('İzin ekleme hatası:', err);
        throw err;
      }
    },
    async updateLeaveStatus(id, statusType) {
      try {
        let endpoint = '';
        if (statusType === 'approve') {
          endpoint = `/Leave/approveLeave/${id}`;
        } else if (statusType === 'reject') {
          endpoint = `/Leave/rejectLeave/${id}`;
        }
        
        const response = await api.put(endpoint);
        const index = this.leaves.findIndex(l => l.id === id);
        if (index !== -1) {
          this.leaves[index] = response.data;
        }
      } catch (err) {
        console.error('İzin durum güncelleme hatası:', err);
        throw err;
      }
    }
  }
});