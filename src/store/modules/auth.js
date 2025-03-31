import { login, logout } from '@/api/auth';
import { ROLES } from '@/utils/constants';

const state = () => ({
  token: localStorage.getItem('token') || null,
  user: null,
  isAuthenticated: false,
});

const getters = {
  userRole: (state) => ROLES[state.user?.role] || null,
  isLoggedIn: (state) => !!state.token,
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
    localStorage.setItem('token', token);
  },
  SET_USER(state, user) {
    state.user = user;
    state.isAuthenticated = true;
    localStorage.setItem('user', JSON.stringify(user)); 
  },
  CLEAR_AUTH(state) {
    state.token = null;
    state.user = null;
    state.isAuthenticated = false;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
};

const actions = {
  async login({ commit }, { email, password }) {
    const { token, user } = await login(email, password);
    commit('SET_TOKEN', token);
    commit('SET_USER', user);
  },

  async logout({ commit }) {
    // await logout();
    commit('CLEAR_AUTH');
  },

  async restoreSession({ commit }) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !user) return;
    commit('SET_TOKEN', token);
    commit('SET_USER', user);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
