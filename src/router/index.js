import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

import Login from '@/views/Auth/Login.vue';
import Home from '@/views/Dashboard/Home.vue';

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { public: true },
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/Dashboard/Users/UserList.vue'),
    meta: { requiresAuth: true, roles: ['RH'] },
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('@/views/Dashboard/Projects/ProjectsList.vue'),
    meta: { requiresAuth: true, roles: ['Planning', 'Developer', 'Tester'] },
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('@/views/Dashboard/Tasks/TasksList.vue'),
    meta: { requiresAuth: true, roles: ['Planning', 'Developer', 'Tester'] },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach(async (to, from, next) => {
  const isPublic = to.meta.public;
  const requiresAuth = to.meta.requiresAuth;

  const token = localStorage.getItem('token');
  const user = store.state.auth.user;

  if (token && !user) {
    await store.dispatch('auth/restoreSession');
  }

  if (requiresAuth && !store.getters['auth/isLoggedIn']) {
    return next({ name: 'Login' });
  }

  if (isPublic && store.getters['auth/isLoggedIn'] && to.name === 'Login') {
    return next('/home'); 
  }

  if (to.meta.roles) {
    const userRole = store.getters['auth/userRole'];
    if (!to.meta.roles.includes(userRole)) {
      return next('/home');
    }
  }

  return next();
});

export default router;
