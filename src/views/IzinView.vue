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
        <DataTable :value="izinStore.izinler" :loading="izinStore.loading" responsiveLayout="scroll" :paginator="true" :rows="8" class="p-datatable-sm" :pt="{
          root: { class: 'border-round-2xl overflow-hidden border-1 border-gray-800' },
          headerRow: { class: 'bg-black' }
        }">
          <template #empty>
            <div class="text-center p-4 text-400">
              <span v-if="!izinStore.loading">Herhangi bir izin talebi bulunamadı.</span>
              <span v-else>İzin verileri yükleniyor...</span>
            </div>
          </template>

          <Column field="personel" header="Personel" class="text-white font-bold"></Column>
          <Column field="tur" header="İzin Türü" class="text-400"></Column>
          <Column field="baslangic" header="Başlangıç" class="text-400"></Column>
          <Column field="gun" header="Süre (Gün)" class="text-400"></Column>
          <Column field="durum" header="Durum">
            <template #body="slotProps">
              <span :class="['px-3 py-1 border-round-3xl text-xs font-bold uppercase tracking-wide', 
                slotProps.data.durum === 'Onaylandı' ? 'bg-green-900 text-green-400' : 
                slotProps.data.durum === 'Bekliyor' ? 'bg-orange-900 text-orange-400' : 'bg-red-900 text-red-400']">
                {{ slotProps.data.durum }}
              </span>
            </template>
          </Column>
          <Column header="İşlemler" :exportable="false" style="min-width:8rem">
            <template #body="slotProps">
              <div class="flex gap-2" v-if="slotProps.data.durum === 'Bekliyor'">
                <Button icon="pi pi-check" class="p-button-rounded p-button-success p-button-outlined w-2rem h-2rem p-0" @click="updateDurum(slotProps.data, 'Onaylandı')" />
                <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-outlined w-2rem h-2rem p-0" @click="updateDurum(slotProps.data, 'Reddedildi')" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Dialog v-model:visible="dialogGoster" header="Yeni İzin Talebi Oluştur" :modal="true" class="p-fluid" :style="{ width: '450px' }" :pt="{
      root: { class: 'border-round-3xl border-1 border-accent-purple bg-gray-900 overflow-hidden' },
      header: { class: 'bg-black text-white' },
      content: { class: 'bg-gray-900 text-white pt-4' },
      footer: { class: 'bg-black' }
    }">
      <div class="flex flex-column gap-4">
        <div class="flex flex-column gap-2">
          <label class="text-300 font-medium text-sm ml-1">Personel</label>
          <InputText v-model="seciliIzin.personel" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" placeholder="Personel Adı" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="text-300 font-medium text-sm ml-1">İzin Türü</label>
          <InputText v-model="seciliIzin.tur" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" placeholder="Örn: Yıllık İzin" />
        </div>
        <div class="flex flex-column gap-2">
          <label class="text-300 font-medium text-sm ml-1">Süre (Gün)</label>
          <InputText v-model="seciliIzin.gun" type="number" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-content-end gap-2 mt-3">
          <Button label="İptal" icon="pi pi-times" class="p-button-text p-button-secondary border-round-xl" @click="dialogGoster = false"/>
          <Button label="Talebi Gönder" icon="pi pi-send" class="p-button-help border-round-xl" @click="saveIzin" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useIzinStore } from '@/stores/izinStore';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

const izinStore = useIzinStore();

onMounted(() => {
  izinStore.fetchIzinler();
});

const dialogGoster = ref(false);
const seciliIzin = ref({});

const openNewDialog = () => {
  seciliIzin.value = { personel: '', tur: '', gun: 1, durum: 'Bekliyor', baslangic: 'Bugün' };
  dialogGoster.value = true;
};

const saveIzin = async () => {
  if (seciliIzin.value.personel && seciliIzin.value.tur) {
    await izinStore.addIzin(seciliIzin.value);
    dialogGoster.value = false;
  }
};

const updateDurum = async (izin, yeniDurum) => {
  await izinStore.updateIzinDurum(izin.id, { ...izin, durum: yeniDurum });
};
</script>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) { background-color: #050505 !important; color: #a855f7 !important; border-bottom: 1px solid #1f1f1f; padding: 1rem; }
:deep(.p-datatable .p-datatable-tbody > tr) { background-color: #0a0a0a !important; transition: background-color 0.2s; }
:deep(.p-datatable .p-datatable-tbody > tr:hover) { background-color: #141414 !important; }
:deep(.p-datatable .p-datatable-tbody > tr > td) { border-bottom: 1px solid #1f1f1f; padding: 1rem; }
</style>