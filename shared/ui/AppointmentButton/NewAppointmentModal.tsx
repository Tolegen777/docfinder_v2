// shared/ui/AppointmentButton/NewAppointmentModal.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { TimeSlot, WeeklySchedule, Procedure, Consultation, ScheduleUtils } from "@/shared/api/doctorsApi";
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
    weeklySchedule: WeeklySchedule[];
    procedures: Procedure[];
    consultation?: Consultation;
    // Новые пропсы для предзаполнения
    preselectedTimeSlot?: TimeSlot | null;
    preselectedDate?: string;
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
                                                                            weeklySchedule,
                                                                            procedures = [],
                                                                            consultation,
                                                                            preselectedTimeSlot = null,
                                                                            preselectedDate
                                                                        }) => {
    // Мемоизируем статические данные для предотвращения различий между сервером и клиентом
    const memoizedData = useMemo(() => {
        const availableDates = ScheduleUtils.getAvailableDates(weeklySchedule);
        const todayDate = ScheduleUtils.getTodayDate();
        const tomorrowDate = ScheduleUtils.getTomorrowDate();
        const dayAfterDate = ScheduleUtils.getDayAfterTomorrowDate();

        return {
            availableDates,
            todayDate,
            tomorrowDate,
            dayAfterDate,
        };
    }, [weeklySchedule, procedures, consultation]);

    // Простая инициализация состояний без useEffect
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        if (typeof window === 'undefined') return ''; // На сервере возвращаем пустую строку
        return preselectedDate || memoizedData.availableDates[0] || memoizedData.todayDate;
    });

    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(() => {
        if (typeof window === 'undefined') return null;
        return preselectedTimeSlot;
    });

    const [selectedProcedure, setSelectedProcedure] = useState<Procedure | Consultation | null>(() => {
        if (typeof window === 'undefined') return null;
        return consultation || null;
    });

    // Состояния UI
    const [showProcedureDropdown, setShowProcedureDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

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

    // Устанавливаем флаг mounted для предотвращения гидратации
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Заполняем форму данными пользователя, если он авторизован
    useEffect(() => {
        if (isMounted && isAuthenticated && user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone_number: user.phone_number ? formatPhoneNumber(user.phone_number) : '+7 ',
            });
        }
    }, [isMounted, isAuthenticated, user]);

    // Сброс данных при открытии/закрытии модального окна
    useEffect(() => {
        if (isOpen && isMounted) {
            // Устанавливаем начальные значения
            const initialDate = preselectedDate || memoizedData.availableDates[0] || memoizedData.todayDate;
            setSelectedDate(initialDate);
            setSelectedTimeSlot(preselectedTimeSlot);
            setSelectedProcedure(consultation || null);
            setFormErrors({});
            setShowProcedureDropdown(false);
            setShowDateDropdown(false);

            if (!isAuthenticated) {
                setFormData({
                    first_name: '',
                    last_name: '',
                    phone_number: '+7 ',
                });
            }
        }
    }, [isOpen, isMounted, preselectedTimeSlot, preselectedDate, consultation, memoizedData]);

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
    const handleProcedureSelect = (procedure: Procedure | Consultation) => {
        setSelectedProcedure(procedure);
        setShowProcedureDropdown(false);
    };

    // Обработчик выбора временного слота
    const handleTimeSlotSelect = (slot: TimeSlot) => {
        setSelectedTimeSlot(slot);
    };

    // Обработчик смены даты
    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        // Сбрасываем selectedTimeSlot только если это не предзаполненный слот
        if (!preselectedTimeSlot || preselectedDate !== date) {
            setSelectedTimeSlot(null);
        }
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
        if (!selectedProcedure) {
            toast.error('Выберите процедуру');
            return;
        }

        // Валидируем форму пациента
        if (!validateForm()) {
            toast.error('Пожалуйста, исправьте ошибки в форме');
            return;
        }

        // Получаем информацию о клинике для выбранной даты
        const schedule = ScheduleUtils.getScheduleForDate(weeklySchedule, selectedDate);
        if (!schedule) {
            toast.error('Не удалось найти информацию о клинике');
            return;
        }

        setIsLoading(true);

        try {
            const appointmentData: Record<string, any> = {
                doctor_id: doctorId,
                procedure_id: selectedProcedure.medical_procedure_id,
                clinic_id: schedule.clinic_id,
                date: selectedDate,
                time_slot_id: selectedTimeSlot.id,
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
    const getTimeSlotsForDate = (date: string): TimeSlot[] => {
        const schedule = ScheduleUtils.getScheduleForDate(weeklySchedule, date);
        return schedule ? ScheduleUtils.convertToTimeSlots(schedule.working_hours_list) : [];
    };

    // Безопасное форматирование даты
    const getFormattedDateDisplay = () => {
        if (!selectedDate || !isMounted) return 'Выберите дату';
        try {
            const dateObj = new Date(selectedDate + 'T00:00:00'); // Добавляем время для корректного парсинга
            return format(dateObj, 'd MMMM yyyy', { locale: ru });
        } catch (error) {
            return selectedDate;
        }
    };

    // Функция для получения названия дня
    const getDateLabel = (date: string) => {
        if (!isMounted) return date;

        if (date === memoizedData.todayDate) return 'Сегодня';
        if (date === memoizedData.tomorrowDate) return 'Завтра';
        if (date === memoizedData.dayAfterDate) return 'Послезавтра';

        try {
            return format(new Date(date + 'T00:00:00'), 'd MMMM', { locale: ru });
        } catch (error) {
            return date;
        }
    };

    // Не рендерим компонент до монтирования
    if (!isMounted) {
        return null;
    }

    const timeSlots = getTimeSlotsForDate(selectedDate);

    // Проверяем, есть ли доступные даты
    if (memoizedData.availableDates.length === 0) {
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

    // Получаем клинику для отображения
    const currentSchedule = ScheduleUtils.getScheduleForDate(weeklySchedule, selectedDate);

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
                            <p className="text-gray-600">{selectedProcedure?.medical_procedure_title}</p>
                            <div className="flex items-center gap-1 text-blue-500 text-sm mt-1">
                                <MapPin className="w-4 h-4" />
                                <span>{currentSchedule?.clinic_title}</span>
                            </div>
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
                    {procedures?.length > 1 && (
                        <div className="space-y-2">
                            <Label>Процедура</Label>
                            <div className="relative">
                                <div
                                    className="w-full p-3 border rounded-lg cursor-pointer flex items-center justify-between bg-green-50"
                                    onClick={() => setShowProcedureDropdown(!showProcedureDropdown)}
                                >
                                    <span>{selectedProcedure?.medical_procedure_title || 'Выберите процедуру'}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </div>

                                {showProcedureDropdown && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {procedures.map((procedure, index) => (
                                            <div
                                                key={procedure.medical_procedure_id || index}
                                                className="p-3 hover:bg-gray-50 cursor-pointer"
                                                onClick={() => handleProcedureSelect(procedure)}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span>{procedure.medical_procedure_title}</span>
                                                    {procedure.doctor_procedure_final_price && (
                                                        <span className="text-green-600 font-semibold">
                                                            {procedure.doctor_procedure_final_price} тг
                                                        </span>
                                                    )}
                                                </div>
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
                                <div className="absolute z-40 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {memoizedData.availableDates.map((date) => (
                                        <div
                                            key={date}
                                            className={cn(
                                                "p-3 hover:bg-gray-50 cursor-pointer",
                                                selectedDate === date ? 'bg-green-50 text-green-600' : ''
                                            )}
                                            onClick={() => handleDateChange(date)}
                                        >
                                            {getDateLabel(date)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Выбор времени */}
                    <div className="space-y-4">
                        <Label>Время приема</Label>
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
