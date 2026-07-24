import { defineStore } from 'pinia';
import api from '@/services/api';

export const usePersonnelStore = defineStore('personnel', {
  state: () => ({
    personnels: [],
    loading: false,
    error: null
  }),

  actions: {
    // Tüm personelleri getir (GET: /api/Personnel)
    async fetchPersonnels() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/Personnel');
        this.personnels = response.data; // Backend'den gelen listeyi state'e kaydet
      } catch (err) {
        this.error = 'Personeller yüklenirken bir hata oluştu.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    // Yeni personel ekle (POST: /api/Personnel)
    async addPersonnel(newPersonnel) {
      try {
        const response = await api.post('/Personnel', newPersonnel);
        this.personnels.unshift(response.data); // Başarılıysa tabloya (en başa) ekle
      } catch (err) {
        console.error('Ekleme hatası:', err);
        throw err;
      }
    },

    // Personel güncelle (PUT: /api/Personnel/{id})
    async updatePersonnel(id, recentData) {
      try {
        const response = await api.put(`/Personnel/${id}`, recentData);
        const index = this.personnels.findIndex(p => p.id === id);
        if (index !== -1) {
          this.personnels[index] = response.data;
        }
      } catch (err) {
        console.error('Güncelleme hatası:', err);
        throw err;
      }
    },

    // Personel sil (DELETE: /api/Personnel/{id})
    async deletePersonnel(id) {
      try {
        await api.delete(`/Personnel/${id}`);
        this.personnels = this.personnels.filter(p => p.id !== id);
      } catch (err) {
        console.error('Silme hatası:', err);
        throw err;
      }
    }
  }
});