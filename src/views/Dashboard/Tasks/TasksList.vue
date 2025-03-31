<template>
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Tareas</h1>
        <button
          v-if="userRole === 'Planning'"
          @click="openCreateModal"
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Crear tarea
        </button>
      </div>
  
      <div v-if="loading" class="text-gray-500">Cargando tareas...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else>
        <table class="w-full bg-white shadow rounded overflow-hidden">
          <thead class="bg-gray-100 text-left text-sm uppercase">
            <tr>
              <th class="px-4 py-2">Título</th>
              <th class="px-4 py-2">Proyecto</th>
              <th class="px-4 py-2">Estado</th>
              <th class="px-4 py-2">Usuarios</th>
              <th class="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="task in tasks"
              :key="task.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="px-4 py-2">{{ task.title }}</td>
              <td>{{ task.project?.name || 'Sin proyecto' }}</td>
              <td class="px-4 py-2 capitalize">
                <div v-if="canChangeStatus">
                  <select
                    v-model="task.status"
                    @change="changeStatus(task)"
                    class="border p-1 text-sm rounded"
                  >
                    <option value="1">En proceso</option>
                    <option value="2">Finalizada</option>
                    <option value="3">En pruebas</option>
                    <option value="4">Bug</option>
                    <option value="5">En espera de asignación</option>
                  </select>
                </div>
                <div v-else>
                  {{ task.statusLabel }}
                </div>
              </td>
              <td class="px-4 py-2">
                <ul class="text-sm list-disc list-inside text-gray-600">
                  <li v-for="user in task.users" :key="user.id">
                    {{ user.name }} ({{ user.roleLabel || 'Sin rol' }})
                  </li>
                </ul>
              </td>
              <td class="px-4 py-2 text-center flex justify-center gap-2 flex-wrap">
                <button
                  v-if="userRole === 'Planning'"
                  @click="openEditModal(task)"
                  class="text-blue-600 text-sm hover:underline"
                >
                  Editar
                </button>
                <button
                  v-if="userRole === 'Planning'"
                  @click="handleDelete(task.id)"
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
            {{ editingTask ? 'Editar tarea' : 'Crear nueva tarea' }}
          </h2>
  
          <TaskForm :initialData="editingTask" @submit="handleFormSubmit" />
  
          <button
            @click="closeModal"
            class="absolute top-2 right-3 text-gray-600 text-xl hover:text-black"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed, ref, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import TaskForm from '@/components/forms/TaskForm.vue';
  
  export default {
    name: 'TasksList',
    components: { TaskForm },
    setup() {
      const store = useStore();
  
      const tasks = computed(() => store.getters['tasks/allTasks']);
      const loading = computed(() => store.state.tasks.loading);
      const error = computed(() => store.state.tasks.error);
      const userRole = computed(() => store.getters['auth/userRole']);
      const canChangeStatus = computed(() =>
        ['Developer', 'Tester', 'Planning'].includes(userRole.value)
      );
  
      const showModal = ref(false);
      const editingTask = ref(null);
  
      const fetchTasks = () => store.dispatch('tasks/fetchTasks');
  
      onMounted(() => {
        fetchTasks();
      });
  
      const openCreateModal = () => {
        editingTask.value = null;
        showModal.value = true;
      };
  
      const openEditModal = (task) => {
        editingTask.value = task;
        showModal.value = true;
      };
  
      const closeModal = () => {
        editingTask.value = null;
        showModal.value = false;
      };
  
      const handleFormSubmit = async (formData) => {
        try {
          if (editingTask.value) {
            await store.dispatch('tasks/updateTask', {
              id: editingTask.value.id,
              data: formData,
            });
          } else {
            await store.dispatch('tasks/createTask', formData);
          }
          await fetchTasks();
          closeModal();
        } catch (err) {
          alert('Error al guardar tarea');
        }
      };
  
      const handleDelete = async (id) => {
        if (confirm('¿Eliminar esta tarea?')) {
          await store.dispatch('tasks/deleteTask', id);
          await fetchTasks();
        }
      };
  
      const changeStatus = async (task) => {
        try {
          await store.dispatch('tasks/changeTaskStatus', {
            id: task.id,
            status: task.status,
          });
        } catch (err) {
          alert('Error al cambiar el estado de la tarea');
        }
      };
  
      return {
        tasks,
        loading,
        error,
        userRole,
        canChangeStatus,
        showModal,
        editingTask,
        openCreateModal,
        openEditModal,
        closeModal,
        handleFormSubmit,
        handleDelete,
        changeStatus,
        fetchTasks,
      };
    },
  };
  </script>
  