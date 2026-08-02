<template>
  <div class="flex flex-column gap-4">
    <Toast />
    <header class="flex justify-content-between align-items-center mb-2">
      <div>
        <h1 class="text-3xl font-bold text-white m-0">Personnel Management</h1>
        <span class="text-400 text-sm mt-1 block">Manage company personnel, filter by department, add or update records.</span>
      </div>
      <Button label="Add New Personnel" icon="pi pi-user-plus" class="p-button-help border-round-xl font-bold shadow-4" @click="openNewDialog" />
    </header>

    <!-- Departman Filtreleme Alanı -->
    <div class="flex align-items-center gap-3 bg-gray-900 p-3 border-round-2xl border-1 border-gray-800">
      <span class="text-white font-medium text-sm">Filter by Department:</span>
      <Dropdown 
        v-model="personnelStore.selectedDepartment" 
        :options="['All', 'Software', 'HR', 'Finance', 'Marketing', 'Management']" 
        placeholder="Select Department" 
        class="w-15rem bg-black border-gray-800 text-white border-round-xl" 
      />
    </div>

    <!-- Tablo Alanı -->
    <div class="card overflow-x-auto border-round-3xl bg-gray-900 border-1 border-gray-800 p-3 shadow-4">
      <DataTable :value="personnelStore.filteredPersonnels" :loading="personnelStore.loading" class="p-datatable-sm" :paginator="true" :rows="8">
        <template #empty>
          <div class="text-center p-4 text-400">No personnel records found.</div>
        </template>
        <Column field="ad" header="First Name" class="text-300"></Column>
        <Column field="soyad" header="Last Name" class="text-300"></Column>
        <Column field="email" header="Email" class="text-300"></Column>
        <Column field="departman" header="Department" class="text-300"></Column>
        <Column field="maas" header="Salary" class="text-300"></Column>
        <Column field="iseBaslamaTarihi" header="Start Date" class="text-300">
          <template #body="slotProps">
            {{ slotProps.data.iseBaslamaTarihi ? slotProps.data.iseBaslamaTarihi.split('T')[0] : '-' }}
          </template>
        </Column>
        <Column header="Actions" :exportable="false" style="min-width:10rem">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-button-outlined w-2rem h-2rem p-0" title="Update" @click="editPersonnel(slotProps.data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-outlined w-2rem h-2rem p-0" title="Delete" @click="deletePersonnel(slotProps.data.id)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Personel Ekleme / Güncelleme Dialog (İşe Başlama Tarihi Korumalı) -->
    <Dialog v-model:visible="dialogGoster" :header="isEditing ? 'Update Personnel Info' : 'Add New Personnel'" :modal="true" class="p-fluid" :style="{ width: '500px' }" :pt="{
      root: { class: 'border-round-3xl border-1 border-accent-purple bg-gray-900 overflow-hidden' },
      header: { class: 'bg-black text-white' },
      content: { class: 'bg-gray-900 text-white pt-4' },
      footer: { class: 'bg-black' }
    }">
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">First Name</label>
          <InputText v-model="personnelForm.ad" class="bg-black border-gray-800 text-white border-round-xl p-3" style="color:#fff!important;" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Last Name</label>
          <InputText v-model="personnelForm.soyad" class="bg-black border-gray-800 text-white border-round-xl p-3" style="color:#fff!important;" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Email</label>
          <InputText v-model="personnelForm.email" type="email" class="bg-black border-gray-800 text-white border-round-xl p-3" style="color:#fff!important;" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Department</label>
          <Dropdown v-model="personnelForm.departman" :options="['Software', 'HR', 'Finance', 'Marketing', 'Management']" placeholder="Select Department" class="bg-black border-gray-800 text-white border-round-xl" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Salary</label>
          <InputText v-model="personnelForm.maas" type="number" class="bg-black border-gray-800 text-white border-round-xl p-3" style="color:#fff!important;" />
        </div>

        <!-- Güvenli İşe Başlama Tarihi Alanı (Veri Kaybı Önlemi) -->
        <div class="flex flex-column gap-1 bg-black p-3 border-round-xl border-1 border-gray-800">
          <div class="flex justify-content-between align-items-center mb-1">
            <label class="text-300 font-medium text-sm">Start Date (Protected)</label>
            <div class="flex align-items-center gap-2">
              <input type="checkbox" v-model="allowDateEdit" id="editDateCheck" class="cursor-pointer" />
              <label for="editDateCheck" class="text-xs text-orange-400 cursor-pointer select-none">Unlock to Edit</label>
            </div>
          </div>
          <InputText 
            v-model="personnelForm.iseBaslamaTarihi" 
            type="date" 
            :disabled="!allowDateEdit && isEditing" 
            class="bg-black border-gray-800 text-white border-round-xl p-3" 
            :style="{ color: '#fff !important', opacity: (!allowDateEdit && isEditing) ? '0.5' : '1' }" 
          />
          <span v-if="isEditing && !allowDateEdit" class="text-xs text-400 mt-1">Original start date is locked to prevent accidental loss. Check box to modify.</span>
        </div>

        <!-- Deneyim Geçmişi -->
        <div class="flex flex-column gap-2 mt-2">
          <div class="flex justify-content-between align-items-center">
            <label class="text-300 font-medium text-sm">Work Experience</label>
            <Button label="Add" icon="pi pi-plus" class="p-button-sm p-button-secondary border-round-xl" @click="personnelForm.experiences.push({ company: '', role: '', duration: '' })" />
          </div>
          <div v-for="(exp, index) in personnelForm.experiences" :key="index" class="flex gap-2 align-items-center">
            <InputText v-model="exp.company" placeholder="Company" class="bg-black border-gray-800 text-white border-round-xl p-2 flex-1 text-sm" style="color:#fff!important;" />
            <InputText v-model="exp.role" placeholder="Role" class="bg-black border-gray-800 text-white border-round-xl p-2 flex-1 text-sm" style="color:#fff!important;" />
            <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-rounded" @click="personnelForm.experiences.splice(index, 1)" />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-content-end gap-2 mt-3">
          <Button label="Cancel" icon="pi pi-times" class="p-button-text p-button-secondary border-round-xl" @click="dialogGoster = false"/>
          <Button :label="isEditing ? 'Update' : 'Save'" icon="pi pi-check" class="p-button-help border-round-xl" @click="savePersonnel" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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

