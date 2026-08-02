<template>
  <div class="flex flex-column gap-4 max-w-4rem m-auto w-full">
    <Toast />
    <h1 class="text-3xl font-bold text-white m-0">Profilim</h1>

    <!-- Bilgi Güncelleme Kartı -->
    <Card class="bg-gray-900 border-none border-round-3xl shadow-4 p-3">
      <template #title><span class="text-white text-xl">Kişisel Bilgiler</span></template>
      <template #content>
        <form @submit.prevent="updateProfileInfo" class="grid p-fluid mt-2">
          <div class="col-12 md:col-6 mb-2">
            <label class="text-400 text-sm">Ad Soyad</label>
            <InputText :value="`${profile.ad} ${profile.soyad}`" disabled class="bg-black text-gray-400 border-gray-800" />
          </div>
          <div class="col-12 md:col-6 mb-2">
            <label class="text-400 text-sm">Departman / Unvan</label>
            <InputText :value="`${profile.departman} - ${profile.unvan || '-'}`" disabled class="bg-black text-gray-400 border-gray-800" />
          </div>
          <div class="col-12 md:col-6 mb-2">
            <label class="text-300 text-sm">E-Posta</label>
            <InputText v-model="profileForm.email" class="bg-black text-white border-gray-800" />
          </div>
          <div class="col-12 md:col-6 mb-2">
            <label class="text-300 text-sm">Telefon</label>
            <InputText v-model="profileForm.telefon" class="bg-black text-white border-gray-800" />
          </div>
          <div class="col-12 md:col-6 mb-2">
            <label class="text-300 text-sm">IBAN</label>
            <InputText v-model="profileForm.iban" class="bg-black text-white border-gray-800" />
          </div>
          <div class="col-12 md:col-6 mb-2">
            <label class="text-300 text-sm">Adres</label>
            <InputText v-model="profileForm.adres" class="bg-black text-white border-gray-800" />
          </div>
          <div class="col-12 text-right mt-3">
            <Button type="submit" label="Bilgileri Güncelle" icon="pi pi-save" class="p-button-help border-round-xl w-auto" />
          </div>
        </form>
      </template>
    </Card>

    <!-- Şifre Değiştirme Kartı -->
    <Card class="bg-gray-900 border-none border-round-3xl shadow-4 p-3">
      <template #title><span class="text-white text-xl">Şifre Değiştir</span></template>
      <template #content>
        <form @submit.prevent="changePassword" class="flex flex-column gap-3 p-fluid mt-2">
          <div>
            <label class="text-300 text-sm">Mevcut Şifre</label>
            <InputText v-model="passForm.currentPassword" type="password" class="bg-black text-white border-gray-800" required />
          </div>
          <div>
            <label class="text-300 text-sm">Yeni Şifre</label>
            <InputText v-model="passForm.newPassword" type="password" class="bg-black text-white border-gray-800" required />
          </div>
          <div>
            <label class="text-300 text-sm">Yeni Şifre (Tekrar)</label>
            <InputText v-model="passForm.confirmPassword" type="password" class="bg-black text-white border-gray-800" required />
          </div>
          <div class="text-right mt-2">
            <Button type="submit" label="Şifreyi Değiştir" icon="pi pi-key" class="p-button-warning border-round-xl w-auto" />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import api from '@/services/api';

const toast = useToast();
const profile = ref({});
const profileForm = ref({ email: '', telefon: '', adres: '', iban: '' });
const passForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' });

onMounted(async () => {
  try {
    const res = await api.get('/Personnel/getProfile');
    profile.value = res.data;
    profileForm.value = {
      email: res.data.email,
      telefon: res.data.telefon,
      adres: res.data.adres,
      iban: res.data.iban
    };
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Hata', detail: 'Profil yüklenemedi.' });
  }
});

const updateProfileInfo = async () => {
  try {
    await api.put('/Personnel/updateProfile', profileForm.value);
    toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Profil güncellendi.', life: 3000 });
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Hata', detail: err.response?.data || 'Güncellenemedi.' });
  }
};

const changePassword = async () => {
  if (passForm.value.newPassword !== passForm.value.confirmPassword) {
    toast.add({ severity: 'warn', summary: 'Uyarı', detail: 'Yeni şifreler eşleşmiyor.' });
    return;
  }
  try {
    await api.put('/Auth/changePassword', {
      currentPassword: passForm.value.currentPassword,
      newPassword: passForm.value.newPassword
    });
    toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Şifreniz değiştirildi.', life: 3000 });
    passForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Hata', detail: err.response?.data || 'Mevcut şifre hatalı.' });
  }
};
</script>