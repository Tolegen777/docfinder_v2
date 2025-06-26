// shared/ui/AppointmentButton/OnlineAppointmentButton.tsx
'use client';

import React, { useState } from 'react';
import { Pen } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { NewAppointmentModal } from './NewAppointmentModal';
import { Procedure } from "@/shared/api/doctorsApi";
import {TimeSlot} from "@/shared/api/doctorsApi";

interface OnlineAppointmentButtonProps {
    doctorId: number;
    doctorName?: string;
    doctorPhoto?: string;
    procedureId?: string | number;
    procedureName?: string;
    // Данные о расписании
    schedule_today?: any[];
    schedule_tomorrow?: any[];
    schedule_day_after_tomorrow?: any[];
    // Дополнительные параметры
    className?: string;
    buttonText?: string;
    procedures?: Procedure[];
    // Новые пропсы для предзаполнения
    preselectedTimeSlot?: TimeSlot | null;
    preselectedDate?: 'today' | 'tomorrow' | 'day_after';
}

const OnlineAppointmentButton: React.FC<OnlineAppointmentButtonProps> = ({
                                                                             doctorId,
                                                                             doctorName,
                                                                             doctorPhoto,
                                                                             procedureId,
                                                                             procedureName,
                                                                             schedule_today = [],
                                                                             schedule_tomorrow = [],
                                                                             schedule_day_after_tomorrow = [],
                                                                             className = '',
                                                                             buttonText = 'Записаться онлайн',
                                                                             procedures,
                                                                             preselectedTimeSlot = null,
                                                                             preselectedDate = 'today'
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

            <NewAppointmentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                doctorId={doctorId}
                doctorName={doctorName}
                doctorPhoto={doctorPhoto}
                procedureId={procedureId}
                procedureName={procedureName}
                schedule_today={schedule_today}
                schedule_tomorrow={schedule_tomorrow}
                schedule_day_after_tomorrow={schedule_day_after_tomorrow}
                availableProcedures={procedures}
                preselectedTimeSlot={preselectedTimeSlot}
                preselectedDate={preselectedDate}
            />
        </>
    );
};

export default OnlineAppointmentButton;
