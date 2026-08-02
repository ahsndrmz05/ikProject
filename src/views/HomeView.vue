<template>
  <div class="flex flex-column gap-5">
    <div class="flex justify-content-between align-items-center bg-gray-900 p-4 border-round-3xl shadow-4">
      <div>
        <h1 class="text-3xl font-bold text-white m-0">Welcome, <span class="text-purple-400">{{ authStore.userEmail }}</span></h1>
        <span class="text-400 text-sm mt-1 block">HR management platform dashboard.</span>
      </div>
      <div class="bg-black px-4 py-2 border-round-2xl border-1 border-gray-800 text-purple-400 font-bold text-sm">
        Role: {{ authStore.userRole }}
      </div>
    </div>

    <!-- İstatistik ve Kalan İzin Kartları -->
    <div class="grid">
      <div class="col-12 md:col-6 lg:col-4">
        <div class="bg-gray-900 p-4 border-round-3xl shadow-4 flex align-items-center gap-4 border-1 border-gray-800">
          <div class="w-3.5rem h-3.5rem bg-blue-900 border-round-2xl flex align-items-center justify-content-center text-blue-400 text-xl font-bold">
            <i class="pi pi-clock"></i>
          </div>
          <div class="flex flex-column">
            <span class="text-400 text-sm font-medium">Remaining Leave</span>
            <span class="text-2xl font-bold text-white mt-1">14 Days</span>
          </div>
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-4">
        <div class="bg-gray-900 p-4 border-round-3xl shadow-4 flex align-items-center gap-4 border-1 border-gray-800">
          <div class="w-3.5rem h-3.5rem bg-purple-900 border-round-2xl flex align-items-center justify-content-center text-purple-400 text-xl font-bold">
            <i class="pi pi-users"></i>
          </div>
          <div class="flex flex-column">
            <span class="text-400 text-sm font-medium">Total Personnel</span>
            <span class="text-2xl font-bold text-white mt-1">{{ personnelStore.personnels.length }}</span>
          </div>
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-4">
        <div class="bg-gray-900 p-4 border-round-3xl shadow-4 flex align-items-center gap-4 border-1 border-gray-800">
          <div class="w-3.5rem h-3.5rem bg-orange-900 border-round-2xl flex align-items-center justify-content-center text-orange-400 text-xl font-bold">
            <i class="pi pi-calendar"></i>
          </div>
          <div class="flex flex-column">
            <span class="text-400 text-sm font-medium">Leave Requests</span>
            <span class="text-2xl font-bold text-white mt-1">{{ leaveStore.leaves.length }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Zimmetli Eşyalar Listesi (Çalışan Görür, İK Düzenler) -->
    <div class="bg-gray-900 p-4 border-round-3xl border-1 border-gray-800 flex flex-column gap-3 shadow-4">
      <div class="flex justify-content-between align-items-center">
        <h3 class="text-white text-lg font-bold m-0">Assigned Equipment & Assets</h3>
        <Button v-if="authStore.userRole !== 'Calisan'" label="Assign Asset" icon="pi pi-plus" class="p-button-sm p-button-help border-round-xl" @click="addItem" />
      </div>
      <ul class="list-none p-0 m-0 flex flex-column gap-2">
        <li v-for="item in assignedItems" :key="item.id" class="flex justify-content-between align-items-center bg-black p-3 border-round-xl border-1 border-gray-800 text-300">
          <span class="text-white font-medium">{{ item.name }} (Serial No: {{ item.serial }})</span>
          <Button v-if="authStore.userRole !== 'Calisan'" icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger p-0 w-2rem h-2rem" @click="removeItem(item.id)" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { usePersonnelStore } from '@/stores/personnelStore';
import { useLeaveStore } from '@/stores/leaveStore';
import Button from 'primevue/button';

const authStore = useAuthStore();
const personnelStore = usePersonnelStore();
const leaveStore = useLeaveStore();

const assignedItems = ref([
  { id: 1, name: 'Dell Latitude Laptop', serial: 'DL-99823' },
  { id: 2, name: 'Logitech Wireless Mouse', serial: 'LG-44120' }
]);

const addItem = () => {
  const name = prompt('Device Name:');
  const serial = prompt('Serial Number:');
  if (name && serial) {
    assignedItems.value.push({ id: Date.now(), name, serial });
  }
};

const removeItem = (id) => {
  assignedItems.value = assignedItems.value.filter(i => i.id !== id);
};

onMounted(() => {
  personnelStore.fetchPersonnels();
  leaveStore.fetchLeaves(authStore.userRole);
});
</script>