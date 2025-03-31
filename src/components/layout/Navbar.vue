<template>
  <nav class="fixed top-0 left-0 w-full bg-white shadow z-10">
    <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
      <router-link to="/home" class="text-xl font-bold text-blue-700">
        Gestor de Proyectos
      </router-link>

      <div class="flex gap-4 text-sm text-gray-700">
        <router-link
          v-if="role === 'RH'"
          to="/users"
          class="hover:underline"
        >
          Usuarios
        </router-link>

        <router-link
          v-if="role === 'Planning'"
          to="/projects"
          class="hover:underline"
        >
          Proyectos
        </router-link>

        <router-link
          v-if="role === 'Planning' || role === 'Developer' || role === 'Tester'"
          to="/tasks"
          class="hover:underline"
        >
          Tareas
        </router-link>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-gray-600 text-sm hidden sm:inline">Hola, {{ user?.name }}</span>
        <button
          @click="handleLogout"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Navbar',
  setup() {
    const store = useStore();
    const router = useRouter();

    const user = computed(() => store.state.auth.user);
    const role = computed(() => store.getters['auth/userRole']);

    const handleLogout = async () => {
      await store.dispatch('auth/logout');
      router.push('/login');
    };

    return {
      user,
      role,
      handleLogout,
    };
  },
};
</script>
