// shared/ui/AppointmentButton/AppointmentStep1.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/shadcn/button';
import { Label } from '@/components/shadcn/label';
import { AlertCircle, CheckCircle2, XCircle, Calendar, Clock, Stethoscope } from 'lucide-react';
import { DoctorInfo } from './DoctorInfo';
import { DateSelector } from './DateSelector';
import { TimeSlot, TimeSelector } from './TimeSelector';
import { ProcedureSelector } from './ProcedureSelector';
import { Procedure } from "@/shared/api/doctorsApi";
import { cn } from '@/lib/utils';

interface ValidationState {
    procedure: boolean;
    date: boolean;
    time: boolean;
    clinic: boolean;
}

interface AppointmentStep1Props {
    doctorPhoto?: string;
    doctorName?: string;
    procedureName?: string;
    procedureId?: string | number;
    onNextStep: () => void;

    // Для выбора процедуры
    availableProcedures?: Procedure[];
    onProcedureSelect?: (procedure: Procedure) => void;

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
    doctorPhoto,
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
    const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(
        procedureId && procedureName
            ? { medical_procedure_id: procedureId, title: procedureName } as Procedure
            : null
    );
    const [showValidation, setShowValidation] = useState(false);

    // Состояние валидации
    const [validation, setValidation] = useState<ValidationState>({
        procedure: !!procedureName || !!procedureId,
        date: !!selectedTab,
        time: !!selectedTimeSlot,
        clinic: !!clinicName
    });

    // Проверяем возможность записи
    const getAppointmentIssues = () => {
        const issues: string[] = [];

        if (!procedureName && (!availableProcedures || availableProcedures.length === 0)) {
            issues.push('Отсутствуют доступные процедуры для записи');
        }

        if (!clinicName) {
            issues.push('Не указана клиника для приема');
        }

        if (availableTimeSlots.length === 0 && validation.date) {
            issues.push('На выбранную дату нет свободных слотов');
        }

        return issues;
    };

    const appointmentIssues = getAppointmentIssues();
    const hasBlockingIssues = appointmentIssues.length > 0;

    // Обновляем валидацию при изменении данных
    useEffect(() => {
        setValidation({
            procedure: !!procedureName || !!selectedProcedure,
            date: !!selectedTab,
            time: !!selectedTimeSlot,
            clinic: !!clinicName
        });
    }, [procedureName, selectedProcedure, selectedTab, selectedTimeSlot, clinicName]);

    // Проверяем, можно ли перейти к следующему шагу
    const canProceed = validation.procedure && validation.date && validation.time && validation.clinic && !hasBlockingIssues;

    // Обработчик выбора процедуры
    const handleProcedureSelect = (procedure: Procedure) => {
        setSelectedProcedure(procedure);

        if (onProcedureSelect) {
            onProcedureSelect(procedure);
        }
    };

    // Обработчик нажатия на кнопку "Продолжить"
    const handleNextClick = () => {
        setShowValidation(true);

        if (canProceed) {
            onNextStep();
        }
    };

