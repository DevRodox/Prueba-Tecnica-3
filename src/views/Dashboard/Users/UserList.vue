<template>
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Usuarios registrados</h1>
        <button
          @click="openCreateModal"
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Crear usuario
        </button>
      </div>
  
      <div v-if="loading" class="text-gray-500">Cargando usuarios...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else>
        <table class="w-full bg-white shadow rounded overflow-hidden">
          <thead class="bg-gray-100 text-left text-sm uppercase">
            <tr>
              <th class="px-4 py-2">Nombre</th>
              <th class="px-4 py-2">Correo</th>
              <th class="px-4 py-2">Rol</th>
              <th class="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="px-4 py-2">{{ user.name }}</td>
              <td class="px-4 py-2">{{ user.email }}</td>
              <td class="px-4 py-2">{{ user.role }}</td>
              <td class="px-4 py-2 text-center flex justify-center gap-2 flex-wrap">
                <button
                  @click="openEditModal(user)"
                  class="text-blue-600 text-sm hover:underline"
                >
                  Editar
                </button>
                <button
                  @click="openPasswordModal(user.id)"
                  class="text-yellow-600 text-sm hover:underline"
                >
                  Cambiar contraseña
                </button>
                <button
                  @click="handleDelete(user.id)"
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
            {{ editingUser ? 'Editar usuario' : 'Crear nuevo usuario' }}
          </h2>
  
          <UserForm :initialData="editingUser" @formSubmit="handleFormSubmit" />
  
          <button
            @click="closeModal"
            class="absolute top-2 right-3 text-gray-600 text-xl hover:text-black"
          >
            &times;
          </button>
        </div>
      </div>
  
      <div
        v-if="showPasswordModal"
        class="fixed inset-0 bg-black/70 flex items-center justify-center z-20"
      >
        <ChangePasswordModal
          :userId="selectedUserId"
          @close="closePasswordModal"
          @success="fetchUsers"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { computed, ref, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import UserForm from '@/components/forms/UserForm.vue';
  import ChangePasswordModal from '@/components/forms/ChangePasswordModal.vue';
  
  export default {
    name: 'UsersList',
    components: {
      UserForm,
      ChangePasswordModal,
    },
    setup() {
      const store = useStore();
  
      const users = computed(() => store.getters['users/allUsers']);
      const loading = computed(() => store.state.users.loading);
      const error = computed(() => store.state.users.error);
  
      const showModal = ref(false);
      const showPasswordModal = ref(false);
      const editingUser = ref(null);
      const selectedUserId = ref(null);
  
      const fetchUsers = () => store.dispatch('users/fetchUsers');
  
      onMounted(() => {
        fetchUsers();
      });
  
      const openCreateModal = () => {
        editingUser.value = null;
        showModal.value = true;
      };
  
      const openEditModal = (user) => {
        editingUser.value = user;
        showModal.value = true;
      };
  
      const closeModal = () => {
        showModal.value = false;
        editingUser.value = null;
      };
  
      const handleFormSubmit = async (formData) => {
        try {
          if (editingUser.value) {
            await store.dispatch('users/editUser', {
              id: editingUser.value.id,
              updatedData: formData,
            });
          } else {
            await store.dispatch('users/createUser', formData);
          }
          await fetchUsers();
          closeModal();
        } catch (err) {
          alert('Error al guardar usuario');
        }
      };
  
      const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
          await store.dispatch('users/removeUser', id);
          await fetchUsers();
        }
      };
  
      const openPasswordModal = (userId) => {
        selectedUserId.value = userId;
        showPasswordModal.value = true;
      };
  
      const closePasswordModal = () => {
        showPasswordModal.value = false;
        selectedUserId.value = null;
      };
  
      return {
        users,
        loading,
        error,
        showModal,
        showPasswordModal,
        editingUser,
        selectedUserId,
        openCreateModal,
        openEditModal,
        closeModal,
        openPasswordModal,
        closePasswordModal,
        handleFormSubmit,
        handleDelete,
        fetchUsers,
      };
    },
  };
  </script>
  