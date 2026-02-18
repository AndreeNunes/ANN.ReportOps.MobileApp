import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from 'react-native-uuid';

const STORAGE_KEY = "@order_service_list";

export async function getOrderService() {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Erro ao buscar relatórios:", e);

    return [];
  }
}

export async function getOrderServiceById(id) {
  const reports = await getOrderService();

  if (!reports) {
    return null;
  }

  return reports.find(r => r.id === id);
}

async function saveOrderServiceList(list) {
  try {
    const jsonValue = JSON.stringify(list);

    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);

    return true;
  } catch (e) {
    console.error("Erro ao salvar lista de ordens de serviço:", e);
  }
}

export async function addOrderService(dto) {
  try {
    const orderService = await getOrderService();
    const id = uuid.v4();

    orderService.push({ ...dto, id: id });

    await saveOrderServiceList(orderService);

    return id;
  } catch (e) {
    console.error("Erro ao adicionar ordem de serviço:", e);
  }
}

export async function updateOrderService(id, partialDto) {
  const orderService = await getOrderService();

  const updatedOrderService = orderService.map(r =>
    r.id === id ? { ...r, ...partialDto } : r
  );

  const f = updatedOrderService.find(r => r.id === id);

  await saveOrderServiceList(updatedOrderService);

  return updatedOrderService;
}

export async function removeOrderService(id) {
  const orderService = await getOrderService();
  const filtered = orderService.filter(r => r.id !== id);
  await saveOrderServiceList(filtered);
  return filtered;
}
