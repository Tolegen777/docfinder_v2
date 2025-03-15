'use client';

import React, { ReactNode, useEffect } from 'react';
import {useCheckAuth} from "@/shared/api/authApi";
import {useAuthStore} from "@/shared/stores/authStore";
import {tokenService} from "@/shared/lib/tokenService";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const checkAuth = useCheckAuth();
    const {isAuthenticated} = useAuthStore()
    const token = tokenService.getLocalAccessToken();

    useEffect(() => {
        // Check authentication on initial load if access token exists
        if (token) {
            checkAuth.mutate();
        }
    }, [token, isAuthenticated]);

    return <>{children}</>;
};
