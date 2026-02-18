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
    bulkDelete: async (ids = []) => {
        try {
            const response = await api.delete('/v1/report/bulk', { data: { ids } });
            
            if (response.status !== 200) {
                return {
                    success: false,
                    message: response.data?.message || 'Erro ao excluir relatórios no servidor',
                };
            }
            return {
                success: true,
                data: response.data?.data || null,
            };
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || 'Erro ao excluir relatórios no servidor',
            };
        }
    },
    getReportIds: async () => {
        try {
            const response = await api.get('/v1/report/ids');
            
            if (response.status !== 200) {
                return {
                    success: false,
                    message: response.data?.message || 'Erro ao buscar IDs de relatórios',
                };
            }
            
            return {
                success: true,
                data: response.data?.data || [],
            };
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || 'Erro ao buscar IDs de relatórios',
            };
        }
    },
    getReportsByIds: async (ids = []) => {
        try {
            const response = await api.post('/v1/report/references/ids', { ids });
            
            if (response.status !== 200) {
                return {
                    success: false,
                    message: response.data?.message || 'Erro ao buscar relatórios por IDs',
                };
            }
            
            return {
                success: true,
                data: response.data?.data || [],
            };
        } catch (error) {
            return {
                success: false,
                message: error?.response?.data?.message || 'Erro ao buscar relatórios por IDs',
            };
        }
    },
    addReport: async (report) => {
        const response = await api.post('/v1/report', report)
            .then(response => {
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
                };
            })
            .catch(error => {
                console.log('[x] - error', error);
                return {
                    success: false,
                    message: error.response?.data?.message || 'Erro ao adicionar relatório',
                };
            });

        return response;
    },
    addReportReference: async (reportReference) => {
        const response = await api.post('/v1/report/reference', reportReference)
            .then(response => {
                if (response.status !== 200) {
                    return {
                        success: false,
                        message: response.data.message || 'Erro ao adicionar a referência do relatório',
                    };
                }

                return {
                    success: true,
                    data: response.data,
                };
            })
            .catch(error => {
                console.log('[x] - error', error);
                
                return {
                    success: false,
                    message: error.response?.data?.message || 'Erro ao adicionar a referência do relatório',
                };
            });

        return response;
    },
    putReportReference: async (reportReference) => {
        const response = await api.put('/v1/report/reference', reportReference)
            .then(response => {
                if (response.status !== 200) {
                    return {
                        success: false,
                        message: response.data.message || 'Erro ao atualizar a referência do relatório',
                    }
                }

                return {
                    success: true,
                    data: response.data,
                }
            })
            .catch(error => {
                console.log('[x] - error', error);

                return {
                    success: false,
                    message: error.response?.data?.message || 'Erro ao atualizar a referência do relatório',
                };
            });

        console.log('[x] - response', response);

        return response;
    }
}