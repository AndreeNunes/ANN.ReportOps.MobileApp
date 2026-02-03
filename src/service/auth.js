import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/config';
import { decodeJWT } from '../util/jwt';

export const authService = {
  login: async (email, password) => {
    try {
      const body = {
          email,
          password,
      }

      const response = await api.post('/v1/login', body);

      if (response.status !== 200) {
        return {
          success: false,
          message: response.data.message || 'Erro ao fazer login',
        };
      }

      const { token } = response.data;

      const decodedToken = decodeJWT(token);

      if (!decodedToken) {
        return {
          success: false,
          message: 'Ocorreu um erro ao realizar o login',
        };
      }
      
      await AsyncStorage.setItem('@auth_token', token);
      await AsyncStorage.setItem('@auth_user_id', decodedToken?.app_user_id || '');
      await AsyncStorage.setItem('@auth_client_id', decodedToken?.client_id || '');
      await AsyncStorage.setItem('@auth_user_name', decodedToken?.name || '');

      return {
        success: true,
        message: 'Login realizado com sucesso',
      };
    } catch (error) {
      console.error('❌ Erro no login:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao fazer login',
      };
    }
  },
  validateCode: async (code) => {
    try {
      const normalized = String(code || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      const response = await api.post('/v1/client/validate', { code: normalized });
      if (response.status !== 200 || !response.data?.success) {
        return {
          success: false,
          message: response.data?.message || 'Código inválido ou expirado',
        };
      }
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
        code: normalized,
      };
    } catch (error) {
      const status = error.response?.status;
      if (status === 422) {
        return { success: false, message: error.response?.data?.message || 'Código inválido ou expirado' };
      }
      return { success: false, message: 'Erro ao validar código' };
    }
  },
  register: async ({ email, password, name, document, code }) => {
    try {
      const normalizedCode = String(code || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      const body = { email, password, name, document, code: normalizedCode };
      const response = await api.post('/v1/register', body);
      
      if (!([200, 201].includes(response.status))) {
        return {
          success: false,
          message: response.data?.message || 'Erro no cadastro',
        };
      }
      return {
        success: true,
        message: response.data?.message || 'Cadastro realizado com sucesso',
      };
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao realizar cadastro';
      return { success: false, message: msg };
    }
  },
};
