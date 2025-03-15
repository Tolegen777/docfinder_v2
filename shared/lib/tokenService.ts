export const tokenService = {
    getLocalAccessToken: () => {
        // In browser environments, use localStorage
        if (typeof window !== 'undefined') {
            return localStorage.getItem('access_token');
        }
        return null;
    },
    getLocalRefreshToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('refresh_token');
        }
        return null;
    },
    updateLocalTokenData: (token: string, type: 'access_token' | 'refresh_token') => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(type, token);
        }
    },
};
