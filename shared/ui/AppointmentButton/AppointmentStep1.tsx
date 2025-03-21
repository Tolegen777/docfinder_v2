'use client';

import React, { useState } from 'react';
import { Button } from '@/components/shadcn/button';
import { Label } from '@/components/shadcn/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select";
import { DoctorInfo } from './DoctorInfo';
import { DateSelector } from './DateSelector';
import { TimeSlot, TimeSelector } from './TimeSelector';
import {Procedure} from "@/shared/api/doctorsApi";

interface AppointmentStep1Props {
    doctorName?: string;
    procedureName?: string;
    procedureId?: string | number;
    onNextStep: () => void;

    // Для выбора процедуры
    availableProcedures?: Procedure[];
    onProcedureSelect?: (procedureId: string | number, procedureName: string) => void;

    // Для выбора даты
    selectedTab: string;
    onTabChange: (tab: string) => void;

    // Для выбора времени
    availableTimeSlots: TimeSlot[];
    selectedTimeSlot: TimeSlot | null;
    onTimeSlotSelect: (slot: TimeSlot) => void;

    // Информация о клинике (только для отображения)
    clinicName?: string;
    clinicAddress?: string;
}

export const AppointmentStep1: React.FC<AppointmentStep1Props> = ({
                                                                      doctorName,
                                                                      procedureName,
                                                                      procedureId,
                                                                      onNextStep,
                                                                      availableProcedures = [],
                                                                      onProcedureSelect,
                                                                      selectedTab,
                                                                      onTabChange,
                                                                      availableTimeSlots,
                                                                      selectedTimeSlot,
                                                                      onTimeSlotSelect,
                                                                      clinicName,
                                                                      clinicAddress
                                                                  }) => {
    const [selectedProcedureId, setSelectedProcedureId] = useState<string | number | undefined>(procedureId);

    // Обработчик выбора процедуры
    const handleProcedureChange = (value: string) => {
        setSelectedProcedureId(value);

        if (onProcedureSelect) {
            const selectedProcedure = availableProcedures.find(p => p?.medical_procedure_id?.toString() === value);
            if (selectedProcedure && selectedProcedure?.medical_procedure_id) {
                onProcedureSelect(selectedProcedure?.medical_procedure_id, selectedProcedure.title);
            }
        }
    };

    return (
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(80vh-70px)]">
            {/* Информация о враче */}
            {doctorName && <DoctorInfo doctorName={doctorName} procedureName={procedureName} />}

            {/* Выбор процедуры */}
            {!procedureName && (
                <div className="grid gap-2">
                    <Label>Процедура</Label>
                    <Select value={selectedProcedureId?.toString()} onValueChange={handleProcedureChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Выберите процедуру" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableProcedures.map((procedure) => (
                                <SelectItem key={procedure?.medical_procedure_id} value={procedure?.medical_procedure_id?.toString() ?? ''}>
                                    {procedure.title}
                                    {procedure?.current_price && ` - ${procedure?.current_price} тг`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Отображение информации о клинике (если доступна) */}
            {clinicName && (
                <div className="grid gap-2">
                    <Label>Клиника</Label>
                    <div className="p-3 border rounded-md bg-gray-50">
                        <p className="font-medium">{clinicName}</p>
                        {clinicAddress && <p className="text-sm text-gray-500 mt-1">{clinicAddress}</p>}
                    </div>
                </div>
            )}

            {/* Выбор даты */}
            <DateSelector
                selectedTab={selectedTab}
                onTabChange={onTabChange}
            />

            {/* Выбор времени */}
            <TimeSelector
                availableTimeSlots={availableTimeSlots}
                selectedTimeSlot={selectedTimeSlot}
                onTimeSlotSelect={onTimeSlotSelect}
            />

            {/* Кнопка перехода к следующему шагу */}
            <div className="mt-4">
                <Button className="w-full" onClick={onNextStep}>
                    Выбрать
                </Button>
            </div>
        </div>
    );
};
