import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

import Home from './pages/Home.vue';
import Login from './pages/Login.vue';
import Register from './pages/Register.vue';
import Activities from './pages/Activities.vue';
import ActivityDetail from './pages/ActivityDetail.vue';
import AdminPanel from './pages/AdminPanel.vue';
import MyReservations from './pages/Reservations.vue';
import AdminReservations from './pages/adminReservations.vue';

import './assets/main.css';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/activities', component: Activities },
  { path: '/activities/:id', component: ActivityDetail },
  {
    path: '/admin',
    component: AdminPanel,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/reservations',
    component: AdminReservations,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/mes-reservations',
    component: MyReservations,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth) {
    if (!token) return next('/login');

    if (to.meta.requiresAdmin) {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.isAdmin) {
          return next();
        } else {
          return next('/'); 
        }
      } catch (err) {
        return next('/login');
      }
    }

    return next();
  }

  next();
});

createApp(App).use(router).mount('#app');
