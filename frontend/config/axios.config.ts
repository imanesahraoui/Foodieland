
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use((config) => {
  
  const token = localStorage.getItem('token'); 
  
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {
        
        const rs = await axiosInstance.get('/auth/refresh'); 
        const { accessToken } = rs.data;
        localStorage.setItem('token', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);

      } catch (_error) {
        console.error("Session expirée, veuillez vous reconnecter.");
        localStorage.removeItem('token');
        window.location.href = '/auth/login'; 
        return Promise.reject(_error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
