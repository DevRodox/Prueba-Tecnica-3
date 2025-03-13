<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <div class="container mx-auto p-4 max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
      <h1 class="text-xl sm:text-2xl font-bold mb-4">Users</h1>

      <button
        @click="openModal('create')"
        class="bg-green-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded mb-4"
      >
        Create User
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
              <th class="py-2 px-2 sm:px-4 border-b">Last Name</th>
              <th class="py-2 px-2 sm:px-4 border-b">Email</th>
              <th class="py-2 px-2 sm:px-4 border-b">Role</th>
              <th class="py-2 px-2 sm:px-4 border-b">Created At</th>
              <th class="py-2 px-2 sm:px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td class="py-2 px-2 sm:px-4 border-b">{{ user.name }}</td>
              <td class="py-2 px-2 sm:px-4 border-b">{{ user.last_name }}</td>
              <td class="py-2 px-2 sm:px-4 border-b">{{ user.email }}</td>
              <td class="py-2 px-2 sm:px-4 border-b">{{ user.role }}</td>
              <td class="py-2 px-2 sm:px-4 border-b">{{ formatDate(user.created_at) }}</td>
              <td class="py-2 px-2 sm:px-4 border-b">
                <button
                  @click="openModal('edit', user)"
                  class="bg-blue-500 text-white px-1 py-1 sm:px-2 sm:py-1 rounded"
                >
                  Edit
                </button>
                <button
                  @click="deleteUser(user.id)"
                  class="bg-red-500 text-white px-1 py-1 sm:px-2 sm:py-1 rounded ml-1 sm:ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <CreateEditUserModal
        v-if="isModalOpen"
        :isOpen="isModalOpen"
        :mode="modalMode"
        :user="selectedUser"
        @close="closeModal"
        @reload-users="reloadUsers"
        class="fixed inset-0 flex items-center justify-center p-4"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../../services/api';
import CreateEditUserModal from '@/components/users/CreateEditUserModal.vue';
import Navbar from '@/components/shared/Navbar.vue';

export default {
  components: { CreateEditUserModal, Navbar },
  setup() {
    const users = ref([]);
    const isModalOpen = ref(false);
    const modalMode = ref('create');
    const selectedUser = ref(null);
    const isLoading = ref(true);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

    const fetchUsers = async () => {
      try {
        const response = await api.getUsers();
        if (response.data) {
          users.value = response.data.users;
        } else {
          console.error("Error fetching users:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const openModal = (mode, user = null) => {
      modalMode.value = mode;
      selectedUser.value = user;
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
      selectedUser.value = null;
    };

    const deleteUser = async (userId) => {
      try {
        await api.deleteUser(userId);
        await fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    };

    const reloadUsers = async () => {
      isLoading.value = true; 
      await fetchUsers();
    };

    onMounted(fetchUsers);

    return {
      users,
      isModalOpen,
      modalMode,
      selectedUser,
      isLoading,
      formatDate,
      openModal,
      closeModal,
      deleteUser,
      reloadUsers,
    };
  },
};
</script>