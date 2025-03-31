import { getAllTasks, createTask, updateTask, deleteTask, updateTaskStatus } from '@/api/tasks';
import { TASK_STATUS } from '@/utils/constants';
import store from '@/store';

const state = () => ({
  tasks: [],
  loading: false,
  error: null,
});

const mutations = {
  SET_TASKS(state, tasks) {
    state.tasks = tasks;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

const actions = {
  async fetchTasks({ commit }) {
    commit('SET_LOADING', true);
    try {
      await store.dispatch('projects/fetchProjects');
  
      const { tasks } = await getAllTasks();
      const projectsMap = store.getters['projects/allProjects'].reduce((acc, p) => {
        acc[p.id] = p;
        return acc;
      }, {});
  
      const transformedTasks = tasks.map(task => ({
        ...task,
        statusLabel: TASK_STATUS[task.status] || 'desconocido',
        project: projectsMap[task.project_id] || null,
      }));
  
      commit('SET_TASKS', transformedTasks);
    } catch (err) {
      commit('SET_ERROR', 'Error al obtener tareas');
    } finally {
      commit('SET_LOADING', false);
    }
  },
  

  async createTask(_, data) {
    return await createTask(data);
  },

  async updateTask(_, { id, data }) {
    return await updateTask(id, data);
  },

  async deleteTask(_, id) {
    return await deleteTask(id);
  },

  async changeTaskStatus(_, { id, status }) {
    return await updateTaskStatus(id, status);
  },
};

const getters = {
  allTasks: state => state.tasks,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
