import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAnnounceStore = defineStore('announce', {
  state: () => ({
    announcements: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchAnnouncements() {
      this.loading = true;
      try {
        const response = await api.get('/Announcement/getAnnouncements');
        this.announcements = response.data;
      } catch (err) {
        console.error('Duyurular yüklenirken hata:', err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async addAnnouncement(announcementData) {
      try {
        const response = await api.post('/Announcement/createAnnouncement', announcementData);
        this.announcements.push(response.data);
      } catch (err) {
        console.error('Duyuru ekleme hatası:', err);
      }
    },
    async updateAnnouncement(id, announcementData) {
      try {
        const response = await api.put(`/Announcement/updateAnnouncement/${id}`, announcementData);
        const index = this.announcements.findIndex(a => a.id === id);
        if (index !== -1) {
          this.announcements[index] = response.data;
        }
      } catch (err) {
        console.error('Duyuru güncelleme hatası:', err);
      }
    },
    async deleteAnnouncement(id) {
      try {
        await api.delete(`/Announcement/deleteAnnouncement/${id}`);
        this.announcements = this.announcements.filter(a => a.id !== id);
      } catch (err) {
        console.error('Duyuru silme hatası:', err);
      }
    }
  }
});