const personnelStore = usePersonnelStore();
const toast = useToast();

onMounted(() => {
  personnelStore.fetchPersonnels();
});

const dialogGoster = ref(false);
const isEditing = ref(false);
const allowDateEdit = ref(false);
const personnelForm = ref({ experiences: [] });

const openNewDialog = () => {
  isEditing.value = false;
  allowDateEdit.value = true;
  personnelForm.value = { ...emptyPersonnel };
  dialogGoster.value = true;
};

const editPersonnel = (data) => {
  isEditing.value = true;
  allowDateEdit.value = false; // Güvenlik için başlangıçta kilitli
  personnelForm.value = { 
    ...data, 
    iseBaslamaTarihi: data.iseBaslamaTarihi ? data.iseBaslamaTarihi.split('T')[0] : '',
    experiences: data.experiences || [] 
  };
  dialogGoster.value = true;
};

const savePersonnel = async () => {
  try {
    if (isEditing.value) {
      await personnelStore.updatePersonnel(personnelForm.value.id, personnelForm.value);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Personnel updated successfully.', life: 3000 });
    } else {
      await personnelStore.addPersonnel(personnelForm.value);
      toast.add({ severity: 'success', summary: 'Success', detail: 'New personnel added.', life: 3000 });
    }
    dialogGoster.value = false;
    personnelStore.fetchPersonnels();
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Operation failed.', life: 3000 });
  }
};

const deletePersonnel = async (id) => {
  await personnelStore.deletePersonnel(id);
  toast.add({ severity: 'info', summary: 'Deleted', detail: 'Personnel record removed.', life: 3000 });
};

const unvanOptions = [
  { label: 'Stajyer', value: 'Stajyer' },
  { label: 'Asistan', value: 'Asistan' },
  { label: 'Uzman', value: 'Uzman' },
  { label: 'Kıdemli Uzman', value: 'KidemliUzman' },
  { label: 'Takım Lideri', value: 'TakimLideri' },
  { label: 'Mühendis', value: 'Muhendis' },
  { label: 'Kıdemli Mühendis', value: 'KidemliMuhendis' },
  { label: 'Yönetici', value: 'Yonetici' },
  { label: 'Müdür', value: 'Mudur' },
  { label: 'Departman Müdürü', value: 'DepartmanMuduru' },
  { label: 'Direktör', value: 'Direktor' },
  { label: 'Genel Müdür', value: 'GenelMudur' },
];

const emptyPersonnel = {
  ad: '',
  soyad: '',
  email: '',
  departman: '',
  unvan: '',
  maas: '',
  iseBaslamaTarihi: '',
  telefon: '',
  adres: '',
  iban: '',
  dogumTarihi: '',
  experiences: []
};

// Ayrılanları da getirmek için istek:
const fetchPersonnel = async (includeInactive = false) => {
  const url = includeInactive ? '/Personnel/getPersonnel?includeInactive=true' : '/Personnel/getPersonnel';
  const response = await api.get(url);
  personnels.value = response.data;
};

// Geri İşe Al Aksiyonu:
const reactivate = async (id) => {
  await api.put(`/Personnel/reactivatePersonnel/${id}`);
  fetchPersonnel(true);
};
</script>