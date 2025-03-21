'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Clinic } from '@/shared/api/clinicsApi';

interface ClinicSelectorProps {
    availableClinics: Clinic[];
    selectedClinic: Clinic | null;
    onClinicSelect: (clinic: Clinic) => void;
    isLoading: boolean;
}

export const ClinicSelector: React.FC<ClinicSelectorProps> = ({
                                                           availableClinics,
                                                           selectedClinic,
                                                           onClinicSelect,
                                                           isLoading
                                                       }) => {
    const [showClinicSelector, setShowClinicSelector] = useState(false);

    return (
        <div className="grid gap-2">
            <Label htmlFor="clinic-selector">Клиника</Label>
            <div className="relative">
                <Input
                    id="clinic-selector"
                    readOnly
                    value={selectedClinic?.title || 'Выберите клинику'}
                    onClick={() => setShowClinicSelector(!showClinicSelector)}
                    className="pr-10 cursor-pointer"
                    placeholder="Выберите клинику"
                />
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />

                {showClinicSelector && (
                    <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
                        <div className="p-2 max-h-60 overflow-y-auto">
                            {isLoading ? (
                                <div className="py-2 px-3 text-gray-500">Загрузка клиник...</div>
                            ) : availableClinics.length === 0 ? (
                                <div className="py-2 px-3 text-gray-500">Нет доступных клиник</div>
                            ) : (
                                availableClinics.map((clinic) => (
                                    <button
                                        key={clinic.id}
                                        className={`w-full text-left py-2 px-3 rounded-md ${
                                            selectedClinic?.id === clinic.id
                                                ? 'bg-green-50 text-green-600'
                                                : 'hover:bg-gray-50'
                                        }`}
                                        onClick={() => {
                                            onClinicSelect(clinic);
                                            setShowClinicSelector(false);
                                        }}
                                    >
                                        <div className="font-medium">{clinic.title}</div>
                                        <div className="text-xs text-gray-500">{clinic.address}</div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
            {selectedClinic && (
                <p className="text-xs text-gray-500">{selectedClinic.address}</p>
            )}
        </div>
    );
};
