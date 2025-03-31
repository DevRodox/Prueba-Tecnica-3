<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Proyectos</h1>
      <button
        @click="openCreateModal"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Crear proyecto
      </button>
    </div>

    <div v-if="loading" class="text-gray-500">Cargando proyectos...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <table class="w-full bg-white shadow rounded overflow-hidden">
        <thead class="bg-gray-100 text-left text-sm uppercase">
          <tr>
            <th class="px-4 py-2">Nombre</th>
            <th class="px-4 py-2">Descripción</th>
            <th class="px-4 py-2">Estado</th>
            <th class="px-4 py-2">Usuarios</th>
            <th class="px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="project in projects"
            :key="project.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-2">{{ project.name }}</td>
            <td class="px-4 py-2">{{ project.description }}</td>
            <td class="px-4 py-2 capitalize">{{ project.statusLabel }}</td>
            <td class="px-4 py-2 text-sm">
              <ul class="list-disc list-inside text-gray-600">
                <li v-for="user in project.users" :key="user.id">
                  {{ user.name }}
                </li>
              </ul>
            </td>
            <td class="px-4 py-2 text-center flex justify-center gap-2 flex-wrap">
              <button
                @click="openEditModal(project)"
                class="text-blue-600 text-sm hover:underline"
              >
                Editar
              </button>
              <button
                @click="openAssignModal(project.id)"
                class="text-purple-600 text-sm hover:underline"
              >
                Asignar usuarios
              </button>
              <button
                @click="handleDelete(project.id)"
                class="text-red-600 text-sm hover:underline"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-20"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <h2 class="text-lg font-bold mb-4">
          {{ editingProject ? 'Editar proyecto' : 'Crear nuevo proyecto' }}
        </h2>

        <ProjectForm :initialData="editingProject" @submit="handleFormSubmit" />

        <button
          @click="closeModal"
          class="absolute top-2 right-3 text-gray-600 text-xl hover:text-black"
        >
          &times;
        </button>
      </div>
    </div>

    <div
      v-if="showAssignModal"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-20"
    >
      <AssignUsersModal
        :projectId="selectedProjectId"
        @close="closeAssignModal"
        @success="fetchProjects"
      />
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import ProjectForm from '@/components/forms/ProjectForm.vue';
import AssignUsersModal from '@/components/forms/AssignUsersModal.vue';

export default {
  name: 'ProjectsList',
  components: {
    ProjectForm,
    AssignUsersModal,
  },
  setup() {
    const store = useStore();

    const projects = computed(() => store.getters['projects/allProjects']);
    const loading = computed(() => store.state.projects.loading);
    const error = computed(() => store.state.projects.error);

    const showModal = ref(false);
    const editingProject = ref(null);

    const showAssignModal = ref(false);
    const selectedProjectId = ref(null);

    const fetchProjects = () => store.dispatch('projects/fetchProjects');

    onMounted(() => {
      fetchProjects();
    });

    const openCreateModal = () => {
      editingProject.value = null;
      showModal.value = true;
    };

    const openEditModal = (project) => {
      editingProject.value = project;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      editingProject.value = null;
    };

    const handleFormSubmit = async (formData) => {
      try {
        if (editingProject.value) {
          await store.dispatch('projects/updateProject', {
            id: editingProject.value.id,
            data: formData,
          });
        } else {
          await store.dispatch('projects/createProject', formData);
        }
        await fetchProjects();
        closeModal();
      } catch (err) {
        alert('Error al guardar proyecto');
      }
    };

    const handleDelete = async (id) => {
      if (confirm('¿Eliminar este proyecto?')) {
        await store.dispatch('projects/deleteProject', id);
        await fetchProjects();
      }
    };

    const openAssignModal = (projectId) => {
      selectedProjectId.value = projectId;
      showAssignModal.value = true;
    };

    const closeAssignModal = () => {
      selectedProjectId.value = null;
      showAssignModal.value = false;
    };

    return {
      projects,
      loading,
      error,
      showModal,
      showAssignModal,
      editingProject,
      selectedProjectId,
      openCreateModal,
      openEditModal,
      closeModal,
      handleFormSubmit,
      handleDelete,
      openAssignModal,
      closeAssignModal,
      fetchProjects,
    };
  },
};
</script>
