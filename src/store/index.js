import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    logout(state) {
      state.user = null;
    },
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('logout');
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    isRH: (state) => state.user?.role === 'RH',
    isPlaneacion: (state) => state.user?.role === 'planning',
    isDesarrollador: (state) => state.user?.role === 'developer',
    isTester: (state) => state.user?.role === 'tester',
  },
});