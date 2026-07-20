import { defineStore } from 'pinia';
import api from '@/services/api';

export const useIzinStore = defineStore('izin', {
  state: () => ({
    izinler: [],
    loading: false
  }),
  actions: {
    async fetchIzinler() {
      this.loading = true;
      try {
        const response = await api.get('/Izin');
        this.izinler = response.data;
      } catch (error) {
        console.error('İzinler yüklenemedi:', error);
      } finally {
        this.loading = false;
      }
    },
    async addIzin(yeniIzin) {
      try {
        const response = await api.post('/Izin', yeniIzin);
        this.izinler.unshift(response.data);
      } catch (error) {
        console.error('İzin ekleme hatası:', error);
        throw error;
      }
    },
    async updateIzinDurum(id, durumData) {
      try {
        const response = await api.put(`/Izin/${id}`, durumData);
        const index = this.izinler.findIndex(i => i.id === id);
        if (index !== -1) this.izinler[index] = response.data;
      } catch (error) {
        console.error('İzin güncelleme hatası:', error);
        throw error;
      }
    }
  }
});