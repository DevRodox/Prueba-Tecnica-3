<template>
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">{{ mode === 'create' ? 'Create User' : 'Edit User' }}</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label class="block text-gray-700">Name</label>
          <input
            v-model="userData.name"
            type="text"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Last Name</label>
          <input
            v-model="userData.last_name"
            type="text"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input
            v-model="userData.email"
            type="email"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="!isRH"
            required
          />
        </div>
        <div class="mb-4" v-if="isRH">
          <label class="block text-gray-700">Password</label>
          <input
            v-model="userData.password"
            type="password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :required="mode === 'create'"
          />
        </div>
        <div class="mb-4" v-if="isRH">
          <label class="block text-gray-700">Role</label>
          <select
            v-model="userData.role"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="RH">RH</option>
            <option value="developer">Developer</option>
            <option value="tester">Tester</option>
            <option value="planning">Planning</option>
          </select>
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
import { ref, watch, computed } from 'vue';
import { useStore } from 'vuex';
import api from '../../services/api';

export default {
  props: {
    isOpen: { type: Boolean, required: true },
    mode: { type: String, default: 'create' },
    user: { type: Object, default: null },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const store = useStore();
    const userData = ref({
      name: '',
      last_name: '',
      email: '',
      password: '',
      role: 'RH',
    });

    const isRH = computed(() => store.getters.isRH);

    watch(
      () => props.user,
      (newUser) => {
        if (props.mode === 'edit' && newUser) {
          userData.value = {
            name: newUser.name,
            last_name: newUser.last_name,
            email: newUser.email,
            password: '',
            role: newUser.role,
          };
        }
      },
      { immediate: true }
    );

    const submitForm = async () => {
      try {
        if (props.mode === 'create') {
          await api.registerUser(userData.value);
        } else if (props.mode === 'edit') {
          await api.updateUser(props.user.id, userData.value);
        }
        emit('close');
      } catch (error) {
        console.error("Error submitting form:", error.response?.data || error);
      }
    };

    const closeModal = () => {
      emit('close');
    };

    return { userData, submitForm, closeModal, isRH };
  },
};
</script>