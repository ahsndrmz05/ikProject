<template>
  <div class="flex flex-column gap-4">
    
    <!-- Üst Bilgi ve Arama -->
    <header class="flex justify-content-between align-items-center mb-2">
      <h1 class="text-3xl font-bold text-white m-0">Sistem Özeti</h1>
      <span class="p-input-icon-left">
        <i class="pi pi-search text-accent-purple" />
        <InputText v-model="searchQuery" placeholder="Personel veya Duyuru Ara..." class="bg-gray-900 border-gray-800 text-white border-round-2xl w-20rem focus:border-accent-purple" />
      </span>
    </header>

    <!-- İstatistik Kartları -->
    <div class="grid">
      <!-- Aktif Personel Kartı -->
      <div class="col-12 md:col-4">
        <Card class="h-full bg-gray-900 border-none border-round-3xl shadow-4 relative overflow-hidden">
          <template #content>
            <div class="flex justify-content-between align-items-center z-1 relative">
              <div>
                <span class="block text-400 font-medium mb-2 text-sm uppercase tracking-widest">Aktif Personel</span>
                <div class="text-5xl font-bold text-white">124</div>
              </div>
              <div class="w-4rem h-4rem bg-purple-900 border-circle flex align-items-center justify-content-center" style="opacity: 0.7">
                <i class="pi pi-users text-2xl text-purple-300"></i>
              </div>
            </div>
            <!-- Arka plan mor neon efekti -->
            <div class="absolute bg-accent-purple border-circle" style="width: 150px; height: 150px; top: -50px; right: -50px; filter: blur(60px); opacity: 0.2;"></div>
          </template>
        </Card>
      </div>

      <!-- Bekleyen İzinler Kartı -->
      <div class="col-12 md:col-4">
        <Card class="h-full bg-gray-900 border-none border-round-3xl shadow-4 relative overflow-hidden">
          <template #content>
            <div class="flex justify-content-between align-items-center z-1 relative">
              <div>
                <span class="block text-400 font-medium mb-2 text-sm uppercase tracking-widest">Bekleyen İzinler</span>
                <div class="text-5xl font-bold text-white">8</div>
              </div>
              <div class="w-4rem h-4rem bg-orange-900 border-circle flex align-items-center justify-content-center" style="opacity: 0.7">
                <i class="pi pi-clock text-2xl text-orange-300"></i>
              </div>
            </div>
            <!-- Arka plan turuncu neon efekti -->
            <div class="absolute bg-orange-500 border-circle" style="width: 150px; height: 150px; top: -50px; right: -50px; filter: blur(60px); opacity: 0.15;"></div>
          </template>
        </Card>
      </div>

      <!-- Yeni Personel Ekleme Kartı (Hızlı Aksiyon) -->
      <div class="col-12 md:col-4">
        <Card class="h-full border-1 border-accent-purple shadow-6 cursor-pointer hover:shadow-8 transition-all" style="background: linear-gradient(135deg, #0a0a0a, #3b1c6d); border-radius: 1.5rem;">
          <template #content>
            <div class="flex flex-column align-items-center justify-content-center h-full text-center py-2">
              <i class="pi pi-plus-circle text-4xl text-white mb-3"></i>
              <h3 class="mt-0 mb-0 text-white font-bold text-xl">Yeni Personel Kaydı</h3>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Alt Bölüm: Duyurular ve İzinler Tablosu -->
    <div class="grid mt-2">
      
      <!-- Şirket Duyuruları -->
      <div class="col-12 md:col-5">
        <Card class="h-full bg-gray-900 border-none border-round-3xl">
          <template #title>
            <div class="flex justify-content-between align-items-center">
              <span class="text-white font-bold">Güncel Duyurular</span>
              <Button icon="pi pi-plus" class="p-button-rounded p-button-text p-button-help" />
            </div>
          </template>
          <template #content>
            <ul class="list-none p-0 m-0 flex flex-column gap-4">
              <li v-for="duyuru in duyurular" :key="duyuru.id" class="p-3 border-round-2xl surface-ground border-1 border-gray-800 border-left-3 hover:border-left-purple-500 transition-colors" style="border-left-color: #a855f7 !important;">
                <div class="flex justify-content-between align-items-start mb-2">
                  <span class="font-bold text-white">{{ duyuru.baslik }}</span>
                  <span class="text-xs text-color-secondary">{{ duyuru.tarih }}</span>
                </div>
                <p class="m-0 text-sm text-400 line-height-3">{{ duyuru.icerik }}</p>
              </li>
            </ul>
          </template>
        </Card>
      </div>

      <!-- İzin Talepleri -->
      <div class="col-12 md:col-7">
        <Card class="h-full bg-gray-900 border-none border-round-3xl">
          <template #title>
            <span class="text-white font-bold">Son İzin Talepleri</span>
          </template>
          <template #content>
            <DataTable :value="izinler" responsiveLayout="scroll" class="p-datatable-sm" :pt="{
              root: { class: 'border-round-2xl overflow-hidden border-1 border-gray-800' },
              headerRow: { class: 'bg-black' }
            }">
              <Column field="personel" header="Personel" class="text-white"></Column>
              <Column field="tur" header="İzin Türü" class="text-400"></Column>
              <Column field="gun" header="Gün" class="text-400"></Column>
              <Column field="durum" header="Durum">
                <template #body="slotProps">
                  <span :class="['px-3 py-1 border-round-3xl text-xs font-bold uppercase tracking-wide', 
                    slotProps.data.durum === 'Onaylandı' ? 'bg-green-900 text-green-400' : 
                    slotProps.data.durum === 'Bekliyor' ? 'bg-orange-900 text-orange-400' : 'bg-red-900 text-red-400']">
                    {{ slotProps.data.durum }}
                  </span>
                </template>
              </Column>
              <Column header="İşlem" :exportable="false" style="min-width:6rem">
                <template #body="slotProps">
                  <div class="flex gap-2" v-if="slotProps.data.durum === 'Bekliyor'">
                    <Button icon="pi pi-check" class="p-button-rounded p-button-success p-button-outlined w-2rem h-2rem p-0" />
                    <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-outlined w-2rem h-2rem p-0" />
                  </div>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const searchQuery = ref('');

