// shared/stores/locationStore.ts
import { create } from 'zustand';

interface LocationState {
    coords: {
        lat: number;
        lng: number;
    } | null;
    error: string | null;
    isLoading: boolean;
    fetchLocation: () => Promise<void>;
    hasLocation: () => boolean;
}

export const useLocationStore = create<LocationState>((set, get) => ({
    coords: null,
    error: null,
    isLoading: false,
    fetchLocation: async () => {
        if (!navigator.geolocation) {
            set({ error: 'Геолокация не поддерживается вашим браузером' });
            return;
        }

        set({ isLoading: true, error: null });

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                });
            });

            set({
                coords: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                },
                isLoading: false,
            });
        } catch (err) {
            let errorMessage = 'Ошибка получения местоположения';
            if (err instanceof GeolocationPositionError) {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        errorMessage = 'Доступ к местоположению запрещен';
                        break;
                    case err.POSITION_UNAVAILABLE:
                        errorMessage = 'Информация о местоположении недоступна';
                        break;
                    case err.TIMEOUT:
                        errorMessage = 'Время ожидания истекло';
                        break;
                }
            }
            set({ error: errorMessage, isLoading: false });
        }
    },
    hasLocation: () => {
        return get().coords !== null;
    },
}));
