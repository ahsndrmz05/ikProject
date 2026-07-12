import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// PrimeVue ve Yeni Tema Sistemi
import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/lara'

import 'primeicons/primeicons.css'                            // İkonlar
import 'primeflex/primeflex.css'                              // Grid ve Utility sınıfları
import './assets/main.css'                                    // Kendi yazdığımız global CSS

const app = createApp(App)

app.use(createPinia())
app.use(router)

// PrimeVue'yu yeni tema ayarlarıyla başlatıyoruz
app.use(PrimeVue, {
    theme: {
        preset: Lara,
        options: {
            darkModeSelector: 'system', // Sistemin karanlık modunu algılar
            cssLayer: false
        }
    }
})

app.mount('#app')