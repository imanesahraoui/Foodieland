import axiosInstance from '@/config/axios.config';

export const authService = {

  login: async (credentials: { email: string; password: any }) => {
    const response = await axiosInstance.post('/auth/login', credentials, {
      withCredentials: true, 
    });
    return response.data;
  },

 
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  },
  updateProfile: async (formData: FormData) => {
    const response = await axiosInstance.patch('/auth/update-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },


  logout: async () => {
    const response = await axiosInstance.get('/auth/logout');
    return response.data;
  }
};