// Mock Duyurular (DuyuruController Karşılığı)
const duyurular = ref([
  { id: 1, baslik: 'Sistem Bakımı', icerik: 'Bu hafta sonu IK sistemlerinde planlı bakım çalışması yapılacaktır.', tarih: '20 Tem 2026' },
  { id: 2, baslik: 'Yeni Şirket Politikası', icerik: 'Uzaktan çalışma kuralları güncellenmiştir. Lütfen el kitabını okuyunuz.', tarih: '18 Tem 2026' },
]);

// Mock İzinler (IzinController Karşılığı)
const izinler = ref([
  { id: 1, personel: 'Ayşe Demir', tur: 'Yıllık İzin', gun: 5, durum: 'Bekliyor' },
  { id: 2, personel: 'Mehmet Kaya', tur: 'Mazeret İzni', gun: 1, durum: 'Onaylandı' },
  { id: 3, personel: 'Canan Öz', tur: 'Sağlık Raporu', gun: 3, durum: 'Bekliyor' },
  { id: 4, personel: 'Ali Yılmaz', tur: 'Yıllık İzin', gun: 10, durum: 'Reddedildi' },
]);
</script>

<style scoped>
/* PrimeVue Tablo Özelleştirmeleri (Koyu Tema) */
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #050505 !important;
  color: #a855f7 !important; /* Accent Purple */
  border-bottom: 1px solid #1f1f1f;
  padding: 1rem;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  background-color: #0a0a0a !important;
  transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #141414 !important;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border-bottom: 1px solid #1f1f1f;
  padding: 1rem;
}

.surface-ground {
  background-color: #141414 !important;
}
</style>