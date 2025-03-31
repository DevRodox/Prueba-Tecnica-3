<template>
  <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
    <h2 class="text-lg font-bold mb-4">Asignar usuarios al proyecto</h2>

    <div v-if="loading" class="text-gray-500">Cargando usuarios...</div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="users.length === 0" class="text-gray-500">No hay usuarios disponibles.</div>

      <div v-else class="max-h-60 overflow-y-auto">
        <label
          v-for="user in users"
          :key="user.id"
          class="block text-sm text-gray-700 my-1"
        >
          <input
            type="checkbox"
            :value="user.id"
            v-model="selected"
            class="mr-2"
          />
          {{ user.name }} ({{ user.role }})
        </label>
      </div>

      <div class="text-right mt-4">
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Asignar
        </button>
        <button
          type="button"
          class="ml-2 text-gray-500 hover:text-black"
          @click="$emit('close')"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { assignUsersToProject } from '@/api/projects';

export default {
  name: 'AssignUsersModal',
  props: {
    projectId: {
      type: Number,
      required: true,
    },
  },
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const store = useStore();

    const selected = ref([]);
    const loading = ref(true);

    const users = computed(() => store.getters['users/assignableUsers']);

    onMounted(async () => {
      try {
        await store.dispatch('users/fetchAssignableUsers');
      } catch (err) {
        alert('Error al obtener usuarios');
      } finally {
        loading.value = false;
      }
    });

    const handleSubmit = async () => {
      try {
        await assignUsersToProject(props.projectId, selected.value);
        emit('success');
        emit('close');
      } catch (err) {
        alert('Error al asignar usuarios');
      }
    };

    return {
      users,
      selected,
      loading,
      handleSubmit,
    };
  },
};
</script>
