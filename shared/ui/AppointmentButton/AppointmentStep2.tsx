// shared/ui/AppointmentButton/AppointmentStep2.tsx
'use client';

import React from 'react';
import { Button } from '@/components/shadcn/button';
import { ArrowLeft, Calendar, Clock, MapPin, User, Stethoscope } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Image from 'next/image';
import { TimeSlot } from './TimeSelector';
import { PatientFormData, PatientForm } from './PatientForm';
import doctorAvatar from '@/shared/assets/images/doctorPlaceholder.jpeg';
import { cn } from '@/lib/utils';

interface AppointmentStep2Props {
    doctorName?: string;
    doctorPhoto?: string;
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
                                                                      doctorPhoto,
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

    // Проверяем валидность формы
    const isFormValid = () => {
        const requiredFields = ['first_name', 'last_name', 'phone_number'];
        return requiredFields.every(field => formData[field as keyof PatientFormData]) &&
            Object.keys(formErrors).length === 0;
    };

    return (
        <div className="flex flex-col h-full">
            {/* Заголовок с информацией о враче */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 border-b border-emerald-100">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Image
                            src={doctorPhoto || doctorAvatar}
                            width={72}
                            height={72}
                            alt={doctorName || 'Врач'}
                            className="rounded-full border-3 border-white shadow-lg"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-emerald-600 rounded-full p-2 shadow-md">
                            <Stethoscope className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-1">{doctorName || 'Врач'}</h3>
                        {procedureName && (
                            <p className="text-emerald-700 font-semibold text-lg">{procedureName}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Сводка записи */}
                <div className="bg-white border-2 border-gray-100 rounded-xl p-5 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Детали записи
                    </h4>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                            <div className="bg-emerald-600 p-3 rounded-full">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-emerald-700">Дата приема</p>
                                <p className="font-bold text-emerald-900">{formatDateDisplay(selectedDate)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                            <div className="bg-blue-600 p-3 rounded-full">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-blue-700">Время приема</p>
                                <p className="font-bold text-blue-900">{selectedTimeSlot ? selectedTimeSlot.start_time : '-'}</p>
                            </div>
                        </div>

                        {clinicName && (
                            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                                <div className="bg-purple-600 p-3 rounded-full">
                                    <MapPin className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-purple-700">Клиника</p>
                                    <p className="font-bold text-purple-900">{clinicName}</p>
                                    {clinicAddress && (
                                        <p className="text-sm text-purple-600 mt-1">{clinicAddress}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Форма персональных данных */}
                <div className="bg-white border-2 border-gray-100 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="bg-emerald-600 p-2 rounded-full">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg">Персональные данные</h4>
                    </div>

                    <PatientForm
                        formData={formData}
                        onInputChange={onInputChange}
                        isAuthenticated={isAuthenticated}
                        formErrors={formErrors}
                    />
                </div>

            </div>

            {/* Кнопки управления - теперь тоже внизу в модале, но не в степпере */}
            <div className="border-t bg-gray-50 p-4 space-y-3">
                <Button
                    onClick={onSubmit}
                    disabled={isLoading || !isFormValid()}
                    className={cn(
                        "w-full py-4 text-base font-semibold transition-all",
                        isFormValid() && !isLoading
                            ? "bg-emerald-600 hover:bg-emerald-700 shadow-lg"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    )}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Создание записи...
                        </div>
                    ) : isFormValid() ? (
                        <div className="flex items-center gap-2">
                            <span>✅ Подтвердить запись</span>
                        </div>
                    ) : (
                        'Заполните все обязательные поля'
                    )}
                </Button>

                <button
                    className="w-full flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                    onClick={onPrevStep}
                    disabled={isLoading}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Вернуться к выбору времени
                </button>
            </div>
        </div>
    );
};
