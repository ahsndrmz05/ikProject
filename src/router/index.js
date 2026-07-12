import { createRouter, createWebHistory } from 'vue-router'
// Ana sayfamız olacak bileşeni içe aktarıyoruz
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    }
  ]
})

export default router