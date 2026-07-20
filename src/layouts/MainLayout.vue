<template>
  <div class="flex min-h-screen bg-black font-sans">
    
    <!-- Sabit Sol Sidebar -->
    <aside class="w-18rem surface-card m-3 p-4 border-round-3xl border-1 border-accent-purple flex flex-column justify-content-between shadow-6">
      <div>
        <div class="flex align-items-center gap-3 mb-6 cursor-pointer" @click="router.push('/')">
          <i class="pi pi-bolt text-4xl text-accent-purple"></i>
          <h2 class="text-2xl m-0 font-bold text-white tracking-wider">SyncHR</h2>
        </div>
        
        <!-- Menü Elemanları (Router Linkleri) -->
        <div class="flex flex-column gap-3">
          <router-link to="/" custom v-slot="{ navigate, isActive }">
            <Button label="Dashboard" icon="pi pi-home" @click="navigate" 
              :class="['p-button-text p-button-plain text-left justify-content-start w-full border-round-xl transition-colors', isActive ? 'bg-purple-900 text-white' : 'text-400 hover:text-accent-purple']" />
          </router-link>
          
          <router-link to="/personel" custom v-slot="{ navigate, isActive }">
            <Button label="Personel Yönetimi" icon="pi pi-users" @click="navigate" 
              :class="['p-button-text p-button-plain text-left justify-content-start w-full border-round-xl transition-colors', isActive ? 'bg-purple-900 text-white' : 'text-400 hover:text-accent-purple']" />
          </router-link>

          <router-link to="/izinler" custom v-slot="{ navigate, isActive }">
            <Button label="İzin Talepleri" icon="pi pi-calendar" @click="navigate" 
              :class="['p-button-text p-button-plain text-left justify-content-start w-full border-round-xl transition-colors', isActive ? 'bg-purple-900 text-white' : 'text-400 hover:text-accent-purple']" />
          </router-link>

          <router-link to="/duyurular" custom v-slot="{ navigate, isActive }">
            <Button label="Şirket Duyuruları" icon="pi pi-megaphone" @click="navigate" 
              :class="['p-button-text p-button-plain text-left justify-content-start w-full border-round-xl transition-colors', isActive ? 'bg-purple-900 text-white' : 'text-400 hover:text-accent-purple']" />
          </router-link>
        </div>
      </div>

      <!-- Kullanıcı Profili ve Çıkış -->
      <div class="flex flex-column gap-2">
        <div class="flex align-items-center gap-3 p-3 bg-gray-900 border-round-2xl border-1 border-gray-800">
          <div class="w-3rem h-3rem bg-accent-purple border-circle flex align-items-center justify-content-center text-white font-bold text-xl shadow-4">
            A
          </div>
          <div class="flex flex-column">
            <span class="font-bold text-white">Ahmet Yılmaz</span>
            <span class="text-sm text-color-secondary">İK Yöneticisi</span>
          </div>
        </div>
        <Button label="Çıkış Yap" icon="pi pi-sign-out" class="p-button-text p-button-danger w-full border-round-xl" @click="handleLogout" />
      </div>
    </aside>

    <!-- Dinamik İçerik Alanı (Sayfalar Buraya Gelecek) -->
    <main class="flex-1 p-4 overflow-y-auto">
      <router-view />
    </main>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Button from 'primevue/button';

const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem('token'); // Token'ı sil
  router.push('/login'); // Logine yönlendir
};
</script>

<style scoped>
.surface-card { background-color: #0a0a0a !important; }
</style>