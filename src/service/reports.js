import api from "../api/config";

export const reportsService = {
    getReports: async () => {
        const response = await api.get('/v1/report');

        if (response.status !== 200) {
            return {
                success: false,
                message: response.data.message || 'Erro ao buscar relatórios',
            };
        }

        const { data } = response.data;

        return {
            success: true,
            data: data,
        }
    },
    addReport: async (report) => {
        const response = await api.post('/v1/report', report);

        if (response.status !== 200) {

            return {
                success: false,
                message: response.data.message || 'Erro ao adicionar relatório',
            };
        }

        return {
            success: true,
            is_exists: response?.data?.data?.is_exists,
            data: response?.data?.data?.report,
        }
    },
    addReportReference: async (reportReference) => {
        const response = await api.post('/v1/report/reference', reportReference);

        if (response.status !== 200) {
            return {
                success: false,
                message: response.data.message || 'Erro ao adicionar a referência do relatório',
            };
        }

        return {
            success: true,
            data: response.data,
        }
    },
    putReportReference: async (reportReference) => {
        const response = await api.put('/v1/report/reference', reportReference);

        if (response.status !== 200) {
            return {
                success: false,
                message: response.data.message || 'Erro ao atualizar a referência do relatório',
            };
        }

        return {
            success: true,
            data: response.data,
        }
    }
}