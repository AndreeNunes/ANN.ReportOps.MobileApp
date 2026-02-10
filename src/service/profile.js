import api from "../api/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isConnectedNetwork } from "../util/network";
import { getProfileFromStorage, setProfileToStorage } from "../storage/profile";

export const profileService = {
  getProfile: async () => {
    try {
      const isConnected = await isConnectedNetwork();

      if (!isConnected) {
        const cached = await getProfileFromStorage();
        if (cached) {
          return { success: true, data: cached, offline: true };
        }
        return { success: false, message: 'Sem conexão e sem dados do perfil salvos' };
      }

      const response = await api.get('/v1/profile');
      if (response.status !== 200) {
        // fallback para cache em caso de erro do servidor
        const cached = await getProfileFromStorage();
        if (cached) {
          return { success: true, data: cached, offline: true };
        }
        return { success: false, message: response.data?.message || 'Erro ao buscar perfil' };
      }

      // salvar/atualizar cache local
      await setProfileToStorage(response.data);

      return { success: true, data: response.data };
    } catch (error) {
      // fallback para cache em exceções
      const cached = await getProfileFromStorage();
      if (cached) {
        return { success: true, data: cached, offline: true };
      }
      return { success: false, message: error.response?.data?.message || 'Erro ao buscar perfil' };
    }
  },
};

