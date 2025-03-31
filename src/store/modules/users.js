import {
  getAllUsers,
  registerUser,
  updateUser,
  updateUserRole,
  updatePassword,
  deleteUser,
  getUsersToPlanning,
} from '@/api/users';
import { ROLES } from '@/utils/constants';

const state = () => ({
  users: [],
  assignableUsers: [],
  loading: false,
  error: null,
});

const mutations = {
  SET_USERS(state, users) {
    state.users = users;
  },
  SET_ASSIGNABLE_USERS(state, users) {
    state.assignableUsers = users;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

const actions = {
  async fetchUsers({ commit }) {
    commit('SET_LOADING', true);
    try {
      const { users } = await getAllUsers();
      const transformedUsers = users.map(user => ({
                ...user,
                role: ROLES[user.role],
              }));

      commit('SET_USERS', transformedUsers);
    } catch (err) {
      commit('SET_ERROR', 'Error al obtener usuarios');
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async fetchAssignableUsers({ commit }) {
    try {
      const { users } = await getUsersToPlanning();
      commit('SET_ASSIGNABLE_USERS', users);
    } catch (err) {
      commit('SET_ERROR', 'Error al obtener usuarios asignables');
    }
  },

  async createUser(_, userData) {
    return await registerUser(userData);
  },

  async editUser(_, { id, updatedData }) {
    return await updateUser(id, updatedData);
  },

  async changeUserRole(_, { id, role }) {
    return await updateUserRole(id, role);
  },

  async changePassword(_, { id, password }) {
    return await updatePassword(id, password);
  },

  async removeUser(_, id) {
    return await deleteUser(id);
  },
};

const getters = {
  allUsers: (state) => state.users,
  assignableUsers: (state) => state.assignableUsers,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
