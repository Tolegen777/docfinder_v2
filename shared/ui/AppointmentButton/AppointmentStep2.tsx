'use client';

import React from 'react';
import { Button } from '@/components/shadcn/button';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TimeSlot } from './TimeSelector';
import { PatientFormData, PatientForm } from './PatientForm';

interface AppointmentStep2Props {
    doctorName?: string;
    procedureName?: string;
    selectedDate: string;
    selectedTimeSlot: TimeSlot | null;
    clinicName?: string;
    clinicAddress?: string;

    formData: PatientFormData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isAuthenticated: boolean;
    formErrors?: Record<string, string>;

    onPrevStep: () => void;
    onSubmit: () => void;
    isLoading: boolean;
}

export const AppointmentStep2: React.FC<AppointmentStep2Props> = ({
                                                                      doctorName,
                                                                      procedureName,
                                                                      selectedDate,
                                                                      selectedTimeSlot,
                                                                      clinicName,
                                                                      clinicAddress,
                                                                      formData,
                                                                      onInputChange,
                                                                      isAuthenticated,
                                                                      formErrors = {},
                                                                      onPrevStep,
                                                                      onSubmit,
                                                                      isLoading
                                                                  }) => {
    // Форматирование даты для отображения
    const formatDateDisplay = (dateString: string) => {
        try {
            return format(new Date(dateString), 'd MMMM yyyy', { locale: ru });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(80vh-70px)]">
            {/* Информация о записи */}
            <div className="space-y-2">
                <div className="space-y-1">
                    <p className="text-base font-bold">Врач:</p>
                    <p>{doctorName || '-'}</p>
                </div>

                <div className="space-y-1">
                    <p className="text-base font-bold">Процедура:</p>
                    <p>{procedureName || '-'}</p>
                </div>

                <div className="space-y-1">
                    <p className="text-base font-bold">Дата:</p>
                    <p>{formatDateDisplay(selectedDate)}</p>
                </div>

                <div className="space-y-1">
                    <p className="text-base font-bold">Время:</p>
                    <p>{selectedTimeSlot ? selectedTimeSlot.start_time : '-'}</p>
                </div>

                {clinicName && (
                    <div className="space-y-1">
                        <p className="text-base font-bold">Клиника:</p>
                        <p>{clinicName}</p>
                        {clinicAddress && <p className="text-sm text-gray-500">{clinicAddress}</p>}
                    </div>
                )}
            </div>

            {/* Форма персональных данных */}
            <div className="mt-6">
                <PatientForm
                    formData={formData}
                    onInputChange={onInputChange}
                    isAuthenticated={isAuthenticated}
                    formErrors={formErrors}
                />
            </div>

            {/* Кнопки управления */}
            <div className="pt-4">
                <Button
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="w-full py-6 text-base font-medium"
                >
                    {isLoading ? 'Отправка...' : 'Записаться'}
                </Button>

                <button
                    className="w-full text-center mt-3 text-gray-500 hover:text-gray-700"
                    onClick={onPrevStep}
                >
                    Назад
                </button>
            </div>
        </div>
    );
};
