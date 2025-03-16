'use client';
import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogClose } from '@/components/shadcn/dialog';
import { X } from 'lucide-react';
import { MaxWidthLayout } from "@/shared/ui/MaxWidthLayout";
import { Clinic } from '@/shared/api/clinicsApi';

// Dynamically import the map component
const MapComponent = dynamic(() => import('@/components/ClinicList/ClinicCard/MapClinicComponent'), {
    ssr: false,
    loading: () => <div className="w-full h-[400px] bg-gray-100 animate-pulse" />
});

interface ProcedureClinicsMapProps {
    clinics: Clinic[];
    totalCount: number;
    selectedClinicId?: number;
}

export const ProcedureClinicsMap: React.FC<ProcedureClinicsMapProps> = ({
                                                                            clinics,
                                                                            totalCount,
                                                                            selectedClinicId
                                                                        }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Create clinicMarkers for MapComponent
    const clinicMarkers = useMemo(() => {
        return clinics
            .filter(clinic => clinic.latitude && clinic.longitude)
            .map(clinic => ({
                id: clinic.id,
                name: clinic.title,
                address: clinic.address,
                position: [
                    parseFloat(clinic.latitude),
                    parseFloat(clinic.longitude)
                ] as [number, number]
            }));
    }, [clinics]);

    return (
        <MaxWidthLayout className="py-4">
            <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-xl font-medium text-gray-900">Где можно сдать анализ:</h2>
                </div>

                {/* Map Container */}
                <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden">
                    {!isOpen && (
                        <div className="absolute inset-0">
                            <MapComponent
                                isPreview={true}
                                selectedClinicId={selectedClinicId}
                                customMarkers={clinicMarkers}
                            />
                        </div>
                    )}

                    {/* Map Interaction Layer */}
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <button
                            onClick={() => setIsOpen(true)}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                 bg-white px-4 py-2 rounded-lg shadow-md
                 hover:bg-emerald-50 transition-colors duration-200
                 text-emerald-600 text-sm font-medium z-[400] border border-emerald-100"
                        >
                            Посмотреть на карте
                        </button>
                        <DialogContent className="max-w-6xl w-[90vw] h-[80vh] p-0">
                            <div className="relative h-full">
                                <MapComponent
                                    selectedClinicId={selectedClinicId}
                                    customMarkers={clinicMarkers}
                                />
                                <DialogClose className="absolute top-4 right-4 z-[500]">
                                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50
                     transition-colors duration-200">
                                        <X className="w-5 h-5 text-gray-600" />
                                    </button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </MaxWidthLayout>
    );
};

// Function for proper Russian declension of the word "clinic"
function getClinicText(count: number): string {
    if (count % 10 === 1 && count % 100 !== 11) {
        return 'клиника';
    } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
        return 'клиники';
    } else {
        return 'клиник';
    }
}
