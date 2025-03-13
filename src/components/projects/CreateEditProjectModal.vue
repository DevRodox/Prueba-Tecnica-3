<template>
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">{{ mode === 'create' ? 'Create Project' : 'Edit Project' }}</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label class="block text-gray-700">Name</label>
          <input
            v-model="projectData.name"
            type="text"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Description</label>
          <textarea
            v-model="projectData.description"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Status</label>
          <select
            v-model="projectData.status"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="1">En desarrollo</option>
            <option value="2">Finalizado</option>
            <option value="3">Cancelado</option>
            <option value="4">En Pausa</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Assign Users</label>
          <div v-if="isLoading" class="flex justify-center items-center h-20">
            <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div v-else class="user-list">
            <div v-for="user in users" :key="user.id" class="flex items-center">
              <input
                type="checkbox"
                :value="user.id"
                v-model="projectData.assignedUsers"
                class="mr-2"
              />
              <span>{{ user.name }} ({{ user.email }})</span>
            </div>
          </div>
        </div>
        <div class="flex justify-end">
          <button
            type="button"
            @click="closeModal"
            class="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {{ mode === 'create' ? 'Create' : 'Update' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import api from '../../services/api';

export default {
  props: {
    isOpen: { type: Boolean, required: true },
    mode: { type: String, default: 'create' },
    project: { type: Object, default: null },
  },
  emits: ['close', 'reload-projects'],
  setup(props, { emit }) {
    const store = useStore();
    const projectData = ref({
      name: '',
      description: '',
      status: '1',
      assignedUsers: [],
    });

    const users = ref([]);
    const isLoading = ref(true); 

    const currentUser = computed(() => store.getters.currentUser);
    const userId = currentUser.value?.id;

    const fetchUsers = async () => {
      try {
        const response = await api.getUsersPlanning();
        if (response.data) {
          users.value = response.data.users;
        } else {
          console.error("Error fetching users:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        isLoading.value = false;
      }
    };

    watch(
      () => props.project,
      (newProject) => {
        if (props.mode === 'edit' && newProject) {
          projectData.value = {
            name: newProject.name,
            description: newProject.description,
            status: newProject.status.toString(),
            assignedUsers: newProject.users.map(user => user.id),
          };
        }
      },
      { immediate: true }
    );

    const submitForm = async () => {
      try {
        const payload = {
          name: projectData.value.name,
          description: projectData.value.description,
          status: parseInt(projectData.value.status),
          user_id: userId,
        };

        if (props.mode === 'create') {
          const createResponse = await api.createProject(payload);
          const projectId = createResponse.data.project.id;

          if (projectData.value.assignedUsers.length > 0) {
            await api.assignUsersToProject(projectId, projectData.value.assignedUsers);
          }
        } else if (props.mode === 'edit') {
          await api.updateProject(props.project.id, payload);

          if (projectData.value.assignedUsers.length > 0) {
            await api.assignUsersToProject(props.project.id, projectData.value.assignedUsers);
          }
        }

        emit('reload-projects');
        closeModal();
      } catch (error) {
        console.error("Error submitting form:", error.response?.data || error);
      }
    };

    const closeModal = () => {
      emit('close');
    };

    onMounted(fetchUsers);

    return { projectData, users, isLoading, submitForm, closeModal };
  },
};
</script>

<style scoped>
.user-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem; 
  padding: 0.5rem;
}
</style>