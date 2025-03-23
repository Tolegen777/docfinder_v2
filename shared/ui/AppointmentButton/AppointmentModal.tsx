'use client';

import React, {useState, useEffect} from 'react';
import {format} from 'date-fns';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/shadcn/dialog';
import {toast} from 'sonner';
import {useAuthStore} from '@/shared/stores/authStore';
import {apiPost} from '@/shared/api';
import {TimeSlot} from './TimeSelector';
import {PatientFormData} from './PatientForm';
import {Procedure} from "@/shared/api/doctorsApi";
import {AppointmentStep1} from './AppointmentStep1';
import {AppointmentStep2} from './AppointmentStep2';
import {z} from 'zod';

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctorId?: number;
    doctorName?: string;
    procedureId?: string | number;
    procedureName?: string;
    schedule_today?: any[];
    schedule_tomorrow?: any[];
    schedule_day_after_tomorrow?: any[];
    availableProcedures?: Procedure[];
}

// Схема валидации для данных пациента
const patientSchema = z.object({
    first_name: z.string().min(1, 'Имя обязательно для заполнения'),
    last_name: z.string().min(1, 'Фамилия обязательна для заполнения'),
    middle_name: z.string().optional(),
    phone_number: z.string().regex(/^\+7\s[0-9]{3}\s[0-9]{3}\s[0-9]{4}$/, 'Введите корректный номер телефона'),
    iin_number: z.string().regex(/^[0-9]{12}$/, 'ИИН должен содержать 12 цифр'),
});

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
                                                                      isOpen,
                                                                      onClose,
                                                                      doctorId,
                                                                      doctorName,
                                                                      procedureId,
                                                                      procedureName,
                                                                      schedule_today = [],
                                                                      schedule_tomorrow = [],
                                                                      schedule_day_after_tomorrow = [],
                                                                      availableProcedures = []
                                                                  }) => {
    // Состояние для управления шагами
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Состояния для выбора данных
    const [selectedTab, setSelectedTab] = useState('today');
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

    // Активное расписание и клиника в зависимости от выбранного дня
    const [activeSchedule, setActiveSchedule] = useState<any>(schedule_today[0] || null);

    // Данные пользователя
    const [formData, setFormData] = useState<PatientFormData>({
        first_name: '',
        last_name: '',
        middle_name: '',
        phone_number: '',
        iin_number: '',
    });

    // Ошибки валидации
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Контекст из сторов
    const {isAuthenticated, user} = useAuthStore();

    // Заполняем форму данными пользователя, если он авторизован
    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                middle_name: user.middle_name || '',
                phone_number: user.phone_number || '',
                iin_number: user.iin_number || '',
            });
        }
    }, [isAuthenticated, user]);

    // Сброс данных при открытии/закрытии модального окна
    useEffect(() => {
        if (isOpen) {
            // Устанавливаем активное расписание на сегодня по умолчанию
            setActiveSchedule(schedule_today[0] || null);
            setSelectedTab('today');
            setSelectedTimeSlot(null);
            setStep(1);
            setFormErrors({});

            // Если пользователь не авторизован, очищаем форму
            if (!isAuthenticated) {
                setFormData({
                    first_name: '',
                    last_name: '',
                    middle_name: '',
                    phone_number: '+7 ',
                    iin_number: '',
                });
            }
        }
    }, [isOpen, schedule_today, isAuthenticated]);

    // Обработчик для работы с формой
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormData(prev => ({...prev, [name]: value}));

        // Очищаем ошибку поля при изменении
        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Обработчик выбора временного слота
    const handleTimeSlotSelect = (slot: TimeSlot) => {
        setSelectedTimeSlot(slot);
    };

    // Обработчик смены дня
    const handleTabChange = (tab: string) => {
        setSelectedTab(tab);
        setSelectedTimeSlot(null);

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
    };

    // Обработчик закрытия модального окна
    const handleClose = () => {
        onClose();
    };

    // Обработчики перехода между шагами
    const handleNextStep = () => {
        if (!selectedTimeSlot) {
            toast.error('Пожалуйста, выберите время приема');
            return;
        }

        if (!activeSchedule) {
            toast.error('Расписание недоступно');
            return;
        }

        if (!procedureId && availableProcedures.length === 0) {
            toast.error('Пожалуйста, выберите процедуру');
            return;
        }

        setStep(step + 1);
    };

    const handlePrevStep = () => {
        setStep(step - 1);
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
        if (!validateForm()) {
            // Покажем ошибки через тостер только если есть ошибки
            if (Object.keys(formErrors).length > 0) {
                toast.error('Пожалуйста, исправьте ошибки в форме');
            }
            return;
        }

        if (!doctorId || !procedureId || !activeSchedule || !selectedDate || !selectedTimeSlot) {
            toast.error('Не все параметры для записи выбраны');
            return;
        }

        setIsLoading(true);

        try {
            // Подготовка данных запроса
            const appointmentData: Record<string, any> = {
                doctor_id: doctorId,
                procedure_id: procedureId,
                clinic_id: activeSchedule.clinic_id,
                date: selectedDate,
                time_slot_id: selectedTimeSlot.id,
            };

            // Если пользователь не авторизован, добавляем персональные данные
            Object.assign(appointmentData, {
                first_name: formData.first_name,
                last_name: formData.last_name,
                middle_name: formData.middle_name,
                phone_number: formData.phone_number.replace(/\s+/g, ""),
                iin_number: formData.iin_number,
            });

            // Отправка запроса на создание визита
            const response = await apiPost('/patients_endpoints/visits/create-visit/', appointmentData);

            // Обработка успешного ответа
            toast.success('Запись на прием успешно создана', {
                position: 'top-right'
            });

            // Сбрасываем данные формы и закрываем модальное окно
            setFormData({
                first_name: '',
                last_name: '',
                middle_name: '',
                phone_number: '+7 ',
                iin_number: '',
            });
            setStep(1);
            handleClose();

        } catch (error: any) {
            // Обработка ошибок
            const errorMessage = error.response?.data?.error || 'Произошла ошибка при создании записи';
            toast.error(errorMessage);
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

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] p-0 max-h-[80vh] overflow-auto">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle className="text-xl font-semibold flex justify-between items-center">
                        Онлайн запись
                    </DialogTitle>
                </DialogHeader>

                {step === 1 ? (
                    <AppointmentStep1
                        doctorName={doctorName}
                        procedureName={procedureName}
                        onNextStep={handleNextStep}
                        selectedTab={selectedTab}
                        onTabChange={handleTabChange}
                        availableTimeSlots={timeSlots}
                        selectedTimeSlot={selectedTimeSlot}
                        onTimeSlotSelect={handleTimeSlotSelect}
                        clinicName={activeSchedule?.clinic_title}
                        clinicAddress={activeSchedule?.clinic_address}
                        availableProcedures={availableProcedures}
                    />
                ) : (
                    <AppointmentStep2
                        doctorName={doctorName}
                        procedureName={procedureName}
                        selectedDate={selectedDate}
                        selectedTimeSlot={selectedTimeSlot}
                        clinicName={activeSchedule?.clinic_title}
                        clinicAddress={activeSchedule?.clinic_address}
                        formData={formData}
                        onInputChange={handleInputChange}
                        isAuthenticated={isAuthenticated}
                        onPrevStep={handlePrevStep}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                        formErrors={formErrors}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
