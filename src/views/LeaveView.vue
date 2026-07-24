<template>
  <div class="flex flex-column gap-4">
    <header class="flex justify-content-between align-items-center mb-2">
      <div>
        <h1 class="text-3xl font-bold text-white m-0">İzin Talepleri</h1>
        <span class="text-400 text-sm mt-1 block">Tüm izin taleplerini yönetin veya yeni bir izin girişi yapın.</span>
      </div>
      <Button label="Yeni İzin Talebi" icon="pi pi-calendar-plus" class="p-button-help border-round-xl font-bold shadow-4" @click="openNewDialog" />
    </header>

    <Card class="bg-gray-900 border-none border-round-3xl shadow-4">
      <template #content>
        <DataTable :value="leaveStore.izinler" :loading="leaveStore.loading" responsiveLayout="scroll" :paginator="true" :rows="8" class="p-datatable-sm" :pt="{
          root: { class: 'border-round-2xl overflow-hidden border-1 border-gray-800' },
          headerRow: { class: 'bg-black' }
        }">
          <template #empty>
            <div class="text-center p-4 text-400">
              <span v-if="!leaveStore.loading">Herhangi bir izin talebi bulunamadı.</span>
              <span v-else>İzin verileri yükleniyor...</span>
            </div>
          </template>

          <Column field="baslangicTarihi" header="Başlangıç Tarihi" class="text-400"></Column>
          <Column field="bitisTarihi" header="Bitiş Tarihi" class="text-400"></Column>
          <Column field="durum" header="Durum">
            <template #body="slotProps">
              <span :class="['px-3 py-1 border-round-3xl text-xs font-bold uppercase tracking-wide', 
                slotProps.data.state === 'Onaylandı' ? 'bg-green-900 text-green-400' : 
                slotProps.data.state === 'Bekliyor' ? 'bg-orange-900 text-orange-400' : 'bg-red-900 text-red-400']">
                {{ slotProps.data.state }}
              </span>
            </template>
          </Column>
          
          <Column header="İşlemler" :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
              <div class="flex gap-2" v-if="slotProps.data.state === 'Bekliyor'">
                <Button icon="pi pi-check" class="p-button-rounded p-button-success p-button-outlined w-2rem h-2rem p-0" title="Onayla" @click="leaveStore.updateIzinDurum(slotProps.data.id, 'onayla')" />
                <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-outlined w-2rem h-2rem p-0" title="Reddet" @click="leaveStore.updateIzinDurum(slotProps.data.id, 'reddet')" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Dialog v-model:visible="showDialog" header="Yeni İzin Talebi Oluştur" :modal="true" class="p-fluid" :style="{ width: '450px' }" :pt="{
      root: { class: 'border-round-3xl border-1 border-accent-purple bg-gray-900 overflow-hidden' },
      header: { class: 'bg-black text-white' },
      content: { class: 'bg-gray-900 text-white pt-4' },
      footer: { class: 'bg-black' }
    }">
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Başlangıç Tarihi</label>
          <InputText v-model="chosenLeave.value.start_date" type="date" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" style="color: #fff !important;" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Bitiş Tarihi</label>
          <InputText v-model="chosenLeave.value.end_date" type="date" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" style="color: #fff !important;" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-content-end gap-2 mt-3">
          <Button label="İptal" icon="pi pi-times" class="p-button-text p-button-secondary border-round-xl" @click="showDialog = false"/>
          <Button label="Talebi Gönder" icon="pi pi-send" class="p-button-help border-round-xl" @click="saveLeave" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useLeaveStore } from '@/stores/leaveStore';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

const leaveStore = useLeaveStore();

onMounted(() => {
  leaveStore.fetchLeaves();
});

const showDialog = ref(false);
const chosenLeave = ref({});

const openNewDialog = () => {
  chosenLeave.value = { start_date: '', end_date: '' };
  showDialog.value = true;
};

const saveLeave = async () => {
  if (chosenLeave.value.start_date && chosenLeave.value.end_date) {
    await leaveStore.addLeave(chosenLeave.value);
    showDialog.value = false;
  }
};
</script>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) { background-color: #050505 !important; color: #a855f7 !important; border-bottom: 1px solid #1f1f1f; padding: 1rem; }
:deep(.p-datatable .p-datatable-tbody > tr) { background-color: #0a0a0a !important; transition: background-color 0.2s; }
:deep(.p-datatable .p-datatable-tbody > tr:hover) { background-color: #141414 !important; }
:deep(.p-datatable .p-datatable-tbody > tr > td) { border-bottom: 1px solid #1f1f1f; padding: 1rem; }
</style>