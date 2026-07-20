import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  actions: {
    async login(kullaniciAdi, sifre) {
      this.loading = true;
      this.error = null;
      try {
        // Backend'in beklediği DTO formatına göre (AuthDto.cs)
        const response = await api.post('/Auth/login', { 
          email: kullaniciAdi, 
          password: sifre 
        });
        
        // Backend'den gelen token'ı tarayıcıya kaydet
        localStorage.setItem('token', response.data.token);
        this.user = response.data.user;
        
        return true; // Giriş başarılı
      } catch (error) {
        this.error = 'E-posta veya şifre hatalı.';
        return false; // Giriş başarısız
      } finally {
        this.loading = false;
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.user = null;
    }
  }
});