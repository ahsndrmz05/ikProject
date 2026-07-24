<template>
  <div class="flex flex-column gap-4">
    <header class="flex justify-content-between align-items-center mb-2">
      <div>
        <h1 class="text-3xl font-bold text-white m-0">Şirket Duyuruları</h1>
        <span class="text-400 text-sm mt-1 block">Tüm çalışanlara iletilecek yeni duyurular yayınlayın veya mevcutları yönetin.</span>
      </div>
      <Button label="Yeni Duyuru" icon="pi pi-megaphone" class="p-button-help border-round-xl font-bold shadow-4" @click="openNewDialog" />
    </header>

    <Card class="bg-gray-900 border-none border-round-3xl shadow-4">
      <template #content>
        <DataTable :value="announceStore.announcements" :loading="announceStore.loading" responsiveLayout="scroll" :paginator="true" :rows="8" class="p-datatable-sm" :pt="{
          root: { class: 'border-round-2xl overflow-hidden border-1 border-gray-800' },
          headerRow: { class: 'bg-black' }
        }">
          <template #empty>
            <div class="text-center p-4 text-400">
              <span v-if="!announceStore.loading">Herhangi bir duyuru bulunamadı.</span>
              <span v-else>Duyurular yükleniyor...</span>
            </div>
          </template>

          <Column field="title" header="Duyuru Başlığı" class="text-white font-bold" style="width: 30%"></Column>
          <Column field="content" header="İçerik Özeti" class="text-400" style="width: 40%">
            <template #body="slotProps">
              <span class="white-space-nowrap overflow-hidden text-overflow-ellipsis block" style="max-width: 300px;">
                {{ slotProps.data.content }}
              </span>
            </template>
          </Column>
          <Column field="date" header="Yayın Tarihi" class="text-400"></Column>
          <Column header="İşlemler" :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-info" @click="editAnnouncement(slotProps.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="deleteAnnouncement(slotProps.data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Dialog v-model:visible="showDialog" :header="titleDialog" :modal="true" class="p-fluid" :style="{ width: '550px' }" :pt="{
      root: { class: 'border-round-3xl border-1 border-accent-purple bg-gray-900 overflow-hidden' },
      header: { class: 'bg-black text-white' },
      content: { class: 'bg-gray-900 text-white pt-4' },
      footer: { class: 'bg-black' }
    }">
      <div class="flex flex-column gap-4">
        <div class="flex flex-column gap-2">
          <label class="text-300 font-medium text-sm ml-1">Duyuru Başlığı</label>
          <InputText v-model="chosenAnnouncement.value.title" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="text-300 font-medium text-sm ml-1">İçerik / Detaylar</label>
          <Textarea v-model="chosenAnnouncement.value.content" rows="5" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-content-end gap-2 mt-3">
          <Button label="İptal" icon="pi pi-times" class="p-button-text p-button-secondary border-round-xl" @click="showDialog = false"/>
          <Button label="Yayınla" icon="pi pi-check" class="p-button-help border-round-xl" @click="saveAnnouncement" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAnnounceStore } from '@/stores/announceStore';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

const announceStore = useAnnounceStore();

onMounted(() => {
  announceStore.fetchAnnouncements();
});

const showDialog = ref(false);
const titleDialog = ref('');
const chosenAnnouncement = ref({});
const isEdit = ref(false);

const openNewDialog = () => {
  const dateFormat = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());
  chosenAnnouncement.value = { title: '', content: '', date: dateFormat };
  titleDialog.value = 'Yeni Duyuru Yayınla';
  isEdit.value = false;
  showDialog.value = true;
};

const editAnnouncement = (announcement) => {
  chosenAnnouncement.value = { ...announcement }; 
  titleDialog.value = 'Duyuruyu Düzenle';
  isEdit.value = true;
  showDialog.value = true;
};

const saveAnnouncement = async () => {
  if (chosenAnnouncement.value.title?.trim() && chosenAnnouncement.value.content?.trim()) {
    if (isEdit.value) {
      await announceStore.updateAnnouncement(chosenAnnouncement.value.id, chosenAnnouncement.value);
    } else {
      await announceStore.addAnnouncement(chosenAnnouncement.value);
    }
    showDialog.value = false;
  }
};

const deleteAnnouncement = async (announcement) => {
  await announceStore.deleteAnnouncement(announcement.id);
};
</script>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) { background-color: #050505 !important; color: #a855f7 !important; border-bottom: 1px solid #1f1f1f; padding: 1rem; }
:deep(.p-datatable .p-datatable-tbody > tr) { background-color: #0a0a0a !important; transition: background-color 0.2s; }
:deep(.p-datatable .p-datatable-tbody > tr:hover) { background-color: #141414 !important; }
:deep(.p-datatable .p-datatable-tbody > tr > td) { border-bottom: 1px solid #1f1f1f; padding: 1rem; }
</style>