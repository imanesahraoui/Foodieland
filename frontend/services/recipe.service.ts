import axiosInstance from '@/config/axios.config';

export const recipeService = {
  getAll: async (category?: string | null) => {
    const config = category ? { params: { category } } : {};
    const response = await axiosInstance.get('/recipes', config);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get(`/recipes/${id}`);
    return response.data;
  },

  create: async (formData: FormData) => {
    const response = await axiosInstance.post('/recipes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: string, formData: FormData) => {
    const response = await axiosInstance.patch(`/recipes/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/recipes/${id}`);
    return response.data;
  },

 
    getLatest: async () => {
    const response = await axiosInstance.get('/recipes/latest');
    return response.data;
    },
};