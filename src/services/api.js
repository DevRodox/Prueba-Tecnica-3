import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://web-production-93e2a.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
  withCredentials: true 
});

export default {
  login(email, password) {
    return apiClient.post('/login', { email, password });
  },

  getCurrentUser() {
    return apiClient.get('/user');
  },

  logout() {
    return apiClient.post('/logout');
  },

  getUsers() {
    return apiClient.get('/get-users');
  },

  getUsersPlanning() {
    return apiClient.get('/get-users-planning');
  },

  registerUser(userData) {
    return apiClient.post('/register', userData);
  },

  updateUser(id, userData) {
    return apiClient.put(`/update-user/${id}`, userData);
  },

  updatePassword(id, password) {
    return apiClient.post(`/update-password/${id}`, { password });
  },

  updateRole(id, role) {
    return apiClient.post(`/update-role/${id}`, { role });
  },

  deleteUser(id) {
    return apiClient.delete(`/delete-user/${id}`);
  },

  getProjects() {
    return apiClient.get('/get-projects');
  },

  createProject(projectData) {
    return apiClient.post('/create-project', projectData);
  },

  updateProject(id, projectData) {
    return apiClient.put(`/update-project/${id}`, projectData);
  },

  assignUsersToProject(id, users) {
    return apiClient.post(`/assign-users-project/${id}`, { users });
  },

  deleteProject(id) {
    return apiClient.delete(`/delete-project/${id}`);
  },

  getTasks() {
    return apiClient.get('/get-tasks');
  },

  getUserTask(userId) {
    return apiClient.get(`/get-user-task/${userId}`);
  },

  createTask(taskData) {
    return apiClient.post('/create-task', taskData);
  },

  updateTask(id, taskData) {
    return apiClient.put(`/update-task/${id}`, taskData);
  },

  updateTaskStatus(id, status) {
    return apiClient.put(`/update-status/${id}`, { status });
  },

  deleteTask(id) {
    return apiClient.delete(`/delete-task/${id}`);
  },
};