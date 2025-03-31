<template>
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
      <h2 class="text-lg font-bold mb-4">Cambiar contraseña</h2>
  
      <form @submit.prevent="handleSubmit">
        <label class="block text-sm font-medium text-gray-700">Nueva contraseña</label>
        <input
          v-model="password"
          type="password"
          class="w-full border p-2 rounded mt-1"
          required
        />
  
        <div class="text-right mt-4">
          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Guardar
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
  import { ref } from 'vue';
  
  export default {
    name: 'ChangePasswordModal',
    props: {
      userId: {
        type: Number,
        required: true,
      },
    },
    emits: ['close', 'success'],
    setup(props, { emit }) {
      const password = ref('');
  
      const handleSubmit = async () => {
        console.log('aa');
        try {
          const { updatePassword } = await import('@/api/users');
          await updatePassword(props.userId, password.value);
          emit('success');
          emit('close');
        } catch (error) {
          alert('Error al cambiar contraseña', error);
        }
      };
  
      return {
        password,
        handleSubmit,
      };
    },
  };
  </script>
  