// shared/api/index.ts
import axios from 'axios';

const API_URL = 'https://backend.docfinder.kz/api/v1';

export const apiInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export const apiGet = async <T>(endpoint: string): Promise<T> => {
    const response = await apiInstance.get<T>(endpoint);
    return response.data;
};
