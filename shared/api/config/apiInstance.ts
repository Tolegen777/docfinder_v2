import axios, {AxiosRequestConfig, AxiosError} from 'axios';
import qs from 'qs';
import {tokenService} from "@/shared/lib/tokenService";
import {handleSessionExpired} from "@/shared/lib/handleSessionExpired";
import {authApi} from "@/shared/api/authApi";

type FailedQueue = {
    reject: (error: Error | null) => void;
    resolve: (token: string | null) => void;
};

const API_URL = 'https://backend.docfinder.kz/api/v1';

// Create axios instance
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

// For handling multiple requests during token refresh
let isRefreshing = false;
let failedQueue: FailedQueue[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Request interceptor
// @ts-ignore
// Массив URL-путей, для которых нужно добавлять токен
const protectedUrls = [
    '/authentication/',
    '/create-visit',
    '/visits'
];

apiInstance.interceptors.request.use((config: any) => {
    // Получаем текущий URL запроса
    const requestUrl = config.url || '';

    // Проверяем, содержит ли URL любую из строк в массиве protectedUrls
    const isProtectedUrl = protectedUrls.some(path => requestUrl.includes(path));

    // Если URL в списке защищенных и у нас есть токен
    if (isProtectedUrl) {
        const accessToken = tokenService.getLocalAccessToken();

        if (accessToken) {
            return {
                ...config,
                headers: {
                    ...config.headers,
                    Authorization: `Bearer ${accessToken}`,
                },
            };
        }
    }

    // Если URL не в списке защищенных или нет токена, возвращаем конфиг без изменений
    return config;
});

// Response interceptor
apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        originalRequest._retry = originalRequest._retry || false;
        console.log(error.response, 'fff')

        // Handle session expired
        if (error.response?.data?.code === 'token_not_valid') {
            handleSessionExpired()
        }

        // Handle unauthorized errors (401) - try to refresh token
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            tokenService.getLocalAccessToken()
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return apiInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise((resolve, reject) => {
                authApi
                    .refresh({refresh: tokenService?.getLocalRefreshToken()})
                    .then((response) => {
                        // Update tokens
                        tokenService.updateLocalTokenData(response.access, 'access_token');

                        apiInstance.defaults.headers.common.Authorization = `Bearer ${response.access}`;

                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${response.access}`;
                        }

                        // Process queued requests
                        processQueue(null, response.access);
                        resolve(apiInstance(originalRequest));
                    })
                    .catch((err) => {
                        processQueue(err, null);
                        reject(error);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(error);
    }
);

// Helper function for GET requests
export const apiGet = async <T>(
    endpoint: string,
    params?: Record<string, any>
): Promise<T> => {
    const response = await apiInstance.get<T>(endpoint, {params});
    return response.data;
};

// Helper functions for other HTTP methods
export const apiPost = async <T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
): Promise<T> => {
    const response = await apiInstance.post<T>(endpoint, data, config);
    return response.data;
};

export const apiPut = async <T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
): Promise<T> => {
    const response = await apiInstance.put<T>(endpoint, data, config);
    return response.data;
};

export const apiDelete = async <T>(
    endpoint: string,
    config?: AxiosRequestConfig
): Promise<T> => {
    const response = await apiInstance.delete<T>(endpoint, config);
    return response.data;
};
