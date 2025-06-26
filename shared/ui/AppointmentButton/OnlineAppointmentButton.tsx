// shared/ui/AppointmentButton/OnlineAppointmentButton.tsx
'use client';

import React, { useState } from 'react';
import { Pen } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { NewAppointmentModal } from './NewAppointmentModal';
import { Procedure, Consultation, WeeklySchedule, TimeSlot } from "@/shared/api/doctorsApi";

interface OnlineAppointmentButtonProps {
    doctorId: number;
    doctorName?: string;
    doctorPhoto?: string;
    // Новая структура данных
    weeklySchedule: WeeklySchedule[];
    procedures: Procedure[];
    consultation?: Consultation;
    // Дополнительные параметры
    className?: string;
    buttonText?: string;
    // Новые пропсы для предзаполнения
    preselectedTimeSlot?: TimeSlot | null;
    preselectedDate?: string;
}

const OnlineAppointmentButton: React.FC<OnlineAppointmentButtonProps> = ({
                                                                             doctorId,
                                                                             doctorName,
                                                                             doctorPhoto,
                                                                             weeklySchedule,
                                                                             procedures,
                                                                             consultation,
                                                                             className = '',
                                                                             buttonText = 'Записаться онлайн',
                                                                             preselectedTimeSlot = null,
                                                                             preselectedDate
                                                                         }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button
                className={className}
                onClick={handleOpenModal}
            >
                <Pen className="w-5 h-5 text-white"/>
                <span className="text-base font-semibold">{buttonText}</span>
            </Button>

            {isModalOpen && <NewAppointmentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                doctorId={doctorId}
                doctorName={doctorName}
                doctorPhoto={doctorPhoto}
                weeklySchedule={weeklySchedule}
                procedures={procedures}
                consultation={consultation}
                preselectedTimeSlot={preselectedTimeSlot}
                preselectedDate={preselectedDate}
            />}
        </>
    );
};

export default OnlineAppointmentButton;
