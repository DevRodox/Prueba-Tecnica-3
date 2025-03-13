<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="container mx-auto p-4 max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
      <h1 class="text-xl sm:text-2xl font-bold mb-4">Tasks</h1>

      <button
        v-if="isPlaneacion"
        @click="openModal('create')"
        class="bg-green-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded mb-4"
      >
        Create Task
      </button>

      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <svg class="animate-spin h-8 w-8 sm:h-12 sm:w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full bg-white mb-8">
          <thead>
            <tr>
              <th class="py-2 px-2 sm:px-4 border-b">Title</th>
              <th class="py-2 px-2 sm:px-4 border-b">Description</th>
              <th class="py-2 px-2 sm:px-4 border-b">Status</th>
              <th class="py-2 px-2 sm:px-4 border-b">Project</th>
              <th class="py-2 px-2 sm:px-4 border-b">Created At</th>
              <th class="py-2 px-2 sm:px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.id">
              <td class="py-2 px-2 sm:px-4 border-b">{{ task.title }}</td>
              <td class="py-2 px-2 sm:px-4 border-b">{{ task.description }}</td>
              <td class="py-2 px-2 sm:px-4 border-b">{{ getStatusText(task.status) }}</td>
              <td class="py-2 px-2 sm:px-4 border-b">{{ getProjectTitle(task.project_id) }}</td>
              <td class="py-2 px-2 sm:px-4 border-b">{{ formatDate(task.created_at) }}</td>
              <td class="py-2 px-2 sm:px-4 border-b">
                <button
                  v-if="!isRH"
                  @click="openModal('edit', task)"
                  class="bg-blue-500 text-white px-1 py-1 sm:px-2 sm:py-1 rounded"
                >
                  {{ isPlaneacion ? 'Edit' : 'Update Status' }}
                </button>
                <button
                  v-if="isPlaneacion"
                  @click="deleteTask(task.id)"
                  class="bg-red-500 text-white px-1 py-1 sm:px-2 sm:py-1 rounded ml-1 sm:ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <CreateEditTaskModal
        v-if="isModalOpen"
        :isOpen="isModalOpen"
        :mode="modalMode"
        :task="selectedTask"
        :projects="projects"
        @close="closeModal"
        @reload-tasks="reloadTasks"
        class="fixed inset-0 flex items-center justify-center p-4"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import api from '../../services/api';
import CreateEditTaskModal from '@/components/tasks/CreateEditTaskModal.vue';
import Navbar from '@/components/shared/Navbar.vue';

export default {
  components: { CreateEditTaskModal, Navbar },
  setup() {
    const store = useStore();
    const tasks = ref([]);
    const projects = ref([]);
    const isPlaneacion = computed(() => store.getters.isPlaneacion);
    const isRH = computed(() => store.getters.isRH);
    const isDesarrollador = computed(() => store.getters.isDesarrollador);
    const isTester = computed(() => store.getters.isTester);
    const currentUser = computed(() => store.getters.currentUser);
    const isModalOpen = ref(false);
    const modalMode = ref('create');
    const selectedTask = ref(null);
    const isLoading = ref(true);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

    const getStatusText = (status) => {
      const statusMap = {
        1: 'En proceso',
        2: 'Finalizada',
        3: 'En pruebas',
        4: 'Bug',
        5: 'En espera de asignación',
      };
      return statusMap[status] || 'Unknown';
    };

    const getProjectTitle = (projectId) => {
      const project = projects.value.find((p) => p.id === projectId);
      return project ? project.name : 'Unknown Project';
    };

    const fetchTasks = async () => {
      try {
        let response;
        if (isPlaneacion.value) {
          response = await api.getTasks();
          tasks.value = response.data.tasks || response.data;
        } else if (isDesarrollador.value || isTester.value) {
          response = await api.getUserTask(currentUser.value.id);
          tasks.value = response.data.user.tasks || [];
        }

        if (!tasks.value) {
          console.error("Error fetching tasks:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await api.getProjects();
        if (response.data.success) {
          projects.value = response.data.projects;
        } else {
          console.error("Error fetching projects:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const openModal = (mode, task = null) => {
      modalMode.value = mode;
      selectedTask.value = task;
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
      selectedTask.value = null;
    };

    const deleteTask = async (taskId) => {
      try {
        await api.deleteTask(taskId);
        await fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    };

    const reloadTasks = async () => {
      isLoading.value = true;
      await fetchTasks();
    };

    onMounted(async () => {
      await fetchProjects();
      await fetchTasks();
    });

    return {
      tasks,
      projects,
      isPlaneacion,
      isRH,
      isModalOpen,
      modalMode,
      selectedTask,
      isLoading,
      formatDate,
      getStatusText,
      getProjectTitle,
      openModal,
      closeModal,
      deleteTask,
      reloadTasks,
    };
  },
};
</script>