import { defineStore } from 'pinia';
import api from '@/services/api';

export const usePersonelStore = defineStore('personel', {
  state: () => ({
    personeller: [],
    loading: false,
    error: null
  }),

  actions: {
    // Tüm personelleri getir (GET: /api/Personel)
    async fetchPersoneller() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/Personel');
        this.personeller = response.data; // Backend'den gelen listeyi state'e kaydet
      } catch (err) {
        this.error = 'Personeller yüklenirken bir hata oluştu.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    // Yeni personel ekle (POST: /api/Personel)
    async addPersonel(yeniPersonel) {
      try {
        const response = await api.post('/Personel', yeniPersonel);
        this.personeller.unshift(response.data); // Başarılıysa tabloya (en başa) ekle
      } catch (err) {
        console.error('Ekleme hatası:', err);
        throw err;
      }
    },

    // Personel güncelle (PUT: /api/Personel/{id})
    async updatePersonel(id, guncelData) {
      try {
        const response = await api.put(`/Personel/${id}`, guncelData);
        const index = this.personeller.findIndex(p => p.id === id);
        if (index !== -1) {
          this.personeller[index] = response.data;
        }
      } catch (err) {
        console.error('Güncelleme hatası:', err);
        throw err;
      }
    },

    // Personel sil (DELETE: /api/Personel/{id})
    async deletePersonel(id) {
      try {
        await api.delete(`/Personel/${id}`);
        this.personeller = this.personeller.filter(p => p.id !== id);
      } catch (err) {
        console.error('Silme hatası:', err);
        throw err;
      }
    }
  }
});