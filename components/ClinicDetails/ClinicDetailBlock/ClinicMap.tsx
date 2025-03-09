'use client'
import React from 'react';
import dynamic from 'next/dynamic';

// Динамический импорт компонента карты
const MapClinicPreview = dynamic(
    () => import('./MapClinicComponent').then((mod) => mod.default),
    {
        ssr: false,
        loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-xl" />
    }
);

interface ClinicMapProps {
    clinicId: number;
    isPreview?: boolean;
    latitude?: number;
    longitude?: number;
}

export const ClinicMap: React.FC<ClinicMapProps> = ({
                                                        clinicId,
                                                        isPreview = true,
                                                        latitude,
                                                        longitude
                                                    }) => {
    return (
        <div className="relative w-full h-full overflow-hidden rounded-xl">
            <MapClinicPreview
                isPreview={isPreview}
                selectedClinicId={clinicId}
                customCoordinates={latitude && longitude ? [latitude, longitude] : undefined}
            />
        </div>
    );
};
