import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import PersonnelView from '@/views/PersonnelView.vue';
import LeaveView from '@/views/LeaveView.vue';
import AnnounceView from '@/views/AnnounceView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: HomeView
        },
        {
          path: 'personnel',
          name: 'personnel',
          component: PersonnelView
        },
        {
          path: 'leaves',
          name: 'leaves',
          component: LeaveView
        },
        {
          path: 'announcements',
          name: 'announcements',
          component: AnnounceView
        }
      ]
    }
  ]
});

// Basit Global Kimlik Doğrulama Koruyucusu (Navigation Guard)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' });
  } else if (to.name === 'login' && token) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

export default router;