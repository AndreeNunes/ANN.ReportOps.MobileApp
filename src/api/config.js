import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const BASE_URL = 'http://192.168.15.12:8080';
// const BASE_URL = 'http://10.0.2.2:8080';
const BASE_URL = 'https://annreportopsbackend-production.up.railway.app';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});


api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers["App-User-Id"] = await AsyncStorage.getItem('@auth_user_id');
        config.headers["Client-Id"] = await AsyncStorage.getItem('@auth_client_id');
      }
      
      return config;
    } catch (error) {
      console.error('[x] Erro ao adicionar token:', error);
      return config;
    }
  },
  (error) => {
    console.error('[x] Erro na requisição:', error);

    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("TODO: Deve deslogar o usuário e redirecionar para a tela de login");
    }

    console.error('[x] API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: JSON.stringify(error.response?.data, null, 2),
    });
    
    return Promise.reject(error);
  }
);

export default api;
