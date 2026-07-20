import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import PersonelView from '../views/PersonelView.vue'
import IzinView from '../views/IzinView.vue'
import DuyuruView from '../views/DuyuruView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      component: MainLayout, // Ana kapsayıcı mizanpaj
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: HomeView // / rotasına gidildiğinde MainLayout içinde bu açılır
        },
        {
          path: 'personel',
          name: 'personel',
          component: PersonelView
        },
      {
          path: 'izinler',
          name: 'izinler',
          component: IzinView
        },
        {
          path: 'duyurular',
          name: 'duyurular',
          component: DuyuruView
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');
  if (to.meta.requiresAuth && !isAuthenticated) next({ name: 'login' });
  else if (to.meta.requiresGuest && isAuthenticated) next({ name: 'dashboard' });
  else next();
});

export default router