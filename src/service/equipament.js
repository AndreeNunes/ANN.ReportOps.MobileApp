import AsyncStorage from "@react-native-async-storage/async-storage";
import { isConnectedNetwork } from "../util/network";
import api from "../api/config";

export async function getAllEquipaments(companyId) {
     
    const isConnected = await isConnectedNetwork();

    if (!isConnected) {
        const equipamentStorage = await AsyncStorage.getItem(`@equipament_${companyId}`);

        if (equipamentStorage) {
            return {
                success: true,
                data: JSON.parse(equipamentStorage),
            }
        }

        return {
            success: false,
            message: 'Erro ao buscar equipamentos',
        };
    }

    const response = await api.get(`/v1/equipament/${companyId}`);

    if (response.status !== 200) {
        return {
            success: false,
            message: 'Erro ao buscar equipamentos',
        };
    }

    const { data } = response.data;

    await AsyncStorage.setItem(`@equipament_${companyId}`, JSON.stringify(data));

    return {
        success: true,
        data: data,
    };
}

export async function createEquipaments(companyId, data) {
    const response = await api.post(`/v1/equipament/${companyId}`, data);

    if (response.status !== 200) {
        return {
            success: false,
            message: 'Erro ao criar equipamento',
        };
    }

    return {
        success: true,
        message: 'Equipamento criado com sucesso',
    };
}

export async function updateEquipament(companyId, data) {
    const response = await api.put(`/v1/equipament/${companyId}`, data);

    if (response.status !== 200) {
        return {
            success: false,
            message: 'Erro ao atualizar equipamento',
        };
    }

    return {
        success: true,
        message: 'Equipamento atualizado com sucesso',
    };
}

export async function deleteEquipament(companyId, equipamentId) {
    const response = await api.delete(`/v1/equipament/${companyId}/${equipamentId}`);

    if (response.status !== 200) {
        return {
            success: false,
            message: 'Erro ao excluir equipamento',
        };
    }

    return {
        success: true,
        message: 'Equipamento excluído com sucesso',
    };
}