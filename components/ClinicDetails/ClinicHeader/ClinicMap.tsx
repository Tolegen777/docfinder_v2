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
}

export const ClinicMap: React.FC<ClinicMapProps> = ({
                                                        clinicId,
                                                        isPreview = true
                                                    }) => {
    return (
        <div className="relative w-full h-full overflow-hidden rounded-xl">
            <MapClinicPreview
                isPreview={isPreview}
                selectedClinicId={clinicId}
            />
        </div>
    );
};
