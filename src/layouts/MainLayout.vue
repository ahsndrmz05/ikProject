<template>
  <div class="flex h-screen bg-black overflow-hidden">
    <!-- Sol Sidebar -->
    <aside class="w-18rem bg-gray-900 border-right-1 border-gray-800 flex flex-column justify-content-between p-4">
      <div class="flex flex-column gap-5">
        <!-- Logo / Başlık -->
        <div class="flex align-items-center gap-3 px-2">
          <div class="w-2.5rem h-2.5rem bg-purple-600 border-round-xl flex align-items-center justify-content-center shadow-4">
            <i class="pi pi-users text-white text-xl"></i>
          </div>
          <span class="text-xl font-bold text-white tracking-wide">İK Platform</span>
        </div>

        <!-- Navigasyon Menüsü (Rol Bazlı) -->
        <nav class="flex flex-column gap-2">
          <router-link to="/" class="flex align-items-center gap-3 p-3 text-300 font-medium border-round-xl transition-colors hover:bg-gray-800 hover:text-white text-decoration-none" active-class="bg-purple-600 text-white shadow-4 font-bold">
            <i class="pi pi-home text-lg"></i>
            <span>Anasayfa</span>
          </router-link>

          <!-- Sadece IK Yöneticisi Görebilir -->
          <router-link v-if="authStore.userRole === 'Admin' || authStore.userRole === 'IkYonetici'" to="/personnel" class="flex align-items-center gap-3 p-3 text-300 font-medium border-round-xl transition-colors hover:bg-gray-800 hover:text-white text-decoration-none" active-class="bg-purple-600 text-white shadow-4 font-bold">
            <i class="pi pi-id-card text-lg"></i>
            <span>Personel Yönetimi</span>
          </router-link>

          <router-link to="/leaves" class="flex align-items-center gap-3 p-3 text-300 font-medium border-round-xl transition-colors hover:bg-gray-800 hover:text-white text-decoration-none" active-class="bg-purple-600 text-white shadow-4 font-bold">
            <i class="pi pi-calendar text-lg"></i>
            <span>İzin Talepleri</span>
          </router-link>

          <router-link to="/announcements" class="flex align-items-center gap-3 p-3 text-300 font-medium border-round-xl transition-colors hover:bg-gray-800 hover:text-white text-decoration-none" active-class="bg-purple-600 text-white shadow-4 font-bold">
            <i class="pi pi-bell text-lg"></i>
            <span>Duyurular</span>
          </router-link>
        </nav>
      </div>

      <!-- Alt Profil Alanı (Dinamik) -->
      <div class="flex align-items-center justify-content-between p-3 bg-black border-round-2xl border-1 border-gray-800">
        <div class="flex align-items-center gap-3 overflow-hidden">
          <div class="w-2.5rem h-2.5rem bg-gray-800 border-circle flex align-items-center justify-content-center text-purple-400 font-bold shrink-0">
            {{ userInitial }}
          </div>
          <div class="flex flex-column overflow-hidden">
            <span class="text-white font-medium text-sm text-overflow-ellipsis white-space-nowrap overflow-hidden">{{ authStore.userEmail || 'Kullanıcı' }}</span>
            <span class="text-xs text-purple-400 font-semibold">{{ authStore.userRole || 'Rol Yok' }}</span>
          </div>
        </div>
        <Button icon="pi pi-sign-out" class="p-button-rounded p-button-text p-button-secondary text-400 hover:text-white" @click="handleLogout" title="Çıkış Yap" />
      </div>
    </aside>

    <!-- Sağ Ana İçerik Alanı -->
    <main class="flex-1 flex flex-column overflow-y-auto bg-black p-5">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Button from 'primevue/button';

const router = useRouter();
const authStore = useAuthStore();

const userInitial = computed(() => {
  return authStore.userEmail ? authStore.userEmail.charAt(0).toUpperCase() : 'K';
});

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'login' });
};
</script>