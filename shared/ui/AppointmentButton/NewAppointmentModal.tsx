// shared/ui/AppointmentButton/NewAppointmentModal.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {ChevronDown, X, MapPin, Check, Star, ArrowLeft, ArrowRight} from 'lucide-react';
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
import Link from "next/link";

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
    preselectedTimeSlot?: TimeSlot | null;
    preselectedDate?: string;
    review_count: number;
    average_rating: number;
    onSuccess?: () => void;
}

// Схема валидации для данных пациента
const patientSchema = z.object({
    first_name: z.string().min(1, 'Имя обязательно для заполнения'),
    last_name: z.string().min(1, 'Фамилия обязательна для заполнения'),
    phone_number: z.string().regex(/^\+7\s[0-9]{3}\s[0-9]{3}\s[0-9]{4}$/, 'Введите корректный номер телефона'),
});

const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, index) => (
        <Star
            key={index}
            className={`w-5 h-5 ${index < count ? 'fill-[#FB923C] stroke-[#FB923C]' : 'stroke-[#FB923C] fill-white'}`}
        />
    ));
};

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
                                                                            preselectedDate,
                                                                            average_rating,
                                                                            review_count,
    onSuccess
                                                                        }) => {
    // Состояние для управления шагами
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);

    // Мемоизируем статические данные
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

    // Состояния для шага 1 (выбор услуги, даты, времени)
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        if (typeof window === 'undefined') return '';
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

    // Состояния UI для шага 1
    const [showProcedureDropdown, setShowProcedureDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);

    // Состояния для шага 2 (личные данные)
    const [formData, setFormData] = useState<PatientFormData>({
        first_name: '',
        last_name: '',
        phone_number: '+7 ',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isAgreedToTerms, setIsAgreedToTerms] = useState(true);

    // Общие состояния
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Контекст из сторов
    const { isAuthenticated, user } = useAuthStore();

    // Устанавливаем флаг mounted
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
            // Сбрасываем на первый шаг
            setCurrentStep(1);

            // Устанавливаем начальные значения для шага 1
            const initialDate = preselectedDate || memoizedData.availableDates[0] || memoizedData.todayDate;
            setSelectedDate(initialDate);
            setSelectedTimeSlot(preselectedTimeSlot);
            setSelectedProcedure(consultation || null);
            setShowProcedureDropdown(false);
            setShowDateDropdown(false);

            // Сбрасываем данные шага 2
            setFormErrors({});
            setIsAgreedToTerms(true);

            if (!isAuthenticated) {
                setFormData({
                    first_name: '',
                    last_name: '',
                    phone_number: '+7 ',
                });
            }
        }
    }, [isOpen, isMounted, preselectedTimeSlot, preselectedDate, consultation, memoizedData]);

    // Обработчики для шага 1
    const handleProcedureSelect = (procedure: Procedure | Consultation) => {
        setSelectedProcedure(procedure);
        setShowProcedureDropdown(false);
    };

    const handleTimeSlotSelect = (slot: TimeSlot) => {
        setSelectedTimeSlot(slot);
    };

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        if (!preselectedTimeSlot || preselectedDate !== date) {
            setSelectedTimeSlot(null);
        }
        setShowDateDropdown(false);
    };

    // Переход к следующему шагу
    const handleNextStep = () => {
        // Валидация шага 1
        if (!selectedProcedure) {
            toast.error('Выберите процедуру');
            return;
        }
        if (!selectedTimeSlot) {
            toast.error('Выберите время приема');
            return;
        }

        setCurrentStep(2);
    };

    // Возврат к предыдущему шагу
    const handlePrevStep = () => {
        setCurrentStep(1);
    };

    // Обработчики для шага 2
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let formattedValue = value;
        if (name === 'phone_number') {
            formattedValue = formatPhoneNumber(value);
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));

        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleTermsAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsAgreedToTerms(e.target.checked);
    };

    // Валидация формы
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
        if (!isAgreedToTerms) {
            toast.error('Необходимо согласиться с условиями для записи', {
                style: {
                    background: '#ef4444',
                    color: 'white',
                    border: 'none'
                }
            });
            return;
        }

        if (!validateForm()) {
            toast.error('Пожалуйста, исправьте ошибки в форме');
            return;
        }

        const schedule = ScheduleUtils.getScheduleForDate(weeklySchedule, selectedDate);
        if (!schedule) {
            toast.error('Не удалось найти информацию о клинике');
            return;
        }

        setIsLoading(true);

        try {
            const appointmentData: Record<string, any> = {
                doctor_id: doctorId,
                procedure_id: selectedProcedure!.medical_procedure_id,
                clinic_id: schedule.clinic_id,
                date: selectedDate,
                time_slot_id: selectedTimeSlot!.id,
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
            onSuccess?.()

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

    // Вспомогательные функции
    const getTimeSlotsForDate = (date: string): TimeSlot[] => {
        const schedule = ScheduleUtils.getScheduleForDate(weeklySchedule, date);
        return schedule ? ScheduleUtils.convertToTimeSlots(schedule.working_hours_list) : [];
    };

    const getFormattedDateDisplay = () => {
        if (!selectedDate || !isMounted) return 'Выберите дату';
        try {
            const dateObj = new Date(selectedDate + 'T00:00:00');
            return format(dateObj, 'd MMMM yyyy', { locale: ru });
        } catch (error) {
            return selectedDate;
        }
    };

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

    // Не рендерим до монтирования
    if (!isMounted) {
        return null;
    }

    const timeSlots = getTimeSlotsForDate(selectedDate);
    const currentSchedule = ScheduleUtils.getScheduleForDate(weeklySchedule, selectedDate);

    // Проверяем доступность дат
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 max-h-[80vh] flex flex-col">
                <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-4">
                            {currentStep === 2 && (
                                <button
                                    onClick={handlePrevStep}
                                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            )}
                            <DialogTitle className="text-xl font-semibold">
                                {currentStep === 1 ? 'Выбор времени приема' : 'Ваши данные'}
                            </DialogTitle>
                        </div>
                        <div className="text-sm text-gray-500">
                            Шаг {currentStep} из 2
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Информация о враче (показываем на обоих шагах) */}
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
                        <div className="flex-col items-center hidden md:flex">
                            <div className="flex">
                                {renderStars(Math.round(average_rating))}
                            </div>
                            <span className="text-blue-500 text-sm">{review_count} отзывов</span>
                        </div>
                    </div>

                    {/* Мобильный рейтинг */}
                    <div className="flex flex-col items-center md:hidden">
                        <div className="flex">
                            {renderStars(Math.round(average_rating))}
                        </div>
                        <span className="text-blue-500 text-sm">{review_count} отзывов</span>
                    </div>

                    {currentStep === 1 ? (
                        /* ШАГ 1: Выбор процедуры, даты и времени */
                        <>
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
                        </>
                    ) : (
                        /* ШАГ 2: Личные данные и подтверждение */
                        <>

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

                            {/* Чекбокс согласия */}
                            <div className="space-y-2">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="terms-agreement"
                                        checked={isAgreedToTerms}
                                        onChange={handleTermsAgreementChange}
                                        className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="terms-agreement" className="text-sm text-gray-700 leading-relaxed max-w-full">
                                        Согласен со всеми условиями, включая{' '}
                                        <Link
                                            href="/privacy"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            политику конфиденциальности
                                        </Link>
                                        {' '}и{' '}
                                        <Link
                                            href="/user-agreement"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            условия обслуживания
                                        </Link>
                                        {', а также с '}
                                        <Link
                                            href="/consent"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            согласием на обработку персональных данных
                                        </Link>
                                    </label>
                                </div>
                            </div>
                            {/* Сводка выбора */}
                            <div className="bg-green-50 p-4 rounded-lg space-y-2">
                                <h4 className="font-semibold text-green-800">Детали записи</h4>
                                <div className="space-y-1 text-sm text-green-700">
                                    <p><span className="font-medium">Процедура:</span> {selectedProcedure?.medical_procedure_title}</p>
                                    <p><span className="font-medium">Дата:</span> {getFormattedDateDisplay()}</p>
                                    <p><span className="font-medium">Время:</span> {selectedTimeSlot?.start_time.substring(0, 5)}</p>
                                    <p><span className="font-medium">Клиника:</span> {currentSchedule?.clinic_title}</p>
                                    {selectedProcedure?.doctor_procedure_final_price && (
                                        <p><span className="font-medium">Стоимость:</span> {selectedProcedure.doctor_procedure_final_price} тг</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Кнопки управления */}
                <div className="flex-shrink-0 p-6 border-t bg-white">
                    {currentStep === 1 ? (
                        <Button
                            onClick={handleNextStep}
                            className="w-full py-4 text-base font-semibold bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                            Далее
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading || !isAgreedToTerms}
                            className="w-full py-4 text-base font-semibold transition-all"
                        >
                            {isLoading ? 'Записываемся...' : 'Записаться'}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
