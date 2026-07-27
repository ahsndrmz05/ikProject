<template>
  <div class="flex flex-column gap-4">
    <header class="flex justify-content-between align-items-center mb-2">
      <div>
        <h1 class="text-3xl font-bold text-white m-0">Duyurular</h1>
        <span class="text-400 text-sm mt-1 block">Şirket içi duyuruları ve haberleri takip edin.</span>
      </div>
      <!-- Sadece Yöneticiler Duyuru Ekleyebilir -->
      <Button 
        v-if="authStore.userRole === 'Admin' || authStore.userRole === 'IkYonetici'" 
        label="Yeni Duyuru" 
        icon="pi pi-plus" 
        class="p-button-help border-round-xl font-bold shadow-4" 
        @click="openNewDialog" 
      />
    </header>

    <div class="grid">
      <div v-for="announcement in announceStore.announcements" :key="announcement.id" class="col-12 md:col-6">
        <Card class="bg-gray-900 border-none border-round-3xl shadow-4 h-full">
          <template #title>
            <div class="text-white font-bold text-xl">{{ announcement.baslik }}</div>
          </template>
          <template #content>
            <p class="text-300 m-0 line-height-3">{{ announcement.icerik }}</p>
          </template>
          <template #footer v-if="authStore.userRole === 'Admin' || authStore.userRole === 'IkYonetici'">
            <div class="flex justify-content-end gap-2 pt-2">
              <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="deleteAnnounce(announcement.id)" />
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Yeni Duyuru Dialog -->
    <Dialog v-model:visible="dialogGoster" header="Yeni Duyuru Yayınla" :modal="true" class="p-fluid" :style="{ width: '450px' }" :pt="{
      root: { class: 'border-round-3xl border-1 border-accent-purple bg-gray-900 overflow-hidden' },
      header: { class: 'bg-black text-white' },
      content: { class: 'bg-gray-900 text-white pt-4' },
      footer: { class: 'bg-black' }
    }">
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Başlık</label>
          <InputText v-model="seciliDuyuru.baslik" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" style="color: #fff !important;" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">İçerik</label>
          <InputText v-model="seciliDuyuru.icerik" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" style="color: #fff !important;" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-content-end gap-2 mt-3">
          <Button label="İptal" icon="pi pi-times" class="p-button-text p-button-secondary border-round-xl" @click="dialogGoster = false"/>
          <Button label="Yayınla" icon="pi pi-check" class="p-button-help border-round-xl" @click="saveAnnounce" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAnnounceStore } from '@/stores/announceStore';
import { useAuthStore } from '@/stores/authStore';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

const announceStore = useAnnounceStore();
const authStore = useAuthStore();

onMounted(() => {
  announceStore.fetchAnnouncements();
});

const dialogGoster = ref(false);
const seciliDuyuru = ref({});

const openNewDialog = () => {
  seciliDuyuru.value = { baslik: '', icerik: '' };
  dialogGoster.value = true;
};

const saveAnnounce = async () => {
  if (seciliDuyuru.value.baslik?.trim()) {
    await announceStore.addAnnouncement(seciliDuyuru.value);
    dialogGoster.value = false;
  }
};

const deleteAnnounce = async (id) => {
  await announceStore.deleteAnnouncement(id);
};
</script>