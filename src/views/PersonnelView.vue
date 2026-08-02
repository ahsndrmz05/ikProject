<template>
  <div class="flex flex-column gap-4">
    <Toast />
    <header class="flex justify-content-between align-items-center mb-2">
      <div>
        <h1 class="text-3xl font-bold text-white m-0">Personel Yönetimi</h1>
        <span class="text-400 text-sm mt-1 block">Şirket personelini listeleyin, filtreleyin, yeni kayıt açın veya güncelleyin.</span>
      </div>
      <Button label="Yeni Personel Ekle" icon="pi pi-user-plus" class="p-button-help border-round-xl font-bold shadow-4" @click="openNewDialog" />
    </header>

    <!-- Departman Filtreleme Alanı -->
    <div class="flex align-items-center gap-3 bg-gray-900 p-3 border-round-2xl border-1 border-gray-800">
      <span class="text-white font-medium text-sm">Departmana Göre Filtrele:</span>
      <Dropdown 
        v-model="personnelStore.selectedDepartment" 
        :options="['Tümü', 'Yazılım', 'İK', 'Finans', 'Pazarlama', 'Yönetim']" 
        placeholder="Departman Seçin" 
        class="w-15rem bg-black border-gray-800 text-white border-round-xl" 
      />
    </div>

    <!-- Tablo Alanı -->
    <div class="card overflow-x-auto border-round-3xl bg-gray-900 border-1 border-gray-800 p-3 shadow-4">
      <DataTable :value="personnelStore.filteredPersonnels" :loading="personnelStore.loading" class="p-datatable-sm" :paginator="true" :rows="8">
        <template #empty>
          <div class="text-center p-4 text-400">Kayıtlı personel bulunamadı.</div>
        </template>
        <Column field="ad" header="Ad" class="text-300"></Column>
        <Column field="soyad" header="Soyad" class="text-300"></Column>
        <Column field="email" header="E-Posta" class="text-300"></Column>
        <Column field="departman" header="Departman" class="text-300"></Column>
        <Column field="maas" header="Maaş" class="text-300"></Column>
        <Column field="iseBaslamaTarihi" header="İşe Başlama Tarihi" class="text-300">
          <template #body="slotProps">
            {{ slotProps.data.iseBaslamaTarihi ? slotProps.data.iseBaslamaTarihi.split('T')[0] : '-' }}
          </template>
        </Column>
        <Column header="İşlemler" :exportable="false" style="min-width:10rem">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-button-outlined w-2rem h-2rem p-0" title="Güncelle" @click="editPersonnel(slotProps.data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-outlined w-2rem h-2rem p-0" title="Sil" @click="deletePersonnel(slotProps.data.id)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Personel Ekleme / Güncelleme Dialog -->
    <Dialog v-model:visible="dialogGoster" :header="isEditing ? 'Personel Bilgilerini Güncelle' : 'Yeni Personel Ekle'" :modal="true" class="p-fluid" :style="{ width: '500px' }" :pt="{
      root: { class: 'border-round-3xl border-1 border-accent-purple bg-gray-900 overflow-hidden' },
      header: { class: 'bg-black text-white' },
      content: { class: 'bg-gray-900 text-white pt-4' },
      footer: { class: 'bg-black' }
    }">
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Ad</label>
          <InputText v-model="personnelForm.ad" class="bg-black border-gray-800 text-white border-round-xl p-3" style="color:#fff!important;" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Soyad</label>
          <InputText v-model="personnelForm.soyad" class="bg-black border-gray-800 text-white border-round-xl p-3" style="color:#fff!important;" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">E-Posta</label>
          <InputText v-model="personnelForm.email" type="email" class="bg-black border-gray-800 text-white border-round-xl p-3" style="color:#fff!important;" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Departman</label>
          <Dropdown v-model="personnelForm.departman" :options="['Yazılım', 'İK', 'Finans', 'Pazarlama', 'Yönetim']" placeholder="Departman Seçin" class="bg-black border-gray-800 text-white border-round-xl" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">Maaş</label>
          <InputText v-model="personnelForm.maas" type="number" class="bg-black border-gray-800 text-white border-round-xl p-3" style="color:#fff!important;" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="text-300 font-medium text-sm ml-1">İşe Başlama Tarihi (Saat Bilgisiz)</label>
          <InputText v-model="personnelForm.iseBaslamaTarihi" type="date" class="bg-black border-gray-800 text-white border-round-xl p-3" style="color:#fff!important; background-color:#000!important;" />
        </div>

        <!-- Deneyim Geçmişi Yönetimi -->
        <div class="flex flex-column gap-2 mt-2">
          <div class="flex justify-content-between align-items-center">
            <label class="text-300 font-medium text-sm">İş Deneyimleri</label>
            <Button label="Ekle" icon="pi pi-plus" class="p-button-sm p-button-secondary border-round-xl" @click="personnelForm.experiences.push({ company: '', role: '', duration: '' })" />
          </div>
          <div v-for="(exp, index) in personnelForm.experiences" :key="index" class="flex gap-2 align-items-center">
            <InputText v-model="exp.company" placeholder="Şirket" class="bg-black border-gray-800 text-white border-round-xl p-2 flex-1 text-sm" style="color:#fff!important;" />
            <InputText v-model="exp.role" placeholder="Pozisyon" class="bg-black border-gray-800 text-white border-round-xl p-2 flex-1 text-sm" style="color:#fff!important;" />
            <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-rounded" @click="personnelForm.experiences.splice(index, 1)" />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-content-end gap-2 mt-3">
          <Button label="İptal" icon="pi pi-times" class="p-button-text p-button-secondary border-round-xl" @click="dialogGoster = false"/>
          <Button :label="isEditing ? 'Güncelle' : 'Kaydet'" icon="pi pi-check" class="p-button-help border-round-xl" @click="savePersonnel" />
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
const personnelForm = ref({ experiences: [] });

const openNewDialog = () => {
  isEditing.value = false;
  personnelForm.value = { ad: '', soyad: '', email: '', departman: '', maas: '', iseBaslamaTarihi: '', experiences: [] };
  dialogGoster.value = true;
};

const editPersonnel = (data) => {
  isEditing.value = true;
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
      toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Personel bilgileri güncellendi.', life: 3000 });
    } else {
      await personnelStore.addPersonnel(personnelForm.value);
      toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Yeni personel eklendi.', life: 3000 });
    }
    dialogGoster.value = false;
    personnelStore.fetchPersonnels();
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Hata', detail: 'İşlem başarısız oldu.', life: 3000 });
  }
};

const deletePersonnel = async (id) => {
  await personnelStore.deletePersonnel(id);
  toast.add({ severity: 'info', summary: 'Silindi', detail: 'Personel kaydı silindi.', life: 3000 });
};
</script>