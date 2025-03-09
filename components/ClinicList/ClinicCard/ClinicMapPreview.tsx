'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/shadcn/dialog';
import { X } from 'lucide-react';
import { MaxWidthLayout } from "@/shared/ui/MaxWidthLayout";
import dynamic from "next/dynamic";
import { useClinicsStore } from '@/shared/stores/clinicsStore';
import { useCityStore } from '@/shared/stores/cityStore';

// Динамически импортируем компонент карты для предотвращения проблем с SSR
const MapComponent = dynamic(() => import('./MapClinicComponent'), {
    ssr: false,
    loading: () => <div className="w-full h-[400px] bg-gray-100 animate-pulse" />
});

interface ClinicMapPreviewProps {
    selectedClinicId?: number;
}

const ClinicMapPreview: React.FC<ClinicMapPreviewProps> = ({ selectedClinicId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { filteredClinics } = useClinicsStore();
    const { currentCity } = useCityStore();

    const clinicCount = filteredClinics.length;

    return (
        <MaxWidthLayout className="py-4">
            <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-emerald-600 font-medium">{clinicCount} {getClinicText(clinicCount)}</span>
                    <span className="text-gray-900">в {currentCity?.title ?? ''}</span>
                </div>

                {/* Map Container */}
                <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden">
                    {!isOpen && (
                        <div className="absolute inset-0">
                            <MapComponent isPreview={true} selectedClinicId={selectedClinicId} />
                        </div>
                    )}

                    {/* Map Interaction Layer */}
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                               bg-white px-4 py-2 rounded-lg shadow-md
                               hover:bg-gray-50 transition-colors duration-200
                               text-gray-900 text-sm font-medium z-[400]">
                                Посмотреть на карте
                            </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl w-[90vw] h-[80vh] p-0">
                            <div className="relative h-full">
                                <MapComponent selectedClinicId={selectedClinicId} />
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

// Функция для правильного склонения слова "клиника"
function getClinicText(count: number): string {
    if (count % 10 === 1 && count % 100 !== 11) {
        return 'клиника';
    } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
        return 'клиники';
    } else {
        return 'клиник';
    }
}

export default ClinicMapPreview;
