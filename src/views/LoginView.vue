<template>
  <div class="min-h-screen flex align-items-center justify-content-center bg-black relative overflow-hidden">
    
    <!-- Arka plan mor neon efekti -->
    <div class="absolute bg-accent-purple border-circle" style="width: 400px; height: 400px; filter: blur(120px); opacity: 0.15; top: -100px; right: -100px;"></div>
    <div class="absolute bg-purple-900 border-circle" style="width: 300px; height: 300px; filter: blur(100px); opacity: 0.1; bottom: -50px; left: -50px;"></div>

    <Card class="w-full sm:w-26rem bg-gray-900 border-none border-round-3xl shadow-8 border-1 border-gray-800 z-1" style="border-top-color: #a855f7 !important;">
      <template #title>
        <div class="text-center mb-4 mt-2">
          <i class="pi pi-bolt text-5xl text-accent-purple mb-3"></i>
          <h2 class="text-3xl font-bold text-white m-0 tracking-wider">SyncHR</h2>
          <span class="text-500 font-normal text-sm block mt-2">Yönetim Paneline Giriş Yapın</span>
        </div>
      </template>

      <template #content>
        <div class="flex flex-column gap-4">
          <!-- E-posta Input -->
          <div class="flex flex-column gap-2">
            <label for="email" class="text-300 font-medium text-sm ml-2">E-Posta / Kullanıcı Adı</label>
            <span class="p-input-icon-left">
              <i class="pi pi-user text-500" />
              <InputText 
                id="email" 
                v-model="email" 
                type="text" 
                class="w-full bg-gray-900 border-gray-700 text-white border-round-2xl py-3 focus:border-accent-purple transition-colors" 
                placeholder="admin@sirket.com" 
                style="color: #ffffff !important; background-color: #000000 !important;"
              />
            </span>
          </div>

          <!-- Şifre Input -->
          <div class="flex flex-column gap-2">
            <label for="password" class="text-300 font-medium text-sm ml-2">Şifre</label>
            <span class="p-input-icon-left">
              <i class="pi pi-lock text-500" />
              <InputText 
                id="password" 
                v-model="password" 
                type="password" 
                class="w-full bg-gray-900 border-gray-700 text-white border-round-2xl py-3 focus:border-accent-purple transition-colors" 
                placeholder="••••••••" 
                style="color: #ffffff !important; background-color: #000000 !important;"
                @keyup.enter="handleLogin"
              />
            </span>
          </div>

          <!-- Şifremi Unuttum -->
          <div class="flex justify-content-end">
            <a href="#" class="text-accent-purple text-sm no-underline hover:underline">Şifremi Unuttum</a>
          </div>

          <!-- Giriş Butonu -->
          <Button 
            label="Sisteme Giriş" 
            class="w-full p-3 font-bold border-round-2xl mt-2" 
            style="background-color: #a855f7; border: none; color: white;"
            :loading="isLoading"
            @click="handleLogin" 
          />
        </div>
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
  if (!email.value || !password.value) return;
  
  const basarili = await authStore.login(email.value, password.value);
  
  if (basarili) {
    router.push({ name: 'dashboard' });
  } else {
    console.error(authStore.error);
  }
};
</script>

<style scoped>
/* Input odaklanma (focus) efektleri için ince ayarlar */
:deep(.p-inputtext:focus) {
  box-shadow: 0 0 0 1px #a855f7 !important;
}
</style>