import api from "../api/config";
import { isConnectedNetwork } from "../util/network";
import AsyncStorage from "@react-native-async-storage/async-storage";


export async function getAllCompanies() {
    const isConnected = await isConnectedNetwork();

    if (!isConnected) {
        const companiesStorage = await AsyncStorage.getItem('@companies');

        if (companiesStorage) {
            return {
                success: true,
                data: JSON.parse(companiesStorage),
            }
        }

        return {
            success: false,
            message: 'Erro ao buscar empresas',
        };
    }

    const response = await api.get('/v1/company');

    if (response.status !== 200) {
        return {
            success: false,
            message: response.data.message || 'Erro ao buscar empresas',
        };
    }

    const { data } = response.data;

    await AsyncStorage.setItem('@companies', JSON.stringify(data));

    return {
        success: true,
        data: data,
    };
}

export async function createCompany(payload) {
    const response = await api.post('/v1/company', payload);

    if (!(response.status === 200 || response.status === 201)) {
        return {
            success: false,
            message: response?.data?.message || 'Erro ao criar empresa',
        };
    }

    return {
        success: true,
        message: response?.data?.message || 'Empresa criada com sucesso',
        data: response?.data?.data,
    };
}
