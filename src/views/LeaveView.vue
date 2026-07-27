<template>
  <div class="flex flex-column gap-4">
    <Toast />
    <header class="flex justify-content-between align-items-center mb-2">
      <div>
        <h1 class="text-3xl font-bold text-white m-0">İzin Talepleri</h1>
        <span class="text-400 text-sm mt-1 block">
          {{ authStore.userRole === 'Calisan' ? 'Kendi izin taleplerinizi görüntüleyin ve yeni talep oluşturun.' : 'Tüm personel izin taleplerini yönetin.' }}
        </span>
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
                slotProps.data.durum === 'Onaylandı' || slotProps.data.durum === 'Onaylandi' ? 'bg-green-900 text-green-400' : 
                slotProps.data.durum === 'Bekliyor' || slotProps.data.durum === 'Beklemede' ? 'bg-orange-900 text-orange-400' : 'bg-red-900 text-red-400']">
                {{ slotProps.data.durum }}
              </span>
            </template>
          </Column>
          
          <Column header="İşlemler" :exportable="false" style="min-width:8rem" v-if="authStore.userRole !== 'Calisan'">
            <template #body="slotProps">
              <div class="flex gap-2" v-if="slotProps.data.durum === 'Bekliyor' || slotProps.data.durum === 'Beklemede'">
                <Button icon="pi pi-check" class="p-button-rounded p-button-success p-button-outlined w-2rem h-2rem p-0" title="Onayla" @click="handleApprove(slotProps.data.id)" />
                <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-outlined w-2rem h-2rem p-0" title="Reddet" @click="handleReject(slotProps.data.id)" />
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
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Başlangıç Tarihi</label>
          <InputText v-model="seciliIzin.baslangicTarihi" type="date" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" style="color: #fff !important;" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Bitiş Tarihi</label>
          <InputText v-model="seciliIzin.bitisTarihi" type="date" class="bg-black border-gray-800 text-white focus:border-accent-purple border-round-xl p-3" style="color: #fff !important;" />
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
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';

const leaveStore = useLeaveStore();
const authStore = useAuthStore();
const toast = useToast();

onMounted(() => {
  leaveStore.fetchLeaves(authStore.userRole);
});

const dialogGoster = ref(false);
const seciliIzin = ref({});

const openNewDialog = () => {
  seciliIzin.value = { baslangicTarihi: '', bitisTarihi: '' };
  dialogGoster.value = true;
};

const saveIzin = async () => {
  if (!seciliIzin.value.baslangicTarihi || !seciliIzin.value.bitisTarihi) {
    toast.add({ severity: 'warn', summary: 'Uyarı', detail: 'Lütfen tüm tarih alanlarını doldurun.', life: 3000 });
    return;
  }

  try {
    await leaveStore.addLeave(seciliIzin.value);
    dialogGoster.value = false;
    toast.add({ severity: 'success', summary: 'Başarılı', detail: 'İzin talebi başarıyla oluşturuldu.', life: 3000 });
    leaveStore.fetchLeaves(authStore.userRole);
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Hata', detail: err.response?.data?.message || 'İzin talebi oluşturulamadı.', life: 3000 });
  }
};

const handleApprove = async (id) => {
  try {
    await leaveStore.updateLeaveStatus(id, 'approve');
    toast.add({ severity: 'success', summary: 'Onaylandı', detail: 'İzin talebi onaylandı.', life: 3000 });
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Hata', detail: 'İşlem başarısız oldu.', life: 3000 });
  }
};

const handleReject = async (id) => {
  try {
    await leaveStore.updateLeaveStatus(id, 'reject');
    toast.add({ severity: 'info', summary: 'Reddedildi', detail: 'İzin talebi reddedildi.', life: 3000 });
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Hata', detail: 'İşlem başarısız oldu.', life: 3000 });
  }
};
</script>