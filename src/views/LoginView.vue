<template>
  <div class="flex align-items-center justify-content-center min-h-screen bg-black relative overflow-hidden">
    
    <!-- Arka plan mor neon efekti -->
    <div class="absolute bg-accent-purple border-circle" style="width: 400px; height: 400px; filter: blur(120px); opacity: 0.15; top: 10%; left: 20%;"></div>
    <div class="absolute bg-purple-900 border-circle" style="width: 300px; height: 300px; filter: blur(100px); opacity: 0.2; bottom: 10%; right: 20%;"></div>

    <Card class="w-full sm:w-26rem bg-gray-900 border-none border-round-3xl shadow-8 border-1 border-gray-800 z-1">
      <template #title>
        <div class="text-center flex flex-column gap-2 mb-4 pt-3">
          <span class="text-3xl font-bold text-white tracking-wide">İK Yönetim</span>
          <span class="text-400 text-sm font-normal">Lütfen sistem hesabınızla giriş yapın</span>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleLogin" class="flex flex-column gap-4 p-2">
          
          <div class="flex flex-column gap-2">
            <label for="email" class="text-300 font-medium text-sm ml-1">E-Posta Adresi</label>
            <InputText 
              id="email" 
              v-model="email" 
              type="email" 
              class="w-full bg-black border-gray-800 text-white border-round-2xl py-3 focus:border-accent-purple transition-colors" 
              placeholder="admin@sirket.com" 
              style="color: #ffffff !important; background-color: #000000 !important;"
              required 
            />
          </div>

          <div class="flex flex-column gap-2">
            <label for="password" class="text-300 font-medium text-sm ml-1">Şifre</label>
            <InputText 
              id="password" 
              v-model="password" 
              type="password" 
              class="w-full bg-black border-gray-800 text-white border-round-2xl py-3 focus:border-accent-purple transition-colors" 
              placeholder="••••••••" 
              style="color: #ffffff !important; background-color: #000000 !important;"
              required 
            />
          </div>

          <div v-if="authStore.error" class="text-red-400 text-sm text-center font-medium bg-red-950 py-2 border-round-xl">
            {{ authStore.error }}
          </div>

          <Button 
            type="submit"
            label="Sisteme Giriş" 
            class="w-full p-3 font-bold border-round-xl mt-2 p-button-help shadow-4" 
            :loading="authStore.loading"
          />

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
  if (!email.value || !password.value) return;
  const result = await authStore.login(email.value, password.value);
  
  if (result.success) {
    if (result.isFirstLogin) {
      router.push('/profile'); // Veya şifre değiştirme modalı/ekranı
    } else {
      router.push('/');
    }
  }
};
</script>