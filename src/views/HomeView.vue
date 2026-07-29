<template>
  <div class="flex flex-column gap-5">
    <!-- Üst Karşılama Alanı -->
    <div class="flex justify-content-between align-items-center bg-gray-900 p-4 border-round-3xl shadow-4">
      <div>
        <h1 class="text-3xl font-bold text-white m-0">Hoş Geldiniz, <span class="text-purple-400">{{ authStore.userEmail }}</span></h1>
        <span class="text-400 text-sm mt-1 block">İK yönetim platformu kontrol paneline genel bakış.</span>
      </div>
      <div class="bg-black px-4 py-2 border-round-2xl border-1 border-gray-800 text-purple-400 font-bold text-sm">
        Rol: {{ authStore.userRole }}
      </div>
    </div>

    <!-- İstatistik Kartları (Dinamik) -->
    <div class="grid">
      <div class="col-12 md:col-6 lg:col-4">
        <div class="bg-gray-900 p-4 border-round-3xl shadow-4 flex align-items-center gap-4 border-1 border-gray-800">
          <div class="w-3.5rem h-3.5rem bg-purple-900 border-round-2xl flex align-items-center justify-content-center text-purple-400 text-xl font-bold">
            <i class="pi pi-users"></i>
          </div>
          <div class="flex flex-column">
            <span class="text-400 text-sm font-medium">Toplam Personel</span>
            <span class="text-2xl font-bold text-white mt-1">{{ personnelStore.personnels.length }}</span>
          </div>
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-4">
        <div class="bg-gray-900 p-4 border-round-3xl shadow-4 flex align-items-center gap-4 border-1 border-gray-800">
          <div class="w-3.5rem h-3.5rem bg-orange-900 border-round-2xl flex align-items-center justify-content-center text-orange-400 text-xl font-bold">
            <i class="pi pi-calendar"></i>
          </div>
          <div class="flex flex-column">
            <span class="text-400 text-sm font-medium">İzin Talepleri</span>
            <span class="text-2xl font-bold text-white mt-1">{{ leaveStore.leaves.length }}</span>
          </div>
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-4">
        <div class="bg-gray-900 p-4 border-round-3xl shadow-4 flex align-items-center gap-4 border-1 border-gray-800">
          <div class="w-3.5rem h-3.5rem bg-green-900 border-round-2xl flex align-items-center justify-content-center text-green-400 text-xl font-bold">
            <i class="pi pi-bell"></i>
          </div>
          <div class="flex flex-column">
            <span class="text-400 text-sm font-medium">Aktif Duyurular</span>
            <span class="text-2xl font-bold text-white mt-1">{{ announceStore.announcements.length }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { usePersonnelStore } from '@/stores/personnelStore';
import { useLeaveStore } from '@/stores/leaveStore';
import { useAnnounceStore } from '@/stores/announceStore';

const authStore = useAuthStore();
const personnelStore = usePersonnelStore();
const leaveStore = useLeaveStore();
const announceStore = useAnnounceStore();

onMounted(() => {
  personnelStore.fetchPersonnels();
  leaveStore.fetchLeaves(authStore.userRole);
  announceStore.fetchAnnouncements();
});
</script>