'use client'
import React from 'react';
import { MapPin, Train, Bus } from 'lucide-react';
import {TimeStatus} from "@/shared/ui/TimeStatus/TimeStatus";
import {WeeklySchedule} from "@/components/ClinicDetails/ClinicHeader/WeeklySchedule";

interface WorkHour {
    day: string;
    time: string;
}

interface ClinicInfoBlockProps {
    address: string;
    metro?: string;
    busStop?: string;
    workHours: WorkHour[];
    showFullSchedule?: boolean;
}

export const ClinicInfoBlock: React.FC<ClinicInfoBlockProps> = ({
                                                                    address,
                                                                    metro,
                                                                    busStop,
                                                                    workHours,
                                                                    showFullSchedule = true
                                                                }) => {
    // Получаем текущий день недели (0 - воскресенье, 1 - понедельник, ...)
    const currentDayIndex = new Date().getDay() - 1;

    return (
        <div className="bg-white rounded-xl overflow-hidden p-4 space-y-3 h-full">
            <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 shrink-0 text-emerald-600" />
                <p className="text-sm">{address}</p>
            </div>

            {metro && (
                <div className="flex items-start gap-2">
                    <Train className="w-4 h-4 mt-1 shrink-0 text-emerald-600" />
                    <p className="text-sm">Метро: {metro}</p>
                </div>
            )}

            {busStop && (
                <div className="flex items-start gap-2">
                    <Bus className="w-4 h-4 mt-1 shrink-0 text-emerald-600" />
                    <p className="text-sm">Остановка: {busStop}</p>
                </div>
            )}

            <TimeStatus />

            {showFullSchedule && (
                <WeeklySchedule/>
            )}
        </div>
    );
};
