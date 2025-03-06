// shared/api/config/apiInstance.ts
import axios from 'axios';
import qs from 'qs';

const API_URL = 'https://backend.docfinder.kz/api/v1';

export const apiInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    paramsSerializer: {
        serialize: (params) =>
            qs.stringify(params, {
                arrayFormat: 'comma',
            }),
    },
});

export const apiGet = async <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
    const response = await apiInstance.get<T>(endpoint, { params });
    return response.data;
};
