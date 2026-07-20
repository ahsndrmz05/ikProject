import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true } // Sadece giriş yapmamışlar görebilir
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true } // Sadece giriş yapanlar görebilir
    }
  ]
})

// Navigation Guard (Güvenlik Duvarı)
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token'); // Kullanıcının token'ı var mı?

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Sayfa yetki gerektiriyor ama token yoksa logine at
    next({ name: 'login' });
  } else if (to.meta.requiresGuest && isAuthenticated) {
    // Sayfa misafir (login) sayfası ama kullanıcı zaten giriş yapmışsa dashboard'a at
    next({ name: 'dashboard' });
  } else {
    // Sorun yoksa gitmek istediği yere izin ver
    next();
  }
});

export default router