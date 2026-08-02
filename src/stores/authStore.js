import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    userRole: localStorage.getItem('userRole') || null,
    userEmail: localStorage.getItem('userEmail') || null,
    isFirstLogin: false,
    loading: false,
    error: null
  }),
  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/Auth/login', { email, password });
        const { token, user } = response.data;
        
        if (token) {
          this.token = token;
          this.userRole = user.rol;
          this.userEmail = user.email;
          this.isFirstLogin = user.isFirstLogin || false;

          localStorage.setItem('token', token);
          localStorage.setItem('userRole', user.rol);
          localStorage.setItem('userEmail', user.email);
          return { success: true, isFirstLogin: this.isFirstLogin };
        }
        return { success: false };
      } catch (err) {
        if (err.response?.status === 401) {
          this.error = typeof err.response?.data === 'string' ? err.response.data : 'Bu hesap aktif değil veya bilgiler hatalı.';
        } else {
          this.error = err.response?.data || 'Giriş yapılamadı.';
        }
        return { success: false };
      } finally {
        this.loading = false;
      }
    }
  }
});