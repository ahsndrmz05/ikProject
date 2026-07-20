<template>
  <div class="flex flex-column gap-4">
    
    <!-- Üst Bilgi ve Aksiyon -->
    <header class="flex justify-content-between align-items-center mb-2">
      <div>
        <h1 class="text-3xl font-bold text-white m-0">Personel Yönetimi</h1>
        <span class="text-400 text-sm mt-1 block">Şirket çalışanlarını görüntüleyin, ekleyin veya güncelleyin.</span>
      </div>
      <Button label="Yeni Personel" icon="pi pi-user-plus" class="p-button-help border-round-xl font-bold shadow-4" @click="openNewDialog" />
    </header>

    <!-- Personel Listesi Tablosu -->
    <Card class="bg-gray-900 border-none border-round-3xl shadow-4">
      <template #content>
        <!-- Store üzerinden verileri ve loading durumunu bağlıyoruz -->
        <DataTable :value="personelStore.personeller" :loading="personelStore.loading" responsiveLayout="scroll" :paginator="true" :rows="8" class="p-datatable-sm" :pt="{
          root: { class: 'border-round-2xl overflow-hidden border-1 border-gray-800' },
          headerRow: { class: 'bg-black' }
        }">
          <template #empty>
            <div class="text-center p-4 text-400">
              <span v-if="!personelStore.loading">Herhangi bir personel kaydı bulunamadı.</span>
              <span v-else>Personel verileri yükleniyor...</span>
            </div>
          </template>
          
          <Column field="adSoyad" header="Ad Soyad" class="text-white font-bold"></Column>
          <Column field="departman" header="Departman" class="text-400"></Column>
          <Column field="unvan" header="Ünvan" class="text-400"></Column>
          <Column field="durum" header="Durum">
            <template #body="slotProps">
              <span :class="['px-3 py-1 border-round-3xl text-xs font-bold uppercase tracking-wide', 
                slotProps.data.durum === 'Aktif' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400']">
                {{ slotProps.data.durum }}
              </span>
            </template>
          </Column>
          <Column header="İşlemler" :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-info" aria-label="Düzenle" @click="editPersonel(slotProps.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" aria-label="Sil" @click="deletePersonel(slotProps.data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Yeni Ekleme / Düzenleme Modalı -->
    <Dialog v-model:visible="dialogGoster" :header="dialogBaslik" :modal="true" class="p-fluid" :style="{ width: '450px' }" :pt="{
      root: { class: 'border-round-3xl border-1 border-accent-purple bg-gray-900 overflow-hidden' },
      header: { class: 'bg-black text-white' },
      content: { class: 'bg-gray-900 text-white pt-4' },
      footer: { class: 'bg-black' }
    }">
      <div class="flex flex-column gap-4">
        <div class="flex flex-column gap-2">
          <label for="adSoyad" class="text-300 font-medium text-sm ml-1">Ad Soyad</label>
          <InputText id="adSoyad" v-model="seciliPersonel.adSoyad" autofocus class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" />
        </div>
        
        <div class="flex flex-column gap-2">
          <label for="departman" class="text-300 font-medium text-sm ml-1">Departman</label>
          <InputText id="departman" v-model="seciliPersonel.departman" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" />
        </div>
        
        <div class="flex flex-column gap-2">
          <label for="unvan" class="text-300 font-medium text-sm ml-1">Ünvan</label>
          <InputText id="unvan" v-model="seciliPersonel.unvan" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-content-end gap-2 mt-3">
          <Button label="İptal" icon="pi pi-times" class="p-button-text p-button-secondary border-round-xl" @click="dialogGoster = false"/>
          <!-- Kaydet butonuna asenkron yükleme (loading) durumu eklenebilir -->
          <Button label="Kaydet" icon="pi pi-check" class="p-button-help border-round-xl" @click="savePersonel" />
        </div>
      </template>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePersonelStore } from '@/stores/personelStore';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { usePersonelStore } from '@/stores/personelStore';

// Store bağlantısını kur
const personelStore = usePersonelStore();

// Sayfa yüklendiğinde API'den personelleri çek (GET)
onMounted(() => {
  personelStore.fetchPersoneller();
});

// Modal State Yönetimi
const dialogGoster = ref(false);
const dialogBaslik = ref('');
const seciliPersonel = ref({});
const isEdit = ref(false);

const openNewDialog = () => {
  seciliPersonel.value = { adSoyad: '', departman: '', unvan: '', durum: 'Aktif' };
  dialogBaslik.value = 'Yeni Personel Kaydı';
  isEdit.value = false;
  dialogGoster.value = true;
};

const editPersonel = (personel) => {
  seciliPersonel.value = { ...personel }; 
  dialogBaslik.value = 'Personel Bilgilerini Düzenle';
  isEdit.value = true;
  dialogGoster.value = true;
};

const savePersonel = async () => {
  // Basit doğrulama (Validation)
  if (seciliPersonel.value.adSoyad.trim()) {
    try {
      if (isEdit.value) {
        // Backend'e güncelleme isteği at (PUT)
        await personelStore.updatePersonel(seciliPersonel.value.id, seciliPersonel.value);
      } else {
        // Backend'e yeni kayıt isteği at (POST)
        await personelStore.addPersonel(seciliPersonel.value);
      }
      dialogGoster.value = false;
    } catch (error) {
      console.error("Kayıt işlemi sırasında hata oluştu.", error);
    }
  }
};

const deletePersonel = async (personel) => {
  try {
    // Backend'e silme isteği at (DELETE)
    await personelStore.deletePersonel(personel.id);
  } catch (error) {
    console.error("Silme işlemi sırasında hata oluştu.", error);
  }
};
</script>

<style scoped>
/* PrimeVue Tablo Özelleştirmeleri (Koyu Tema) */
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #050505 !important;
  color: #a855f7 !important;
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
</style>