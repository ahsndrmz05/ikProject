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
        <DataTable :value="duyuruStore.duyurular" :loading="duyuruStore.loading" responsiveLayout="scroll" :paginator="true" :rows="8" class="p-datatable-sm" :pt="{
          root: { class: 'border-round-2xl overflow-hidden border-1 border-gray-800' },
          headerRow: { class: 'bg-black' }
        }">
          <template #empty>
            <div class="text-center p-4 text-400">
              <span v-if="!duyuruStore.loading">Herhangi bir duyuru bulunamadı.</span>
              <span v-else>Duyurular yükleniyor...</span>
            </div>
          </template>

          <Column field="baslik" header="Duyuru Başlığı" class="text-white font-bold" style="width: 30%"></Column>
          <Column field="icerik" header="İçerik Özeti" class="text-400" style="width: 40%">
            <template #body="slotProps">
              <span class="white-space-nowrap overflow-hidden text-overflow-ellipsis block" style="max-width: 300px;">
                {{ slotProps.data.icerik }}
              </span>
            </template>
          </Column>
          <Column field="tarih" header="Yayın Tarihi" class="text-400"></Column>
          <Column header="İşlemler" :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-info" @click="editDuyuru(slotProps.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="deleteDuyuru(slotProps.data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Dialog v-model:visible="dialogGoster" :header="dialogBaslik" :modal="true" class="p-fluid" :style="{ width: '550px' }" :pt="{
      root: { class: 'border-round-3xl border-1 border-accent-purple bg-gray-900 overflow-hidden' },
      header: { class: 'bg-black text-white' },
      content: { class: 'bg-gray-900 text-white pt-4' },
      footer: { class: 'bg-black' }
    }">
      <div class="flex flex-column gap-4">
        <div class="flex flex-column gap-2">
          <label class="text-300 font-medium text-sm ml-1">Duyuru Başlığı</label>
          <InputText v-model="seciliDuyuru.baslik" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="text-300 font-medium text-sm ml-1">İçerik / Detaylar</label>
          <Textarea v-model="seciliDuyuru.icerik" rows="5" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-content-end gap-2 mt-3">
          <Button label="İptal" icon="pi pi-times" class="p-button-text p-button-secondary border-round-xl" @click="dialogGoster = false"/>
          <Button label="Yayınla" icon="pi pi-check" class="p-button-help border-round-xl" @click="saveDuyuru" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useDuyuruStore } from '@/stores/duyuruStore';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

const duyuruStore = useDuyuruStore();

onMounted(() => {
  duyuruStore.fetchDuyurular();
});

const dialogGoster = ref(false);
const dialogBaslik = ref('');
const seciliDuyuru = ref({});
const isEdit = ref(false);

const openNewDialog = () => {
  const tarihFormat = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());
  seciliDuyuru.value = { baslik: '', icerik: '', tarih: tarihFormat };
  dialogBaslik.value = 'Yeni Duyuru Yayınla';
  isEdit.value = false;
  dialogGoster.value = true;
};

const editDuyuru = (duyuru) => {
  seciliDuyuru.value = { ...duyuru }; 
  dialogBaslik.value = 'Duyuruyu Düzenle';
  isEdit.value = true;
  dialogGoster.value = true;
};

const saveDuyuru = async () => {
  if (seciliDuyuru.value.baslik?.trim() && seciliDuyuru.value.icerik?.trim()) {
    if (isEdit.value) {
      await duyuruStore.updateDuyuru(seciliDuyuru.value.id, seciliDuyuru.value);
    } else {
      await duyuruStore.addDuyuru(seciliDuyuru.value);
    }
    dialogGoster.value = false;
  }
};

const deleteDuyuru = async (duyuru) => {
  await duyuruStore.deleteDuyuru(duyuru.id);
};
</script>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) { background-color: #050505 !important; color: #a855f7 !important; border-bottom: 1px solid #1f1f1f; padding: 1rem; }
:deep(.p-datatable .p-datatable-tbody > tr) { background-color: #0a0a0a !important; transition: background-color 0.2s; }
:deep(.p-datatable .p-datatable-tbody > tr:hover) { background-color: #141414 !important; }
:deep(.p-datatable .p-datatable-tbody > tr > td) { border-bottom: 1px solid #1f1f1f; padding: 1rem; }
</style>