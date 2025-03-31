import {
    getAllProjects,
    createProject,
    updateProject,
    deleteProject,
    assignUsersToProject,
  } from '@/api/projects';
  import { PROJECT_STATUS } from '@/utils/constants';
  
  const state = () => ({
    projects: [],
    loading: false,
    error: null,
  });
  
  const mutations = {
    SET_PROJECTS(state, projects) {
      state.projects = projects;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  };
  
  const actions = {
    async fetchProjects({ commit }) {
      commit('SET_LOADING', true);
      try {
        const { projects } = await getAllProjects();
        const transformedProjects = projects.map(project => ({
          ...project,
          statusLabel: PROJECT_STATUS[project.status],
        }));
        commit('SET_PROJECTS', transformedProjects);
      } catch (err) {
        commit('SET_ERROR', 'Error al obtener proyectos');
      } finally {
        commit('SET_LOADING', false);
      }
    },
  
    async createProject(_, data) {
      return await createProject(data);
    },
  
    async updateProject(_, { id, data }) {
      return await updateProject(id, data);
    },
  
    async deleteProject(_, id) {
      return await deleteProject(id);
    },
  
    async assignUsers(_, { id, users }) {
      return await assignUsersToProject(id, users);
    },
  };
  
  const getters = {
    allProjects: (state) => state.projects,
  };
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
  };
  