<template>
  <Dialog 
    v-model:visible="visible" 
    modal 
    header="Yeni Personel Kaydı" 
    :style="{ width: '30vw' }"
    :pt="{
      root: { class: 'border-round-2xl border-1 border-accent-purple' },
      header: { class: 'bg-black text-accent-purple' },
      content: { class: 'bg-black' }
    }"
  >
    <div class="flex flex-column gap-4 pt-3">
      <div class="flex flex-column gap-2">
        <label for="name" class="text-300">Ad Soyad</label>
        <InputText id="name" v-model="employeeData.name" class="bg-gray-900 border-gray-700 text-white" />
      </div>
      
      <div class="flex flex-column gap-2">
        <label for="department" class="text-300">Departman</label>
        <Dropdown id="department" v-model="employeeData.department" :options="departments" placeholder="Seçiniz" class="bg-gray-900 border-gray-700 text-white" />
      </div>
      
      <div class="flex justify-content-end gap-2 mt-4">
        <Button label="İptal" icon="pi pi-times" class="p-button-text p-button-secondary" @click="visible = false" />
        <Button label="Kaydet" icon="pi pi-check" class="p-button-help border-round-xl" @click="saveEmployee" />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useEmployeeStore } from '@/stores/employeeStore';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';

const store = useEmployeeStore();
const visible = ref(false);

const departments = ref(['Yazılım', 'Tasarım', 'İnsan Kaynakları', 'Pazarlama']);
const employeeData = ref({ name: '', department: '' });

// Dışarıdan bu modalı açabilmek için fonksiyonu expose ediyoruz
const openDialog = () => {
  employeeData.value = { name: '', department: '' }; // Formu sıfırla
  visible.value = true;
};

defineExpose({ openDialog });

const saveEmployee = () => {
  if(employeeData.value.name) {
    store.addEmployee(employeeData.value);
    visible.value = false;
  }
};
</script>