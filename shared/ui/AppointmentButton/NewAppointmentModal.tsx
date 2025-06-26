// shared/ui/AppointmentButton/NewAppointmentModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronDown, X, MapPin, Check } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/shadcn/dialog';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { toast } from 'sonner';
import Image from 'next/image';
import { useAuthStore } from '@/shared/stores/authStore';
import { apiPost } from '@/shared/api';
import {TimeSlot} from "@/shared/api/doctorsApi";
import { Procedure } from "@/shared/api/doctorsApi";
import { formatPhoneNumber } from '@/shared/lib/formatters';
import doctorAvatar from '@/shared/assets/images/doctorPlaceholder.jpeg';
import { cn } from '@/lib/utils';
import { z } from 'zod';

interface PatientFormData {
    first_name: string;
    last_name: string;
    phone_number: string;
}

interface NewAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctorId?: number;
    doctorName?: string;
    doctorPhoto?: string;
    procedureId?: string | number;
    procedureName?: string;
    schedule_today?: any[];
    schedule_tomorrow?: any[];
    schedule_day_after_tomorrow?: any[];
    availableProcedures?: Procedure[];
    // Новые пропсы для предзаполнения
    preselectedTimeSlot?: TimeSlot | null;
    preselectedDate?: 'today' | 'tomorrow' | 'day_after';
}