    // Компонент индикатора валидации
    const ValidationIndicator: React.FC<{ isValid: boolean; show: boolean }> = ({ isValid, show }) => {
        if (!show) return null;

        return isValid ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
        );
    };

    // Если есть критические проблемы, показываем ошибку
    if (hasBlockingIssues) {
        return (
            <div className="p-6 space-y-6">
                {/* Информация о враче */}
                {doctorName && (
                    <div className="bg-blue-50 rounded-lg p-4">
                        <DoctorInfo doctorPhoto={doctorPhoto} doctorName={doctorName} procedureName={procedureName} />
                    </div>
                )}

                {/* Ошибка записи */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <h3 className="font-semibold text-red-800">Запись недоступна</h3>
                    </div>

                    <div className="space-y-2">
                        {appointmentIssues.map((issue, index) => (
                            <p key={index} className="text-red-700 text-sm flex items-start gap-2">
                                <span className="w-1 h-1 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                                {issue}
                            </p>
                        ))}
                    </div>

                    <div className="pt-2">
                        <p className="text-red-600 text-sm">
                            Пожалуйста, обратитесь к администратору клиники для решения данных вопросов.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 overflow-y-auto max-h-[calc(80vh-200px)]">
            <div className="p-4 space-y-6">
                {/* Информация о враче */}
                {doctorName && (
                    <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-4 border border-blue-100">
                        <DoctorInfo doctorPhoto={doctorPhoto} doctorName={doctorName} procedureName={procedureName} />
                    </div>
                )}

                {/* Выбор процедуры */}
                {!procedureName && availableProcedures.length > 0 && (
                    <div className="space-y-3">
                        <ProcedureSelector
                            availableProcedures={availableProcedures}
                            selectedProcedure={selectedProcedure}
                            onProcedureSelect={handleProcedureSelect}
                        />

                        {showValidation && !validation.procedure && (
                            <p className="text-red-500 text-sm flex items-center gap-2 bg-red-50 p-2 rounded-md">
                                <AlertCircle className="w-4 h-4" />
                                Выберите процедуру для продолжения
                            </p>
                        )}
                    </div>
                )}

                {/* Отображение выбранной процедуры */}
                {procedureName && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-medium flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 text-emerald-600" />
                                Процедура
                            </Label>
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="p-4 border border-emerald-200 rounded-lg bg-emerald-50">
                            <p className="font-medium text-emerald-800">{procedureName}</p>
                        </div>
                    </div>
                )}

                {/* Информация о клинике */}
                {clinicName && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-medium flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                Клиника
                            </Label>
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="p-4 border border-emerald-200 rounded-lg bg-emerald-50">
                            <p className="font-medium text-emerald-800">{clinicName}</p>
                            {clinicAddress && <p className="text-sm text-emerald-600 mt-1">{clinicAddress}</p>}
                        </div>
                    </div>
                )}

                {/* Выбор даты */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-medium flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-emerald-600" />
                            Дата <span className="text-red-500">*</span>
                        </Label>
                        <ValidationIndicator isValid={validation.date} show={showValidation} />
                    </div>

                    <DateSelector
                        selectedTab={selectedTab}
                        onTabChange={onTabChange}
                    />

                    {showValidation && !validation.date && (
                        <p className="text-red-500 text-sm flex items-center gap-2 bg-red-50 p-2 rounded-md">
                            <AlertCircle className="w-4 h-4" />
                            Выберите дату приема
                        </p>
                    )}
                </div>

                {/* Выбор времени */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-medium flex items-center gap-2">
                            <Clock className="w-4 h-4 text-emerald-600" />
                            Время <span className="text-red-500">*</span>
                        </Label>
                        <ValidationIndicator isValid={validation.time} show={showValidation} />
                    </div>

                    <TimeSelector
                        availableTimeSlots={availableTimeSlots}
                        selectedTimeSlot={selectedTimeSlot}
                        onTimeSlotSelect={onTimeSlotSelect}
                    />

                    {showValidation && !validation.time && (
                        <p className="text-red-500 text-sm flex items-center gap-2 bg-red-50 p-2 rounded-md">
                            <AlertCircle className="w-4 h-4" />
                            Выберите время приема
                        </p>
                    )}

                    {availableTimeSlots.length === 0 && validation.date && (
                        <p className="text-amber-700 text-sm flex items-center gap-2 bg-amber-50 p-3 rounded-md border border-amber-200">
                            <AlertCircle className="w-4 h-4" />
                            На выбранную дату нет свободного времени. Попробуйте выбрать другую дату.
                        </p>
                    )}
                </div>
            </div>

            {/* Кнопка перехода к следующему шагу */}
            <div className="sticky bottom-0 bg-white p-4 border-t">
                <Button
                    className={cn(
                        "w-full py-3 text-base font-medium transition-all",
                        canProceed
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    )}
                    onClick={handleNextClick}
                    disabled={!canProceed}
                >
                    {canProceed ? 'Продолжить' : 'Заполните все поля'}
                </Button>

                {showValidation && !canProceed && !hasBlockingIssues && (
                    <p className="text-red-500 text-sm mt-2 text-center">
                        Для продолжения заполните все обязательные поля
                    </p>
                )}
            </div>
        </div>
    );
};
