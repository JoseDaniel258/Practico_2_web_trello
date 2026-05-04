import axiosInstance from './axiosInstance';

const getByProject = async (proyectoId) => {
  const response = await axiosInstance.get(`/api/tickets/proyecto/${proyectoId}`);
  return response.data;
};

const getById = async (id) => {
  const response = await axiosInstance.get(`/api/tickets/${id}`);
  return response.data;
};

const create = async (ticketData) => {
  const response = await axiosInstance.post('/api/tickets', ticketData);
  return response.data;
};

const updateEstado = async (id, nuevoEstado) => {
  const response = await axiosInstance.patch(`/api/tickets/${id}/estado`, { estado: nuevoEstado });
  return response.data;
};

const update = async (id, ticketData) => {
  const response = await axiosInstance.put(`/api/tickets/${id}`, ticketData);
  return response.data;
};

const remove = async (id) => {
  const response = await axiosInstance.delete(`/api/tickets/${id}`);
  return response.data;
};

export default {
  getByProject,
  getById,
  create,
  update,
  updateEstado,
  remove
};