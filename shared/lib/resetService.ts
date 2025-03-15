export const resetService = () => {
    // Clear tokens and redirect to login
    if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
};
