import axios from 'axios';

// Backend (C# .NET) çalıştığında genellikle localhost:5001 veya 7000 portlarını kullanır.
// Arkadaşın backend'i ayağa kaldırdığında buradaki URL'yi güncelleyeceksin.
const api = axios.create({
  baseURL: 'https://localhost:5001/api', 
  timeout: 10000, // 10 saniyeden uzun sürerse zaman aşımı hatası ver
});

// REQUEST INTERCEPTOR: Backend'e giden her isteğin arasına girer
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  
  // Eğer kullanıcı giriş yapmışsa (token varsa), bunu güvenli bir şekilde isteğe ekle
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// RESPONSE INTERCEPTOR: Backend'den dönen cevapların arasına girer
api.interceptors.response.use(response => {
  return response;
}, error => {
  // Eğer backend 401 (Yetkisiz/Token Süresi Dolmuş) hatası dönerse, kullanıcıyı otomatik logine at
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default api;