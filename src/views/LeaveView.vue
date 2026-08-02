<template>
  <div class="flex flex-column gap-4">
    <Toast />
    <header class="flex justify-content-between align-items-center mb-2">
      <div>
        <h1 class="text-3xl font-bold text-white m-0">Leave Requests</h1>
        <span class="text-400 text-sm mt-1 block">Manage or create leave requests.</span>
      </div>
      <Button v-if="authStore.userRole === 'Calisan'" label="New Leave Request" icon="pi pi-calendar-plus" class="p-button-help border-round-xl font-bold shadow-4" @click="openNewDialog" />
    </header>

    <!-- Flex ve Scroll Uyumlu İzin Tablosu -->
    <div class="card flex flex-column overflow-hidden border-round-3xl bg-gray-900 border-1 border-gray-800 p-3 shadow-4">
      <div class="overflow-x-auto overflow-y-auto max-h-30rem">
        <DataTable :value="leaveStore.leaves" :loading="leaveStore.loading" class="p-datatable-sm w-full" :paginator="true" :rows="8">
          <template #empty>
            <div class="text-center p-4 text-400">No leave requests found.</div>
          </template>
          <Column field="izinTuru" header="Leave Type" class="text-300"></Column>
          <Column field="baslangicTarihi" header="Start Date" class="text-300"></Column>
          <Column field="bitisTarihi" header="End Date" class="text-300"></Column>
          <Column field="yerineBakacakKisi" header="Substitute" class="text-300"></Column>
          <Column field="durum" header="Status">
            <template #body="slotProps">
              <span :class="['px-3 py-1 border-round-3xl text-xs font-bold uppercase tracking-wide', 
                slotProps.data.durum === 'Onaylandı' || slotProps.data.durum === 'Onaylandi' ? 'bg-green-900 text-green-400' : 
                slotProps.data.durum === 'Bekliyor' || slotProps.data.durum === 'Beklemede' ? 'bg-orange-900 text-orange-400' : 'bg-red-900 text-red-400']">
                {{ slotProps.data.durum }}
              </span>
            </template>
          </Column>
          <Column header="Actions" :exportable="false" style="min-width:8rem" v-if="authStore.userRole !== 'Calisan'">
            <template #body="slotProps">
              <div class="flex gap-2" v-if="slotProps.data.durum === 'Bekliyor' || slotProps.data.durum === 'Beklemede'">
                <Button icon="pi pi-check" class="p-button-rounded p-button-success p-button-outlined w-2rem h-2rem p-0" title="Approve" @click="handleApprove(slotProps.data.id)" />
                <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-outlined w-2rem h-2rem p-0" title="Reject" @click="handleReject(slotProps.data.id)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- İzin Talep Dialog -->
    <Dialog v-model:visible="dialogGoster" header="Create Leave Request" :modal="true" class="p-fluid" :style="{ width: '450px' }" :pt="{
      root: { class: 'border-round-3xl border-1 border-accent-purple bg-gray-900 overflow-hidden' },
      header: { class: 'bg-black text-white' },
      content: { class: 'bg-gray-900 text-white pt-4' },
      footer: { class: 'bg-black' }
    }">
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Leave Type</label>
          <Dropdown v-model="seciliIzin.izinTuru" :options="['Annual Leave', 'Excuse Leave', 'Sick Leave', 'Unpaid Leave']" placeholder="Select Leave Type" class="bg-black border-gray-800 text-white border-round-xl" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Start Date</label>
          <InputText v-model="seciliIzin.baslangicTarihi" type="date" class="bg-black border-gray-800 text-white border-round-xl p-3" style="color:#fff!important; background-color:#000!important;" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">End Date</label>
          <InputText v-model="seciliIzin.bitisTarihi" type="date" class="bg-black border-gray-800 text-white border-round-xl p-3" style="color:#fff!important; background-color:#000!important;" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Substitute Personnel</label>
          <Dropdown v-model="seciliIzin.yerineBakacakKisi" :options="personnelStore.personnels.map(p => p.ad + ' ' + p.soyad)" placeholder="Select Personnel" class="bg-black border-gray-800 text-white border-round-xl" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-content-end gap-2 mt-3">
          <Button label="Cancel" icon="pi pi-times" class="p-button-text p-button-secondary border-round-xl" @click="dialogGoster = false"/>
          <Button label="Submit Request" icon="pi pi-send" class="p-button-help border-round-xl" @click="saveIzin" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useLeaveStore } from '@/stores/leaveStore';
import { useAuthStore } from '@/stores/authStore';
import { usePersonnelStore } from '@/stores/personnelStore';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Toast from 'primevue/toast';

const leaveStore = useLeaveStore();
const authStore = useAuthStore();
const personnelStore = usePersonnelStore();
const toast = useToast();

onMounted(() => {
  leaveStore.fetchLeaves(authStore.userRole);
  personnelStore.fetchPersonnels();
});

const dialogGoster = ref(false);
const seciliIzin = ref({});

const openNewDialog = () => {
  seciliIzin.value = { izinTuru: '', baslangicTarihi: '', bitisTarihi: '', yerineBakacakKisi: '' };
  dialogGoster.value = true;
};

const saveIzin = async () => {
  try {
    await leaveStore.addLeave(seciliIzin.value);
    dialogGoster.value = false;
    toast.add({ severity: 'success', summary: 'Success', detail: 'Leave request created.', life: 3000 });
    leaveStore.fetchLeaves(authStore.userRole);
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Could not create leave request.', life: 3000 });
  }
};

const handleApprove = async (id) => {
  await leaveStore.updateLeaveStatus(id, 'approve');
  toast.add({ severity: 'success', summary: 'Approved', detail: 'Leave request approved.', life: 3000 });
};

const handleReject = async (id) => {
  await leaveStore.updateLeaveStatus(id, 'reject');
  toast.add({ severity: 'info', summary: 'Rejected', detail: 'Leave request rejected.', life: 3000 });
};
</script>