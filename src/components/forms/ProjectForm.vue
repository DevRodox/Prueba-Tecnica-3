<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Nombre del proyecto</label>
        <input
          v-model="form.name"
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
          <option value="1">En desarrollo</option>
          <option value="2">Finalizado</option>
          <option value="3">Cancelado</option>
          <option value="4">En pausa</option>
        </select>
      </div>
  
      <div class="text-right">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
          {{ isEdit ? 'Guardar cambios' : 'Crear proyecto' }}
        </button>
      </div>
    </form>
  </template>
  
  <script>
  import { ref, watch, computed } from 'vue';
  
  export default {
    name: 'ProjectForm',
    props: {
      initialData: {
        type: Object,
        default: () => ({}),
      },
    },
    emits: ['submit'],
    setup(props, { emit }) {
      const form = ref({
        name: '',
        description: '',
        status: 1,
      });
  
      const isEdit = computed(() => props.initialData && !!props.initialData.id);
  
      watch(
        () => props.initialData,
        ( newData ) => {
          const safeData = newData || {};
          form.value = {
            name: safeData.name || '',
            description: safeData.description || '',
            status: safeData.status || 1,
          };
        },
        { immediate: true }
      );
  
      const handleSubmit = () => {
        emit('submit', { ...form.value });
      };
  
      return {
        form,
        isEdit,
        handleSubmit,
      };
    },
  };
  </script>
  