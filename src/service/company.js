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

export async function updateCompany(payload) {
    try {
        const response = await api.put(`/v1/company/${payload.id}`, payload);

        if (response.status !== 200) {
            return {
                success: false,
                message: response?.data?.message || 'Erro ao atualizar empresa',
            };
        }

        return {
            success: true,
            message: response?.data?.message || 'Empresa atualizada com sucesso',
            data: response?.data?.data,
        };
    } catch (error) {
        console.error('[x] updateCompany error:', {
            id: payload?.id,
            status: error?.response?.status,
            data: JSON.stringify(error?.response?.data, null, 2),
        });
        return {
            success: false,
            message: error?.response?.data?.message || 'Erro ao atualizar empresa',
        };
    }
}

export async function deleteCompany(companyId) {
    const response = await api.delete(`/v1/company/${companyId}`);

    if (response.status !== 200) {
        return {
            success: false,
            message: response?.data?.message || 'Erro ao excluir empresa',
        };
    }

    return {
        success: true,
        message: response?.data?.message || 'Empresa excluída com sucesso',
    };
}

export async function getAddressByCep(cep) {
    const normalizedCep = String(cep || '').replace(/\D/g, '');

    if (normalizedCep.length !== 8) {
        return {
            success: false,
            message: 'CEP inválido',
        };
    }

    try {
        const response = await api.get(`/v1/utility/cep/${normalizedCep}`);

        if (response.status !== 200) {
            return {
                success: false,
                message: response?.data?.message || 'Erro ao buscar CEP',
            };
        }

        return {
            success: true,
            data: response?.data?.data || null,
        };
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data?.message || 'Erro ao buscar CEP',
        };
    }
}
