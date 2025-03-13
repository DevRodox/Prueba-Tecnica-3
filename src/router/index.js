import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Auth/Login.vue';
import Dashboard from '../views/Dashboard/Home.vue';
import Users from '../views/Dashboard/Users.vue';
import Projects from '../views/Dashboard/Projects.vue';
import Tasks from '../views/Dashboard/Tasks.vue';
import store from '../store';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/users', component: Users, meta: { requiresAuth: true, requiresRH: true } },
  { path: '/projects', component: Projects, meta: { requiresAuth: true } },
  { path: '/tasks', component: Tasks, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;
  const isRH = store.getters.isRH;
  const isPlaneacion = store.getters.isPlaneacion;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresRH && !isRH) {
    next('/dashboard');
  } else if (to.meta.requiresPlaneacion && !isPlaneacion) {
    next('/dashboard'); 
  } else {
    next();
  }
});

export default router;