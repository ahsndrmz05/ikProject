import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),
  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/Auth/login', { 
          email: email, 
          password: password 
        });
        
        // Backend'den gelen yanıtın formatına göre token'ı güvenle alıyoruz
        const token = response.data.token || response.data; 
        
        if (token) {
          this.token = token;
          localStorage.setItem('token', token);
          return true;
        } else {
          this.error = 'Geçersiz sunucu yanıtı.';
          return false;
        }
      } catch (err) {
        console.error('Giriş hatası:', err);
        this.error = err.response?.data?.message || 'E-posta veya şifre hatalı.';
        return false;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = null;
      localStorage.removeItem('token');
    }
  }
});