import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    userRole: localStorage.getItem('userRole') || null,
    userEmail: localStorage.getItem('userEmail') || null,
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
        
        const token = response.data.token;
        const user = response.data.user;
        
        if (token) {
          this.token = token;
          this.userRole = user?.rol || 'Calisan';
          this.userEmail = user?.email || email;

          localStorage.setItem('token', token);
          localStorage.setItem('userRole', this.userRole);
          localStorage.setItem('userEmail', this.userEmail);
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
      this.userRole = null;
      this.userEmail = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
    }
  }
});