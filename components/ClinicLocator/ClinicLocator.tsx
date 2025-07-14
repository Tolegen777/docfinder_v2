"use client";

import { useEffect } from 'react';
import {apiGet} from "@/shared/api";

export default function ClinicLocator({ cityId = 1 }: { cityId?: number }) {

    const getLocation = () => {

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    await fetchClinics(latitude, longitude);
                } catch (err) {
                    console.log(err)
                }
            },
            (err) => {
                let errorMessage = "Ошибка получения местоположения";
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        errorMessage = "Доступ к местоположению запрещен";
                        break;
                    case err.POSITION_UNAVAILABLE:
                        errorMessage = "Информация о местоположении недоступна";
                        break;
                    case err.TIMEOUT:
                        errorMessage = "Время ожидания истекло";
                        break;
                }
                console.log(errorMessage)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const fetchClinics = async (lat: number, lng: number) => {
        try {
            const data = await apiGet(
                `/patients_endpoints/clinics/city_id:${cityId}/all-clinics/`,
                { latitude: lat, longitude: lng }
            );
        } catch (error) {
            console.error('Error fetching clinics:', error);
            throw error;
        }
    };

    useEffect(() => {
        // Автоматически запрашивать местоположение при монтировании
        getLocation();
    }, []);

    return (
        <div/>
    );
}
