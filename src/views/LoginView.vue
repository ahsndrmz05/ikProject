<template>
  <div class="flex align-items-center justify-content-center min-h-screen bg-black relative overflow-hidden">
    <div class="absolute bg-accent-purple border-circle" style="width: 400px; height: 400px; filter: blur(120px); opacity: 0.15;"></div>

    <Card class="w-full sm:w-26rem bg-gray-900 border-none border-round-3xl shadow-8 border-1 border-gray-800 z-1">
      <template #title>
        <div class="text-center flex flex-column gap-2 mb-4 pt-3">
          <span class="text-2xl font-bold text-white">İK Platform Giriş</span>
          <span class="text-400 text-sm">Devam etmek için lütfen giriş yapın.</span>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleLogin" class="flex flex-column gap-4 p-2">
          <div v-if="authStore.error" class="p-3 bg-red-900 text-red-300 border-round-xl text-sm text-center">
            {{ authStore.error }}
          </div>

          <div class="flex flex-column gap-2">
            <label class="text-300 font-medium text-sm ml-1">E-Posta</label>
            <InputText v-model="email" type="email" class="w-full bg-black border-gray-800 text-white border-round-xl p-3" placeholder="ornek@sirket.com" style="color:#fff!important; background-color:#000!important;" required />
          </div>

          <div class="flex flex-column gap-2">
            <label class="text-300 font-medium text-sm ml-1">Şifre</label>
            <InputText v-model="password" type="password" class="w-full bg-black border-gray-800 text-white border-round-xl p-3" placeholder="••••••••" style="color:#fff!important; background-color:#000!important;" required />
          </div>

          <Button type="submit" label="Giriş Yap" class="w-full p-3 font-bold border-round-xl p-button-help shadow-4" :loading="authStore.loading" />
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    const data = await authStore.login(email.value, password.value);
    
    // Görev 3: İlk giriş kontrolü
    if (data.user?.isFirstLogin) {
      router.push('/profile'); // Şifre değiştirme alanının olduğu profil sayfasına yönlendirilir
    } else {
      router.push('/');
    }
  } catch (err) {
    // Hata store içinde yönetiliyor
  }
};
</script>