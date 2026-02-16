import axiosInstance from '@/config/axios.config';

export const categoryService = {

  getAll: async () => {
    const response = await axiosInstance.get('/categories');
    return response.data;
  },

  create: async (formData: FormData) => {
    const response = await axiosInstance.post('/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  
  update: async (id: string, formData: FormData) => {
    const response = await axiosInstance.patch(`/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

 
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  },
};