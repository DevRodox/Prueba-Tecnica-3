<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Bienvenido, {{ currentUser.name }}</p>

      <div v-if="isPlaneacion || isDesarrollador || isTester">
        <h2 class="text-xl font-bold mb-2">Funcionalidades</h2>
        <router-link to="/projects" class="bg-green-500 text-white px-4 py-2 rounded">
          Proyectos
        </router-link>
        <router-link to="/tasks" class="bg-green-500 text-white px-4 py-2 rounded ml-2">
          Tareas
        </router-link>
      </div>

      <div v-if="isRH">
        <h2 class="text-xl font-bold mb-2">Funcionalidades de RH</h2>
        <router-link to="/users" class="bg-blue-500 text-white px-4 py-2 rounded">
          Gestionar Usuarios
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Navbar from '../../components/shared/Navbar.vue';

export default {
  components: { Navbar },
  setup() {
    const store = useStore();
    const currentUser = computed(() => store.getters.currentUser);
    const isRH = computed(() => store.getters.isRH);
    const isPlaneacion = computed(() => store.getters.isPlaneacion);
    const isDesarrollador = computed(() => store.getters.isDesarrollador);
    const isTester = computed(() => store.getters.isTester);

    return { currentUser, isRH, isPlaneacion, isDesarrollador, isTester };
  },
};
</script>