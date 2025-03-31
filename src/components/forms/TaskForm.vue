<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Proyecto</label>
        <select v-model="form.project_id" class="w-full border p-2 rounded" required>
          <option disabled value="">Selecciona un proyecto</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
      </div>
  
      <div>
        <label class="block text-sm font-medium text-gray-700">Título</label>
        <input
          v-model="form.title"
          type="text"
          class="w-full border p-2 rounded"
          required
        />
      </div>
  
      <div>
        <label class="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          v-model="form.description"
          class="w-full border p-2 rounded"
          rows="3"
        ></textarea>
      </div>
  
      <div>
        <label class="block text-sm font-medium text-gray-700">Estado</label>
        <select v-model="form.status" class="w-full border p-2 rounded" required>
          <option value="1">En proceso</option>
          <option value="2">Finalizada</option>
          <option value="3">En pruebas</option>
          <option value="4">Bug</option>
          <option value="5">En espera de asignación</option>
        </select>
      </div>
  
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Usuarios asignados</label>
        <div class="max-h-40 overflow-y-auto border p-2 rounded">
          <label
            v-for="user in availableUsers"
            :key="user.id"
            class="block text-sm text-gray-700"
          >
            <input
              type="checkbox"
              :value="user.id"
              v-model="form.user_ids"
              class="mr-2"
            />
            {{ user.name }} ({{ user.role }})
          </label>
        </div>
      </div>
  
      <div class="text-right">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
          {{ isEdit ? 'Guardar cambios' : 'Crear tarea' }}
        </button>
      </div>
    </form>
  </template>
  
  <script>
  import { ref, computed, watch, onMounted } from 'vue';
  import { useStore } from 'vuex';
  
  export default {
    name: 'TaskForm',
    props: {
      initialData: {
        type: Object,
        default: () => ({}),
      },
    },
    emits: ['submit'],
    setup(props, { emit }) {
      const store = useStore();
  
      const form = ref({
        project_id: '',
        title: '',
        description: '',
        status: 5,
        user_ids: [],
      });
  
      const isEdit = computed(() => props.initialData && !!props.initialData.id);
  
      const availableUsers = computed(() => store.getters['users/assignableUsers']);
      const projects = computed(() => store.getters['projects/allProjects']);
  
      onMounted(() => {
        store.dispatch('users/fetchAssignableUsers');
        store.dispatch('projects/fetchProjects');
      });
  
      watch(
        () => props.initialData,
        (newData) => {
          const safeData = newData || {};
          form.value = {
            project_id: safeData.project_id || '',
            title: safeData.title || '',
            description: safeData.description || '',
            status: safeData.status || 5,
            user_ids: safeData.users?.map((u) => u.id) || [],
          };
        },
        { immediate: true }
      );
  
      const handleSubmit = async () => {
        try {
          const taskPayload = {
            title: form.value.title,
            description: form.value.description,
            status: form.value.status,
            project_id: form.value.project_id,
          };

          let taskId;

          if (isEdit.value) {
            await store.dispatch('tasks/updateTask', {
              id: props.initialData.id,
              data: taskPayload,
            });
            taskId = props.initialData.id;
          } else {
            await store.dispatch('tasks/createTask', taskPayload);

            await store.dispatch('tasks/fetchTasks');
            const allTasks = store.getters['tasks/allTasks'];
            taskId = allTasks[allTasks.length - 1]?.id;
          }

          if (taskId && form.value.user_ids.length > 0) {
            await store.dispatch('tasks/assignUsersToTask', {
              id: taskId,
              users: form.value.user_ids,
            });

            await store.dispatch('tasks/fetchTasks');
          }

          emit('submit');
        } catch (err) {
          console.error('Error al guardar la tarea:', err);
          alert('Error al guardar la tarea. Revisa los campos o contacta al administrador.');
        }
      };


  
      return {
        form,
        isEdit,
        handleSubmit,
        availableUsers,
        projects,
      };
    },
  };
  </script>
  