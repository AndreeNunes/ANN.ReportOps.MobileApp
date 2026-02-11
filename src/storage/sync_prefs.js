import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_FIRST_LOGIN_SYNC_PROMPTED = '@sync_first_login_prompted';
const KEY_TRIGGER_SYNC_ON_NEXT_REPORTS = '@sync_trigger_on_next_reports';

export async function getFirstLoginSyncPrompted() {
  const value = await AsyncStorage.getItem(KEY_FIRST_LOGIN_SYNC_PROMPTED);
  return value === 'true';
}

export async function setFirstLoginSyncPrompted(value) {
  await AsyncStorage.setItem(KEY_FIRST_LOGIN_SYNC_PROMPTED, value ? 'true' : 'false');
}

export async function getTriggerSyncOnNextReports() {
  const value = await AsyncStorage.getItem(KEY_TRIGGER_SYNC_ON_NEXT_REPORTS);
  return value === 'true';
}

export async function setTriggerSyncOnNextReports(value) {
  await AsyncStorage.setItem(KEY_TRIGGER_SYNC_ON_NEXT_REPORTS, value ? 'true' : 'false');
}

