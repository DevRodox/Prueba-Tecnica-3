<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Bienvenido, {{ user.name }}</h1>
    <p class="mb-6">Tu rol es: <strong>{{ role }}</strong></p>

    <div class="grid gap-4 md:grid-cols-2">

      <div v-if="role === 'RH'" class="p-4 bg-white shadow rounded">
        <h2 class="text-xl font-semibold mb-2">Administración de Usuarios</h2>
        <router-link to="/users" class="text-blue-600 hover:underline">Ver usuarios</router-link>
      </div>

      <div v-if="role === 'Planning'" class="p-4 bg-white shadow rounded">
        <h2 class="text-xl font-semibold mb-2">Gestión de Proyectos y Tareas</h2>
        <router-link to="/projects" class="block text-blue-600 hover:underline">Proyectos</router-link>
        <router-link to="/tasks" class="block text-blue-600 hover:underline">Tareas</router-link>
      </div>

      <div v-if="['Developer', 'Tester'].includes(role)" class="p-4 bg-white shadow rounded">
        <h2 class="text-xl font-semibold mb-2">Mis tareas</h2>
        <router-link to="/tasks" class="text-blue-600 hover:underline">Ver tareas asignadas</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Home',
  setup() {
    const store = useStore();
    const user = computed(() => store.state.auth.user || {});
    const role = computed(() => store.getters['auth/userRole']);
    return { user, role };
  },
};
</script>
