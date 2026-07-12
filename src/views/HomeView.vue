<template>
  <div class="p-4 min-h-screen flex flex-column gap-4 bg-black">
    
    <!-- Üst Bar (Header) -->
    <header class="flex justify-content-between align-items-center p-4 surface-card border-round-2xl border-1 border-accent-purple">
      <div class="flex align-items-center gap-3">
        <i class="pi pi-building text-3xl text-accent-purple"></i>
        <h1 class="text-2xl m-0 font-bold tracking-wide text-white">SyncHR Yönetim</h1>
      </div>
      <div class="flex align-items-center gap-3">
        <span class="text-color-secondary">Hoş geldin, Admin</span>
        <Button icon="pi pi-user" class="p-button-rounded p-button-help p-button-outlined border-circle w-3rem h-3rem" />
      </div>
    </header>

    <!-- Özet Kartları (Grid) -->
    <div class="grid">
      <!-- Kart 1: Toplam Çalışan -->
      <div class="col-12 md:col-4">
        <Card class="h-full relative overflow-hidden">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <span class="block text-500 font-medium mb-3">Toplam Çalışan</span>
                <!-- Pinia Getter: store.totalEmployees -->
                <div class="text-4xl font-bold text-accent-purple">{{ store.totalEmployees }}</div>
              </div>
              <div class="flex align-items-center justify-content-center bg-purple-900 border-round-xl w-4rem h-4rem" style="opacity: 0.8">
                <i class="pi pi-users text-2xl text-purple-200"></i>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Kart 2: Bekleyen İzinler -->
      <div class="col-12 md:col-4">
        <Card class="h-full">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <span class="block text-500 font-medium mb-3">Onay Bekleyen İzinler</span>
                <!-- Pinia Getter: store.pendingLeavesCount -->
                <div class="text-4xl font-bold text-orange-400">{{ store.pendingLeavesCount }}</div>
              </div>
              <div class="flex align-items-center justify-content-center bg-orange-900 border-round-xl w-4rem h-4rem" style="opacity: 0.8">
                <i class="pi pi-calendar text-2xl text-orange-200"></i>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Kart 3: Hızlı Aksiyon (Kayıt Oluştur) -->
      <div class="col-12 md:col-4">
        <Card class="h-full border-1 border-accent-purple" style="background: linear-gradient(145deg, #1a1a1a, #2d1b4e);">
          <template #content>
            <div class="flex flex-column align-items-center justify-content-center h-full text-center">
              <h3 class="mt-0 mb-3 text-white">Yeni Personel İşe Alımı</h3>
              <Button label="Kayıt Oluştur" icon="pi pi-plus" class="p-button-rounded p-button-help w-full border-round-3xl font-bold" @click="showModal" />
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Son Hareketler Tablosu (Pinia Entegreli) -->
    <div class="mt-4">
      <Card>
        <template #title>Son İzin Talepleri</template>
        <template #content>
          <!-- value olarak store.recentLeaves veriliyor -->
          <DataTable :value="store.recentLeaves" responsiveLayout="scroll" class="p-datatable-sm" :pt="{
            root: { class: 'border-round-xl overflow-hidden' },
            headerRow: { class: 'bg-black' }
          }">
            <Column field="name" header="Personel Adı"></Column>
            <Column field="type" header="İzin Türü"></Column>
            <Column field="days" header="Süre (Gün)"></Column>
            
            <!-- Durum Kolonu (Renkler Dinamik) -->
            <Column field="status" header="Durum">
              <template #body="slotProps">
                <span :class="['px-3 py-1 border-round-2xl text-sm font-bold', 
                  slotProps.data.status === 'Onaylandı' ? 'bg-green-900 text-green-300' : 
                  slotProps.data.status === 'Beklemede' ? 'bg-orange-900 text-orange-300' : 'bg-red-900 text-red-300']">
                  {{ slotProps.data.status }}
                </span>
              </template>
            </Column>
            
            <!-- İşlemler (Onay/Red) Kolonu -->
            <Column header="İşlemler" :exportable="false" style="min-width:8rem">
              <template #body="slotProps">
                <div class="flex gap-2" v-if="slotProps.data.status === 'Beklemede'">
                  <Button icon="pi pi-check" rounded outlined severity="success" aria-label="Onayla" @click="handleLeave(slotProps.data.id, 'Onaylandı')" />
                  <Button icon="pi pi-times" rounded outlined severity="danger" aria-label="Reddet" @click="handleLeave(slotProps.data.id, 'Reddedildi')" />
                </div>
              </template>
            </Column>

          </DataTable>
        </template>
      </Card>
    </div>

    <!-- Personel Ekleme Modalı Component'i -->
    <NewEmployeeDialog ref="employeeDialogRef" />

  </div>
</template>

<script setup>
import { ref } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

// Pinia ve Component Importları
import { useEmployeeStore } from '@/stores/employeeStore';
import NewEmployeeDialog from '@/components/NewEmployeeDialog.vue';

// Store bağlantısı ve Modal Referansı
const store = useEmployeeStore();
const employeeDialogRef = ref(null);

// Modalı açan metod
const showModal = () => {
  if (employeeDialogRef.value) {
    employeeDialogRef.value.openDialog();
  }
};

// İzin durumunu (Onay/Red) Pinia üzerinden güncelleyen metod
const handleLeave = (id, newStatus) => {
  store.updateLeaveStatus(id, newStatus);
};
</script>

<style scoped>
/* Tablo Tasarımı (Siyah/Mor Tema Uyarlaması) */
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #0f0f0f;
  color: #a855f7;
  border-bottom: 1px solid #2d2d2d;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  background-color: #141414;
  color: #e0e0e0;
}
</style>