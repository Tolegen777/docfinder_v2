// components/LocationProvider.tsx
"use client";

import { useEffect } from 'react';
import { useLocationStore } from '@/shared/stores/locationStore';

export const LocationProvider = () => {
    const { fetchLocation, coords, error } = useLocationStore();

    useEffect(() => {
        // Запрашиваем местоположение только если его еще нет
        if (!coords && !error) {
            fetchLocation();
        }
    }, [coords, error, fetchLocation]);

    return null; // Этот компонент ничего не рендерит
};
