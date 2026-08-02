<template>
  <div class="flex flex-column gap-4">
    <Toast />
    <header class="flex justify-content-between align-items-center mb-2">
      <div>
        <h1 class="text-3xl font-bold text-white m-0">İzin Talepleri</h1>
        <span class="text-400 text-sm mt-1 block">İzin taleplerinizi oluşturun ve yönetin.</span>
      </div>
      <Button 
        v-if="authStore.userRole === 'Calisan'" 
        label="Yeni İzin Talebi" 
        icon="pi pi-calendar-plus" 
        class="p-button-help border-round-xl font-bold shadow-4" 
        @click="openNewDialog" 
      />
    </header>

    <Card class="bg-gray-900 border-none border-round-3xl shadow-4">
      <template #content>
        <DataTable :value="leaveStore.leaves" :loading="leaveStore.loading" responsiveLayout="scroll" :paginator="true" :rows="8" class="p-datatable-sm" :pt="{
          root: { class: 'border-round-2xl overflow-hidden border-1 border-gray-800' },
          headerRow: { class: 'bg-black' }
        }">
          <template #empty>
            <div class="text-center p-4 text-400">Herhangi bir izin talebi bulunamadı.</div>
          </template>

          <Column field="turu" header="İzin Türü" class="text-400"></Column>
          <Column field="baslangicTarihi" header="Başlangıç Tarihi" class="text-400"></Column>
          <Column field="bitisTarihi" header="Bitiş Tarihi" class="text-400"></Column>
          <Column field="substituteAdSoyad" header="Yerine Bakan" class="text-400">
            <template #body="slotProps">
              {{ slotProps.data.substituteAdSoyad || '-' }}
            </template>
          </Column>
          <Column field="durum" header="Durum">
            <template #body="slotProps">
              <span :class="['px-3 py-1 border-round-3xl text-xs font-bold uppercase tracking-wide', 
                slotProps.data.durum === 'Onaylandi' || slotProps.data.durum === 'Onaylandı' ? 'bg-green-900 text-green-400' : 
                slotProps.data.durum === 'Beklemede' || slotProps.data.durum === 'Bekliyor' ? 'bg-orange-900 text-orange-400' : 'bg-red-900 text-red-400']">
                {{ slotProps.data.durum }}
              </span>
            </template>
          </Column>
          <Column header="İşlemler" v-if="authStore.userRole !== 'Calisan'">
            <template #body="slotProps">
              <div class="flex gap-2" v-if="slotProps.data.durum === 'Beklemede' || slotProps.data.durum === 'Bekliyor'">
                <Button icon="pi pi-check" class="p-button-rounded p-button-success p-button-outlined w-2rem h-2rem p-0" @click="handleApprove(slotProps.data.id)" />
                <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-outlined w-2rem h-2rem p-0" @click="handleReject(slotProps.data.id)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Yeni İzin Modalı -->
    <Dialog v-model:visible="dialogGoster" header="Yeni İzin Talebi Oluştur" :modal="true" class="p-fluid" :style="{ width: '450px' }" :pt="{
      root: { class: 'border-round-3xl border-1 border-accent-purple bg-gray-900 overflow-hidden' },
      header: { class: 'bg-black text-white' },
      content: { class: 'bg-gray-900 text-white pt-4' },
      footer: { class: 'bg-black' }
    }">
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">İzin Türü</label>
          <Dropdown v-model="seciliIzin.turu" :options="izinTurleri" optionLabel="label" optionValue="value" placeholder="İzin türü seçiniz" class="bg-black border-gray-800 text-white border-round-xl" />
        </div>

        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Başlangıç Tarihi</label>
          <InputText v-model="seciliIzin.baslangicTarihi" type="date" class="bg-black border-gray-800 text-white border-round-xl p-3" style="color: #fff !important;" />
        </div>

        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Bitiş Tarihi</label>
          <InputText v-model="seciliIzin.bitisTarihi" type="date" class="bg-black border-gray-800 text-white border-round-xl p-3" style="color: #fff !important;" />
        </div>

        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Yerine Bakacak Kişi (Opsiyonel)</label>
          <Dropdown v-model="seciliIzin.substituteId" :options="adaylar" optionLabel="adSoyad" optionValue="id" placeholder="Yerine bakacak kişiyi seçiniz" class="bg-black border-gray-800 text-white border-round-xl" showClear />
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
import { useLeaveStore } from '@/stores/leaveStore';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'primevue/usetoast';
import api from '@/services/api';

const leaveStore = useLeaveStore();
const authStore = useAuthStore();
const toast = useToast();

const dialogGoster = ref(false);
const seciliIzin = ref({});
const adaylar = ref([]);

const izinTurleri = [
  { label: 'Yıllık İzin', value: 'Yillik' },
  { label: 'Mazeret İzni', value: 'Mazeret' },
  { label: 'Hastalık İzni', value: 'Hastalik' },
  { label: 'Ücretsiz İzin', value: 'Ucretsiz' },
];

onMounted(async () => {
  leaveStore.fetchLeaves(authStore.userRole);
  if (authStore.userRole === 'Calisan') {
    try {
      const cevap = await api.get('/Leave/getSubstituteCandidates');
      adaylar.value = cevap.data;
    } catch (err) {
      console.error('Aday listesi alınamadı:', err);
    }
  }
});

const openNewDialog = () => {
  seciliIzin.value = { turu: 'Yillik', baslangicTarihi: '', bitisTarihi: '', substituteId: null };
  dialogGoster.value = true;
};

const saveIzin = async () => {
  try {
    await leaveStore.addLeave(seciliIzin.value);
    dialogGoster.value = false;
    toast.add({ severity: 'success', summary: 'Başarılı', detail: 'İzin talebi oluşturuldu.', life: 3000 });
    leaveStore.fetchLeaves(authStore.userRole);
  } catch (err) {
    toast.add({ 
      severity: 'error', 
      summary: 'Hata', 
      detail: typeof err.response?.data === 'string' ? err.response.data : 'İşlem başarısız oldu.', 
      life: 4000 
    });
  }
};

const handleApprove = async (id) => {
  try {
    await leaveStore.updateLeaveStatus(id, 'approve');
    toast.add({ severity: 'success', summary: 'Onaylandı', detail: 'İzin talebi onaylandı.', life: 3000 });
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Hata', detail: err.response?.data || 'İşlem başarısız.', life: 3000 });
  }
};

const handleReject = async (id) => {
  try {
    await leaveStore.updateLeaveStatus(id, 'reject');
    toast.add({ severity: 'info', summary: 'Reddedildi', detail: 'İzin talebi reddedildi.', life: 3000 });
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Hata', detail: err.response?.data || 'İşlem başarısız.', life: 3000 });
  }
};
</script>