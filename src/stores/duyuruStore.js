import { defineStore } from 'pinia';
import api from '@/services/api';

export const useDuyuruStore = defineStore('duyuru', {
  state: () => ({
    duyurular: [],
    loading: false
  }),
  actions: {
    async fetchDuyurular() {
      this.loading = true;
      try {
        const response = await api.get('/Duyuru');
        this.duyurular = response.data;
      } catch (error) {
        console.error('Duyurular yüklenemedi:', error);
      } finally {
        this.loading = false;
      }
    },
    async addDuyuru(yeniDuyuru) {
      try {
        const response = await api.post('/Duyuru', yeniDuyuru);
        this.duyurular.unshift(response.data);
      } catch (error) {
        console.error('Duyuru ekleme hatası:', error);
        throw error;
      }
    },
    async updateDuyuru(id, guncelData) {
      try {
        const response = await api.put(`/Duyuru/${id}`, guncelData);
        const index = this.duyurular.findIndex(d => d.id === id);
        if (index !== -1) this.duyurular[index] = response.data;
      } catch (error) {
        console.error('Duyuru güncelleme hatası:', error);
        throw error;
      }
    },
    async deleteDuyuru(id) {
      try {
        await api.delete(`/Duyuru/${id}`);
        this.duyurular = this.duyurular.filter(d => d.id !== id);
      } catch (error) {
        console.error('Duyuru silme hatası:', error);
        throw error;
      }
    }
  }
});