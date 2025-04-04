'use client';

import React, { useState } from 'react';
import { Pen } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { AppointmentModal } from './AppointmentModal';
import { Procedure } from "@/shared/api/doctorsApi";

interface OnlineAppointmentButtonProps {
    doctorId: number;
    doctorName?: string;
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
}

const OnlineAppointmentButton: React.FC<OnlineAppointmentButtonProps> = ({
                                                                             doctorId,
                                                                             doctorName,
                                                                             procedureId,
                                                                             procedureName,
                                                                             schedule_today = [],
                                                                             schedule_tomorrow = [],
                                                                             schedule_day_after_tomorrow = [],
                                                                             className = '',
                                                                             buttonText = 'Записаться онлайн',
                                                                             procedures
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

            <AppointmentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                doctorId={doctorId}
                doctorName={doctorName}
                procedureId={procedureId}
                procedureName={procedureName}
                schedule_today={schedule_today}
                schedule_tomorrow={schedule_tomorrow}
                schedule_day_after_tomorrow={schedule_day_after_tomorrow}
                availableProcedures={procedures}
            />
        </>
    );
};

export default OnlineAppointmentButton;
