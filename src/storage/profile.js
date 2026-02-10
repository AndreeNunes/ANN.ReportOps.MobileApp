import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@profile";

export async function getProfileFromStorage() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export async function setProfileToStorage(profile) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile || {}));
    return true;
  } catch {
    return false;
  }
}

