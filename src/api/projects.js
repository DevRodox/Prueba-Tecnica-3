import api from './index';

export const getAllProjects = async () => {
  const res = await api.get('/projects');
  console.log(res.data);
  return res.data;
};

export const createProject = async (projectData) => {
  const res = await api.post('/projects/create', projectData);
  return res.data;
};

export const updateProject = async (id, data) => {
  const res = await api.put(`/projects/update/${id}`, data);
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await api.delete(`/projects/delete/${id}`);
  return res.data;
};

export const assignUsersToProject = async (projectId, users) => {
  const res = await api.post(`/projects/assign-users/${projectId}`, {
    users,
  });
  return res.data;
};
