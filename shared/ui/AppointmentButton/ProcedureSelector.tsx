// shared/ui/AppointmentButton/ProcedureSelector.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, Stethoscope } from 'lucide-react';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Procedure } from '@/shared/api/doctorsApi';
import { cn } from '@/lib/utils';

interface ProcedureSelectorProps {
    availableProcedures: Procedure[];
    selectedProcedure: Procedure | null;
    onProcedureSelect: (procedure: Procedure) => void;
    className?: string;
}

export const ProcedureSelector: React.FC<ProcedureSelectorProps> = ({
                                                                        availableProcedures,
                                                                        selectedProcedure,
                                                                        onProcedureSelect,
                                                                        className = ''
                                                                    }) => {
    const [showProcedures, setShowProcedures] = useState(false);

    // Обработчик выбора процедуры
    const handleSelectProcedure = (procedure: Procedure) => {
        onProcedureSelect(procedure);
        setShowProcedures(false);
    };

    // Отображаемое значение в инпуте
    const getDisplayValue = () => {
        if (selectedProcedure) {
            return selectedProcedure.title;
        }
        return '';
    };

    return (
        <div className={cn("grid gap-3", className)}>
            <Label className="text-base font-medium flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                Процедура <span className="text-red-500">*</span>
            </Label>

            <div className="relative">
                <Input
                    readOnly
                    value={getDisplayValue()}
                    onClick={() => setShowProcedures(!showProcedures)}
                    className="pr-10 cursor-pointer h-12"
                    placeholder="Выберите процедуру"
                />
                <ChevronDown
                    className={cn(
                        "absolute right-3 top-3.5 h-5 w-5 text-gray-400 transition-transform duration-200",
                        showProcedures && "transform rotate-180"
                    )}
                />
            </div>

            {showProcedures && (
                <div className="border rounded-lg p-3 bg-white shadow-lg max-h-[300px] overflow-y-auto z-10 relative">
                    {availableProcedures.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Нет доступных процедур</p>
                    ) : (
                        <div className="space-y-2">
                            {availableProcedures.map((procedure) => (
                                <button
                                    key={procedure?.medical_procedure_id}
                                    className={cn(
                                        "w-full text-left p-4 rounded-lg border transition-all duration-200 hover:shadow-md",
                                        selectedProcedure?.medical_procedure_id === procedure?.medical_procedure_id
                                            ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                                            : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                                    )}
                                    onClick={() => handleSelectProcedure(procedure)}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <h4 className={cn(
                                                "font-medium text-sm leading-relaxed",
                                                selectedProcedure?.medical_procedure_id === procedure?.medical_procedure_id
                                                    ? 'text-emerald-800'
                                                    : 'text-gray-900'
                                            )}>
                                                {procedure.title}
                                            </h4>
                                        </div>

                                        {/* Цена */}
                                        {procedure?.current_price && (
                                            <div className="flex-shrink-0">
                                                <span className={cn(
                                                    "text-sm font-semibold px-2 py-1 rounded-md",
                                                    selectedProcedure?.medical_procedure_id === procedure?.medical_procedure_id
                                                        ? 'text-emerald-700 bg-emerald-100'
                                                        : 'text-emerald-600 bg-emerald-50'
                                                )}>
                                                    {procedure.current_price?.final_price} тг
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Индикатор выбора */}
                                    {selectedProcedure?.medical_procedure_id === procedure?.medical_procedure_id && (
                                        <div className="mt-2 flex items-center gap-2 text-emerald-600">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-xs font-medium">Выбрано</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
