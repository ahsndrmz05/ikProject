<template>
  <div class="flex flex-column gap-4">
    <header class="flex justify-content-between align-items-center mb-2">
      <div>
        <h1 class="text-3xl font-bold text-white m-0">Personel Yönetimi</h1>
        <span class="text-400 text-sm mt-1 block">Şirket çalışanlarını görüntüleyin, ekleyin veya güncelleyin.</span>
      </div>
      <Button label="Yeni Personel" icon="pi pi-user-plus" class="p-button-help border-round-xl font-bold shadow-4" @click="openNewDialog" />
    </header>

    <Card class="bg-gray-900 border-none border-round-3xl shadow-4">
      <template #content>
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
          
          <Column field="ad" header="Ad" class="text-white font-bold"></Column>
          <Column field="soyad" header="Soyad" class="text-white font-bold"></Column>
          <Column field="email" header="E-Posta" class="text-400"></Column>
          <Column field="departman" header="Departman" class="text-400"></Column>
          <Column field="maas" header="Maaş" class="text-400"></Column>
          <Column field="iseBaslamaTarihi" header="İşe Başlama" class="text-400"></Column>

          <Column header="İşlemler" :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-info" @click="editPersonel(slotProps.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="deletePersonel(slotProps.data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Dialog v-model:visible="dialogGoster" :header="dialogBaslik" :modal="true" class="p-fluid" :style="{ width: '450px' }" :pt="{
      root: { class: 'border-round-3xl border-1 border-accent-purple bg-gray-900 overflow-hidden' },
      header: { class: 'bg-black text-white' },
      content: { class: 'bg-gray-900 text-white pt-4' },
      footer: { class: 'bg-black' }
    }">
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Ad</label>
          <InputText v-model="seciliPersonel.ad" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" style="color: #fff !important;" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Soyad</label>
          <InputText v-model="seciliPersonel.soyad" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" style="color: #fff !important;" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">E-Posta</label>
          <InputText v-model="seciliPersonel.email" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" style="color: #fff !important;" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Departman</label>
          <InputText v-model="seciliPersonel.departman" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" style="color: #fff !important;" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Maaş</label>
          <InputText v-model="seciliPersonel.maas" type="number" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" style="color: #fff !important;" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">İşe Başlama Tarihi</label>
          <InputText v-model="seciliPersonel.iseBaslamaTarihi" placeholder="YYYY-MM-DD" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" style="color: #fff !important;" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-content-end gap-2 mt-3">
          <Button label="İptal" icon="pi pi-times" class="p-button-text p-button-secondary border-round-xl" @click="dialogGoster = false"/>
          <Button label="Kaydet" icon="pi pi-check" class="p-button-help border-round-xl" @click="savePersonel" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePersonnelStore } from '@/stores/personnelStore';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

const personnelStore = usePersonnelStore();

onMounted(() => {
  personnelStore.fetchPersonnels();
});

const showDialog = ref(false);
const titleDialog = ref('');
const chosenPersonnel = ref({});
const isEdit = ref(false);

const openNewDialog = () => {
  chosenPersonnel.value = { ad: '', soyad: '', email: '', departman: '', maas: '', iseBaslamaTarihi: '' };
  titleDialog.value = 'Yeni Personel Kaydı';
  isEdit.value = false;
  showDialog.value = true;
};

const editPersonnel = (personnel) => {
  chosenPersonnel.value = { ...personnel }; 
  titleDialog.value = 'Personel Bilgilerini Düzenle';
  isEdit.value = true;
  showDialog.value = true;
};

const savePersonnel = async () => {
  if (chosenPersonnel.value.ad?.trim()) {
    if (isEdit.value) {
      await personnelStore.updatePersonnel(chosenPersonnel.value.id, chosenPersonnel.value);
    } else {
      await personnelStore.addPersonnel(chosenPersonnel.value);
    }
    showDialog.value = false;
  }
};

const deletePersonnel = async (personnel) => {
  await personnelStore.deletePersonnel(personnel.id);
};
</script>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) { background-color: #050505 !important; color: #a855f7 !important; border-bottom: 1px solid #1f1f1f; padding: 1rem; }
:deep(.p-datatable .p-datatable-tbody > tr) { background-color: #0a0a0a !important; transition: background-color 0.2s; }
:deep(.p-datatable .p-datatable-tbody > tr:hover) { background-color: #141414 !important; }
:deep(.p-datatable .p-datatable-tbody > tr > td) { border-bottom: 1px solid #1f1f1f; padding: 1rem; }
</style>