import api from './index';

export const getAllUsers = async () => {
  const res = await api.get('/users/get-users');
  console.log(res.data)
  return res.data;
};

export const registerUser = async (userData) => {
  console.log(userData);
  const res = await api.post('/users/register', userData);
  return res.data;
};

export const updateUser = async (id, updatedData) => {
  const res = await api.put(`/users/update/${id}`, updatedData);
  return res.data;
};

export const updateUserRole = async (id, role) => {
  const res = await api.post(`/users/update-role/${id}`, { role });
  return res.data;
};

export const updatePassword = async (id, password) => {
  const res = await api.put(`/users/update-password/${id}`, { password });
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.put(`/users/delete-user/${id}`);
  return res.data;
};

export const getUsersToPlanning = async () => {
  const res = await api.get('/users/get-users-planning');
  return res.data;
};

