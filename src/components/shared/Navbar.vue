<template>
  <nav class="bg-blue-500 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <router-link to="/dashboard" class="text-white text-xl font-bold">Prueba Técnica 3</router-link>
      <div>
        <router-link v-if="isRH" to="/users" class="text-white hover:text-gray-200 mr-4">
          Usuarios
        </router-link>
        <router-link v-if="isPlaneacion" to="/projects" class="text-white hover:text-gray-200 mr-4">
          Proyectos
        </router-link>
        <router-link v-if="isPlaneacion" to="/tasks" class="text-white hover:text-gray-200 mr-4">
          Tareas
        </router-link>
        <button @click="openProfileModal" class="text-white hover:text-gray-200 mr-4">
          Perfil
        </button>
        <button @click="logout" class="text-white hover:text-gray-200">Logout</button>
      </div>
    </div>
  </nav>

  <CreateEditUserModal
    v-if="isProfileModalOpen"
    :isOpen="isProfileModalOpen"
    :mode="'edit'"
    :user="currentUser"
    @close="closeProfileModal"
  />
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import CreateEditUserModal from '@/components/users/CreateEditUserModal.vue';

export default {
  components: { CreateEditUserModal }, 
  setup() {
    const store = useStore();
    const router = useRouter();
    const isRH = computed(() => store.getters.isRH);
    const isPlaneacion = computed(() => store.getters.isPlaneacion);
    const currentUser = computed(() => store.getters.currentUser);

    const isProfileModalOpen = ref(false);

    const openProfileModal = () => {
      isProfileModalOpen.value = true; 
    };

    const closeProfileModal = () => {
      isProfileModalOpen.value = false;
    };

    const logout = () => {
      store.dispatch('logout');
      router.push('/login');
    };

    return {
      isRH,
      isPlaneacion,
      currentUser,
      isProfileModalOpen,
      openProfileModal,
      closeProfileModal,
      logout,
    };
  },
};
</script>