import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';

export const authStorage = {
  getToken: async () => {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },
  setToken: async (token) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },
  removeToken: async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },
};