// Схема валидации для данных пациента
const patientSchema = z.object({
    first_name: z.string().min(1, 'Имя обязательно для заполнения'),
    last_name: z.string().min(1, 'Фамилия обязательна для заполнения'),
    phone_number: z.string().regex(/^\+7\s[0-9]{3}\s[0-9]{3}\s[0-9]{4}$/, 'Введите корректный номер телефона'),
});

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
                                                                            isOpen,
                                                                            onClose,
                                                                            doctorId,
                                                                            doctorName,
                                                                            doctorPhoto,
                                                                            procedureId,
                                                                            procedureName,
                                                                            schedule_today = [],
                                                                            schedule_tomorrow = [],
                                                                            schedule_day_after_tomorrow = [],
                                                                            availableProcedures = [],
                                                                            preselectedTimeSlot = null,
                                                                            preselectedDate = 'today'
                                                                        }) => {
    // Состояния для выбора данных
    const [selectedTab, setSelectedTab] = useState(preselectedDate || 'today');
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(preselectedTimeSlot);
    const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(
        procedureId && procedureName
            ? { medical_procedure_id: procedureId, title: procedureName } as Procedure
            : null
    );

    // Состояния UI
    const [showProcedureDropdown, setShowProcedureDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Активное расписание и клиника в зависимости от выбранного дня
    const [activeSchedule, setActiveSchedule] = useState<any>(schedule_today[0] || null);

    // Данные пользователя
    const [formData, setFormData] = useState<PatientFormData>({
        first_name: '',
        last_name: '',
        phone_number: '+7 ',
    });

    // Ошибки валидации
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Контекст из сторов
    const { isAuthenticated, user } = useAuthStore();

    // Обновляем дату при смене selectedTab
    useEffect(() => {
        const date = new Date();
        if (selectedTab === 'tomorrow') {
            date.setDate(date.getDate() + 1);
        } else if (selectedTab === 'day_after') {
            date.setDate(date.getDate() + 2);
        }
        setSelectedDate(format(date, 'yyyy-MM-dd'));
    }, [selectedTab]);

    // Заполняем форму данными пользователя, если он авторизован
    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone_number: user.phone_number ? formatPhoneNumber(user.phone_number) : '+7 ',
            });
        }
    }, [isAuthenticated, user]);

    // Сброс данных при открытии/закрытии модального окна
    useEffect(() => {
        if (isOpen) {
            // Если есть предзаполненные данные, используем их
            const initialTab = preselectedDate || 'today';
            setSelectedTab(initialTab);
            setSelectedTimeSlot(preselectedTimeSlot);

            // Устанавливаем активное расписание
            if (preselectedDate === 'tomorrow') {
                setActiveSchedule(schedule_tomorrow[0] || null);
            } else if (preselectedDate === 'day_after') {
                setActiveSchedule(schedule_day_after_tomorrow[0] || null);
            } else {
                setActiveSchedule(schedule_today[0] || null);
            }

            setFormErrors({});
            setShowProcedureDropdown(false);
            setShowDateDropdown(false);
            setSelectedProcedure(
                procedureId && procedureName
                    ? { medical_procedure_id: procedureId, title: procedureName } as Procedure
                    : null
            );

            if (!isAuthenticated) {
                setFormData({
                    first_name: '',
                    last_name: '',
                    phone_number: '+7 ',
                });
            }
        }
    }, [isOpen, schedule_today, isAuthenticated, procedureId, procedureName, preselectedTimeSlot, preselectedDate, schedule_tomorrow, schedule_day_after_tomorrow]);

    // Обработчик для работы с формой
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Применяем форматирование
        let formattedValue = value;
        if (name === 'phone_number') {
            formattedValue = formatPhoneNumber(value);
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));

        // Очищаем ошибку поля при изменении
        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Обработчик выбора процедуры
    const handleProcedureSelect = (procedure: Procedure) => {
        setSelectedProcedure(procedure);
        setShowProcedureDropdown(false);
    };

    // Обработчик выбора временного слота
    const handleTimeSlotSelect = (slot: TimeSlot) => {
        setSelectedTimeSlot(slot);
    };

    // Обработчик смены дня
    const handleTabChange = (tab: string) => {
        setSelectedTab(tab as 'today');
        // Сбрасываем selectedTimeSlot только если это не предзаполненный слот
        if (!preselectedTimeSlot) {
            setSelectedTimeSlot(null);
        }

        // Обновляем выбранную дату на основании таба
        const date = new Date();
        if (tab === 'tomorrow') {
            date.setDate(date.getDate() + 1);
            setActiveSchedule(schedule_tomorrow[0] || null);
        } else if (tab === 'day_after') {
            date.setDate(date.getDate() + 2);
            setActiveSchedule(schedule_day_after_tomorrow[0] || null);
        } else {
            setActiveSchedule(schedule_today[0] || null);
        }

        setSelectedDate(format(date, 'yyyy-MM-dd'));
        setShowDateDropdown(false);
    };

    // Валидация формы перед отправкой
    const validateForm = () => {
        try {
            patientSchema.parse(formData);
            setFormErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path.length > 0) {
                        newErrors[err.path[0].toString()] = err.message;
                    }
                });
                setFormErrors(newErrors);
            }
            return false;
        }
    };



    // Отправка формы
    const handleSubmit = async () => {
        // Сначала проверяем выбор времени
        if (!selectedTimeSlot) {
            toast.error('Выберите время приема');
            return;
        }

        // Проверяем выбор процедуры
        if (!selectedProcedure && !procedureId) {
            toast.error('Выберите процедуру');
            return;
        }

        // Валидируем форму пациента
        if (!validateForm()) {
            toast.error('Пожалуйста, исправьте ошибки в форме');
            return;
        }

        setIsLoading(true);

        try {
            const appointmentData: Record<string, any> = {
                doctor_id: doctorId,
                procedure_id: selectedProcedure?.medical_procedure_id || procedureId,
                clinic_id: activeSchedule.clinic_id,
                date: selectedDate,
                time_slot_id: selectedTimeSlot?.id,
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone_number: formData.phone_number.replace(/\s+/g, ""),
            };

            const response = await apiPost('/patients_endpoints/visits/create-visit/', appointmentData);

            toast.success('🎉 Запись успешно создана!', {
                duration: 5000,
                style: {
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    fontSize: '16px',
                }
            });

            // Сброс и закрытие
            setFormData({
                first_name: '',
                last_name: '',
                phone_number: '+7 ',
            });
            onClose();

        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Произошла ошибка при создании записи';
            toast.error(errorMessage, {
                style: {
                    background: '#ef4444',
                    color: 'white',
                    border: 'none'
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Преобразуем рабочие часы в слоты времени для выбора
    const timeSlots: TimeSlot[] = activeSchedule?.working_hours?.map(hour => ({
        id: hour.id,
        start_time: hour.start_time,
        end_time: hour.end_time
    })) || [];

    // Проверяем, есть ли доступные даты
    const availableDates = [
        { key: 'today', label: 'Сегодня', date: new Date(), schedule: schedule_today },
        { key: 'tomorrow', label: 'Завтра', date: new Date(Date.now() + 24 * 60 * 60 * 1000), schedule: schedule_tomorrow },
        { key: 'day_after', label: 'Послезавтра', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), schedule: schedule_day_after_tomorrow }
    ].filter(dateItem => dateItem.schedule && dateItem.schedule.length > 0 && dateItem.schedule[0]?.working_hours?.length > 0);

    // Если нет доступных дат
    if (availableDates.length === 0) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[600px] p-0">
                    <DialogHeader className="p-6 pb-4 border-b">
                        <DialogTitle className="text-xl font-semibold">Онлайн запись</DialogTitle>
                        <DialogClose className="absolute right-4 top-4">
                            <X className="h-4 w-4" />
                        </DialogClose>
                    </DialogHeader>

                    <div className="p-6">
                        <div className="text-center space-y-4">
                            <div className="text-red-500 text-lg">Запись недоступна</div>
                            <p className="text-gray-600">На ближайшие дни нет свободных слотов для записи</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    // Форматирование отображаемой даты
    const getFormattedDateDisplay = () => {
        const currentDate = availableDates.find(d => d.key === selectedTab);
        if (!currentDate) return '';

        return format(currentDate.date, 'd MMMM yyyy, HH:mm', { locale: ru });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 max-h-[80vh] flex flex-col">
                <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
                    <DialogTitle className="text-xl font-semibold">Онлайн запись</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Информация о враче */}
                    <div className="flex items-center gap-4">
                        <Image
                            src={doctorPhoto || doctorAvatar}
                            width={80}
                            height={80}
                            alt={doctorName || ''}
                            className="rounded-full"
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg">{doctorName}</h3>
                            <p className="text-gray-600">{selectedProcedure?.title || procedureName}</p>
                            <div className="flex items-center gap-1 text-blue-500 text-sm mt-1">
                                <MapPin className="w-4 h-4" />
                                <span>{activeSchedule?.clinic_title}</span>
                            </div>
                            <p className="text-gray-500 text-sm">{activeSchedule?.clinic_address}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-5 h-5 text-orange-400">★</div>
                                ))}
                                <div className="w-5 h-5 text-gray-300">★</div>
                            </div>
                            <span className="text-blue-500 text-sm">467 отзывов</span>
                        </div>
                    </div>

                    {/* Выбор процедуры */}
                    {(!procedureName && availableProcedures.length > 0) && (
                        <div className="space-y-2">
                            <Label>Процедура</Label>
                            <div className="relative">
                                <div
                                    className="w-full p-3 border rounded-lg cursor-pointer flex items-center justify-between bg-green-50"
                                    onClick={() => setShowProcedureDropdown(!showProcedureDropdown)}
                                >
                                    <span>{selectedProcedure?.title || 'Выберите процедуру'}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </div>

                                {showProcedureDropdown && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {availableProcedures.map((procedure) => (
                                            <div
                                                key={procedure.medical_procedure_id}
                                                className="p-3 hover:bg-gray-50 cursor-pointer"
                                                onClick={() => handleProcedureSelect(procedure)}
                                            >
                                                {procedure.title}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Выбор даты */}
                    <div className="space-y-2">
                        <Label>Дата</Label>
                        <div className="relative">
                            <div
                                className="w-full p-3 border rounded-lg cursor-pointer flex items-center justify-between bg-green-50"
                                onClick={() => setShowDateDropdown(!showDateDropdown)}
                            >
                                <span>{getFormattedDateDisplay()}</span>
                                <ChevronDown className="w-4 h-4" />
                            </div>

                            {showDateDropdown && (
                                <div className="absolute z-40 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                    {availableDates.map((dateItem) => (
                                        <div
                                            key={dateItem.key}
                                            className={cn(
                                                "p-3 hover:bg-gray-50 cursor-pointer",
                                                selectedTab === dateItem.key ? 'bg-green-50 text-green-600' : ''
                                            )}
                                            onClick={() => handleTabChange(dateItem.key)}
                                        >
                                            {dateItem.label} {format(dateItem.date, 'd MMMM', { locale: ru })}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Выбор времени */}
                    <div className="space-y-4">
                        <div className="flex gap-2 border-b">
                            {availableDates.map((dateItem) => (
                                <button
                                    key={dateItem.key}
                                    onClick={() => handleTabChange(dateItem.key)}
                                    className={cn(
                                        "px-4 py-2 font-medium",
                                        selectedTab === dateItem.key
                                            ? 'text-green-600 border-b-2 border-green-600'
                                            : 'text-gray-600'
                                    )}
                                >
                                    {dateItem.label} {format(dateItem.date, 'd.MM', { locale: ru })}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            {timeSlots.map((slot) => (
                                <button
                                    key={slot.id}
                                    onClick={() => handleTimeSlotSelect(slot)}
                                    className={cn(
                                        "p-3 text-sm border rounded-lg transition-colors",
                                        selectedTimeSlot?.id === slot.id
                                            ? 'border-green-500 bg-green-50 text-green-600'
                                            : 'border-gray-300 hover:border-green-500'
                                    )}
                                >
                                    {slot.start_time.substring(0, 5)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Форма пациента */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Фамилия</Label>
                                <Input
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className={cn(
                                        isAuthenticated ? "bg-blue-50" : "",
                                        formErrors.last_name ? "border-red-500" : ""
                                    )}
                                />
                                {formErrors.last_name && (
                                    <p className="text-red-500 text-xs">{formErrors.last_name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Имя</Label>
                                <Input
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className={cn(
                                        isAuthenticated ? "bg-blue-50" : "",
                                        formErrors.first_name ? "border-red-500" : ""
                                    )}
                                />
                                {formErrors.first_name && (
                                    <p className="text-red-500 text-xs">{formErrors.first_name}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Номер телефона</Label>
                            <div className="relative">
                                <Input
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    placeholder="+7 ___ ___ __ __"
                                    className={cn(
                                        isAuthenticated ? "bg-blue-50" : "",
                                        formErrors.phone_number ? "border-red-500" : ""
                                    )}
                                />
                                {isAuthenticated && (
                                    <Check className="absolute right-3 top-2.5 h-4 w-4 text-green-600" />
                                )}
                            </div>
                            {formErrors.phone_number && (
                                <p className="text-red-500 text-xs">{formErrors.phone_number}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Зафиксированная кнопка */}
                <div className="flex-shrink-0 p-6 border-t bg-white">
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full py-4 text-base font-semibold bg-green-600 hover:bg-green-700 transition-all"
                    >
                        {isLoading ? 'Записываться...' : 'Записаться'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
