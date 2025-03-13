<template>
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">{{ mode === 'create' ? 'Create Task' : 'Edit Task' }}</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4" v-if="isPlaneacion">
          <label class="block text-gray-700">Title</label>
          <input
            v-model="taskData.title"
            type="text"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="!isPlaneacion"
            required
          />
        </div>

        <div class="mb-4" v-if="isPlaneacion">
          <label class="block text-gray-700">Description</label>
          <textarea
            v-model="taskData.description"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="!isPlaneacion"
            required
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Status</label>
          <select
            v-model="taskData.status"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="1">En proceso</option>
            <option value="2">Finalizada</option>
            <option value="3">En pruebas</option>
            <option value="4">Bug</option>
            <option value="5">En espera de asignación</option>
          </select>
        </div>

        <div class="mb-4" v-if="isPlaneacion">
          <label class="block text-gray-700">Project</label>
          <select
            v-model="taskData.project_id"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="!isPlaneacion"
            required
          >
            <option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </option>
          </select>
        </div>

        <div class="mb-4" v-if="mode === 'edit' && isPlaneacion">
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
                v-model="taskData.assignedUsers"
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
    task: { type: Object, default: null },
    projects: { type: Array, default: () => [] },
  },
  emits: ['close', 'reload-tasks'],
  setup(props, { emit }) {
    const store = useStore();
    const taskData = ref({
      title: '',
      description: '',
      status: '5',
      project_id: '',
      assignedUsers: [],
    });

    const users = ref([]);
    const isLoading = ref(true);
    const isPlaneacion = computed(() => store.getters.isPlaneacion);

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
      () => props.task,
      (newTask) => {
        if (props.mode === 'edit' && newTask) {
          taskData.value = {
            title: newTask.title,
            description: newTask.description,
            status: newTask.status.toString(),
            project_id: newTask.project_id,
            assignedUsers: newTask.users?.map(user => user.id) || [],
          };
        }
      },
      { immediate: true }
    );

    const submitForm = async () => {
      try {
        if (props.mode === 'create') {
          if (!isPlaneacion.value) {
            console.error("Solo Planeación puede crear tareas.");
            return;
          }
          const payload = {
            title: taskData.value.title,
            description: taskData.value.description,
            status: parseInt(taskData.value.status),
            project_id: parseInt(taskData.value.project_id),
          };
          await api.createTask(payload);
        } else if (props.mode === 'edit') {
          if (isPlaneacion.value) {
            const payload = {
              title: taskData.value.title,
              description: taskData.value.description,
              status: parseInt(taskData.value.status),
              project_id: parseInt(taskData.value.project_id),
              users: taskData.value.assignedUsers,
            };
            await api.updateTask(props.task.id, payload);
          } else {
            const status = parseInt(taskData.value.status);
            await api.updateTaskStatus(props.task.id, status);
          }
        }
        emit('reload-tasks');
        closeModal();
      } catch (error) {
        console.error("Error submitting form:", error.response?.data || error);
      }
    };

    const closeModal = () => {
      emit('close');
    };

    onMounted(fetchUsers);

    return { taskData, users, isLoading, submitForm, closeModal, isPlaneacion };
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