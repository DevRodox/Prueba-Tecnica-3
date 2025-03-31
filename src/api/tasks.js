import api from './index';

export const getAllTasks = async () => {
  const res = await api.get('/tasks');
  console.log(res.data);
  return res.data;
};

export const createTask = async (taskData) => {
  const res = await api.post('/tasks/create', taskData);
  return res.data;
};

export const updateTask = async (id, taskData) => {
  const res = await api.put(`/tasks/update/${id}`, taskData);
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await api.delete(`/tasks/delete/${id}`);
  return res.data;
};

export const assignTasksToUser = async (userId, taskIds) => {
  const res = await api.post(`/tasks/assign-users/${userId}`, {
    tasks: taskIds,
  });
  return res.data;
};

export const updateTaskStatus = async (id, status) => {
  const res = await api.put(`/tasks/update-status/${id}`, {
    status,
  });
  return res.data;
};
