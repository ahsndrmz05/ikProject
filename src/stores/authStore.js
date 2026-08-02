import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    userRole: localStorage.getItem('userRole') || null,
    userEmail: localStorage.getItem('userEmail') || null,
    isFirstLogin: localStorage.getItem('isFirstLogin') === 'true',
    loading: false,
    error: null
  }),
  actions: {
    setUser(data) {
      if (data && data.token) {
        this.token = data.token;
        this.userRole = data.user?.rol || 'Calisan';
        this.userEmail = data.user?.email || '';
        this.isFirstLogin = data.user?.isFirstLogin || false;

        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', this.userRole);
        localStorage.setItem('userEmail', this.userEmail);
        localStorage.setItem('isFirstLogin', this.isFirstLogin);
      }
    },
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/Auth/login', { email, password });
        this.setUser(response.data);
        return response.data;
      } catch (err) {
        if (err.response?.status === 401) {
          this.error = typeof err.response?.data === 'string' ? err.response.data : 'Bu hesap aktif değil veya bilgiler hatalı.';
        } else {
          this.error = err.response?.data || 'Giriş yapılamadı.';
        }
        throw err;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = null;
      this.userRole = null;
      this.userEmail = null;
      this.isFirstLogin = false;
      localStorage.clear();
    }
  }
});