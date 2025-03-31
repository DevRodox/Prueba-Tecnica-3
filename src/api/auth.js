import api from './index';

export const login = async (email, password) => {
  const res = await api.post('/login', { email, password });
  return res.data; 
};

export const logout = async () => {
  // await api.post('/logout');
  localStorage.removeItem('token');
};

export const fetchUserInfo = async () => {
  const res = await api.get('/auth/me');
  return res.data; 
};
