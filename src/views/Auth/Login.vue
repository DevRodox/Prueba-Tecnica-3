<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Correo</label>
          <input
            v-model="email"
            type="email"
            class="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            v-model="password"
            type="password"
            class="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          :disabled="loading"
        >
          {{ loading ? 'Entrando...' : 'Ingresar' }}
        </button>

        <p v-if="error" class="text-red-600 mt-4 text-sm text-center">
          {{ error }}
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    const store = useStore();
    const router = useRouter();

    const email = ref('');
    const password = ref('');
    const error = ref('');
    const loading = ref(false);

    const handleLogin = async () => {
      error.value = '';
      loading.value = true;
      try {
        await store.dispatch('auth/login', { email: email.value, password: password.value });
        router.push('/home');
      } catch (err) {
        error.value = 'Correo o contraseña incorrectos';
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      password,
      error,
      loading,
      handleLogin,
    };
  },
};
</script>
