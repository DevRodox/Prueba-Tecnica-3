<template>
    <form @submit.prevent="handleSubmit" class="space-y-4" autocomplete="off">
      <div>
        <label class="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full border p-2 rounded"
          required
        />
      </div>
  
      <div>
        <label class="block text-sm font-medium text-gray-700">Correo</label>
        <input
          v-model="form.email"
          type="email"
          class="w-full border p-2 rounded"
          required
          :disabled="isEdit"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Apellido paterno</label>
        <input
          v-model="form.last_name"
          type="text"
          class="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Apellido materno</label>
        <input
          v-model="form.second_last_name"
          type="text"
          class="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Rol</label>
        <select v-model="form.role" class="w-full border p-2 rounded" required>
          <option disabled value="">Selecciona un rol</option>
          <option value="4">RH</option>
          <option value="2">Planning</option>
          <option value="1">Developer</option>
          <option value="3">Tester</option>
        </select>
      </div>
  
      <div v-if="!isEdit">
        <label class="block text-sm font-medium text-gray-700">Contraseña</label>
        <input
          v-model="form.password"
          type="password"
          class="w-full border p-2 rounded"
          required
        />
      </div>
  
      <div class="text-right">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
          {{ isEdit ? 'Guardar cambios' : 'Crear usuario' }}
        </button>
      </div>
    </form>
  </template>
  
  <script>
  import { ref, watch, computed } from 'vue';
  
  export default {
    name: 'UserForm',
    props: {
      initialData: {
        type: Object,
        default: () => ({}),
      },
    },
    setup(props, { emit }) {
      const form = ref({
        name: '',
        last_name: '',
        second_last_name: '',
        email: '',
        role: '',
        password: '',
      });
  
      const isEdit = computed(() => props.initialData && !!props.initialData.id);

      watch(
        () => props.initialData,
        (newData) => {
          const safeData = newData || {};
          form.value = {
            name: safeData.name || '',
            last_name: safeData.last_name || '',
            second_last_name: safeData.second_last_name || '',
            email: safeData.email || '',
            role: safeData.role || '',
            password: '',
          };
        },
        { immediate: true }
      );

  
      const handleSubmit = () => {
        emit('formSubmit', { ...form.value });
      };
  
      return {
        form,
        isEdit,
        handleSubmit,
      };
    },
  };
  </script>
  