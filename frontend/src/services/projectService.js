import axiosInstance from './axiosInstance';

const getAll = async () => {
  const response = await axiosInstance.get('/api/proyectos');
  return response.data;
};

const getById = async (id) => {
  const response = await axiosInstance.get(`/api/proyectos/${id}`);
  return response.data;
};

const create = async (projectData) => {
  const response = await axiosInstance.post('/api/proyectos', projectData);
  return response.data;
};

const update = async (id, projectData) => {
  const response = await axiosInstance.put(`/api/proyectos/${id}`, projectData);
  return response.data;
};

const getMembers = async (id) => {
  const response = await axiosInstance.get(`/api/proyectos/${id}/miembros`);
  return response.data;
};

const addMember = async (id, usuario_id) => {
  const response = await axiosInstance.post(`/api/proyectos/${id}/miembros`, { usuario_id });
  return response.data;
};

export default {
  getAll,
  getById,
  create,
  update,
  getMembers,
  addMember
};