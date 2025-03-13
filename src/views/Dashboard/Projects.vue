<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="container mx-auto p-4 max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
      <h1 class="text-xl sm:text-2xl font-bold mb-4">Projects</h1>

      <button
        v-if="isPlaneacion"
        @click="openModal('create')"
        class="bg-green-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded mb-4"
      >
        Create Project
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
              <th class="py-2 px-2 sm:px-4 border-b">Name</th>
              <th class="py-2 px-2 sm:px-4 border-b">Description</th>
              <th class="py-2 px-2 sm:px-4 border-b">Created At</th>
              <th class="py-2 px-2 sm:px-4 border-b">Status</th>
              <th class="py-2 px-2 sm:px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in projects" :key="project.id">
              <td class="py-2 px-2 sm:px-4 border-b">{{ project.name }}</td>
              <td class="py-2 px-2 sm:px-4 border-b">{{ project.description }}</td>
              <td class="py-2 px-2 sm:px-4 border-b">{{ formatDate(project.created_at) }}</td>
              <td class="py-2 px-2 sm:px-4 border-b">{{ getStatusText(project.status) }}</td>
              <td class="py-2 px-2 sm:px-4 border-b">
                <button
                  v-if="isPlaneacion"
                  @click="openModal('edit', project)"
                  class="bg-blue-500 text-white px-1 py-1 sm:px-2 sm:py-1 rounded"
                >
                  Edit
                </button>
                <button
                  v-if="isPlaneacion"
                  @click="deleteProject(project.id)"
                  class="bg-red-500 text-white px-1 py-1 sm:px-2 sm:py-1 rounded ml-1 sm:ml-2"
                >
                  Delete
                </button>
                <button
                  @click="viewProjectDetails(project)"
                  class="bg-green-500 text-white px-1 py-1 sm:px-2 sm:py-1 rounded ml-1 sm:ml-2"
                >
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <CreateEditProjectModal
        v-if="isModalOpen"
        :isOpen="isModalOpen"
        :mode="modalMode"
        :project="selectedProject"
        @close="closeModal"
        @reload-projects="reloadProjects"
        class="fixed inset-0 flex items-center justify-center p-4"
      />

      <div v-if="selectedProjectDetails" class="bg-white p-4 rounded-lg shadow-md mt-4">
        <h2 class="text-xl font-bold mb-4">Project Details: {{ selectedProjectDetails.name }}</h2>
        <div class="mb-6">
          <p><strong>Description:</strong> {{ selectedProjectDetails.description }}</p>
          <p><strong>Status:</strong> {{ getStatusText(selectedProjectDetails.status) }}</p>
          <p><strong>Created At:</strong> {{ formatDate(selectedProjectDetails.created_at) }}</p>
        </div>
        <div class="mb-6">
          <h3 class="text-lg font-bold mb-2">Assigned Users</h3>
          <ul>
            <li v-for="user in selectedProjectDetails.users" :key="user.id" class="mb-1">
              {{ user.name }} ({{ user.email }})
            </li>
            <li v-if="selectedProjectDetails.users.length === 0">No users assigned.</li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-bold mb-2">Tasks</h3>
          <ul>
            <li v-for="task in selectedProjectDetails.tasks" :key="task.id" class="mb-1">
              <strong>{{ task.title }}</strong> - {{ task.description }} (Status: {{ task.status }})
            </li>
            <li v-if="selectedProjectDetails.tasks.length === 0">No tasks assigned.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import api from '../../services/api';
import CreateEditProjectModal from '@/components/projects/CreateEditProjectModal.vue';
import Navbar from '@/components/shared/Navbar.vue';

export default {
  components: { CreateEditProjectModal, Navbar },
  setup() {
    const store = useStore();
    const projects = ref([]);
    const selectedProjectDetails = ref(null);
    const isPlaneacion = computed(() => store.getters.isPlaneacion);
    const isModalOpen = ref(false);
    const modalMode = ref('create');
    const selectedProject = ref(null);
    const isLoading = ref(true);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

    const getStatusText = (status) => {
      const statusMap = {
        1: 'En desarrollo',
        2: 'Finalizado',
        3: 'Cancelado',
        4: 'En Pausa',
      };
      return statusMap[status] || 'Unknown';
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
      } finally {
        isLoading.value = false;
      }
    };

    const openModal = (mode, project = null) => {
      modalMode.value = mode;
      selectedProject.value = project;
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
      selectedProject.value = null;
    };

    const viewProjectDetails = (project) => {
      selectedProjectDetails.value = project;
    };

    const deleteProject = async (projectId) => {
      try {
        await api.deleteProject(projectId);
        await fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    };

    const reloadProjects = async () => {
      isLoading.value = true;
      await fetchProjects();
    };

    onMounted(fetchProjects);

    return {
      projects,
      selectedProjectDetails,
      isPlaneacion,
      isModalOpen,
      modalMode,
      selectedProject,
      isLoading,
      formatDate,
      getStatusText,
      openModal,
      closeModal,
      viewProjectDetails,
      deleteProject,
      reloadProjects,
    };
  },
};
</script>