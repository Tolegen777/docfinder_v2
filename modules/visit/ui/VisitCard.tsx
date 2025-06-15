// src/components/ProfilePage/VisitTableRow.tsx
'use client';

import React from 'react';
import { MapPin, User } from 'lucide-react';
import Image from 'next/image';
import { TableRow, TableCell } from '@/components/shadcn/table';
import { Visit, formatVisitTime, formatVisitDate } from '@/shared/api/visitsApi';

interface VisitTableRowProps {
    visit: Visit;
}

const VisitTableRow: React.FC<VisitTableRowProps> = ({ visit }) => {
    const {
        date,
        visit_time,
        doctor_profile,
        clinic,
        procedure,
        visit_status
    } = visit;

    // Заглушка для цены - пока API не возвращает
    const mockPrice = "---";

    return (
        <TableRow className="hover:bg-gray-50/50">
            {/* Дата */}
            <TableCell className="font-medium">
                <div className="text-sm text-gray-900">
                    {formatVisitDate(date)}
                </div>
                <div className="text-xs text-gray-500">
                    {formatVisitTime(visit_time)}
                </div>
            </TableCell>

            {/* Врач */}
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {doctor_profile.main_photo_url ? (
                            <Image
                                src={doctor_profile.main_photo_url}
                                alt={doctor_profile.full_name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-5 h-5 text-gray-400" />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                            {doctor_profile.full_name}
                        </div>
                    </div>
                </div>
            </TableCell>

            {/* Клиника */}
            <TableCell>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                            {clinic.title}
                        </div>
                    </div>
                </div>
            </TableCell>

            {/* Услуга */}
            <TableCell>
                <div className="text-sm text-gray-700">
                    {procedure.title}
                </div>
            </TableCell>

            {/* Стоимость */}
            <TableCell className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                    {mockPrice}
                </div>
            </TableCell>
        </TableRow>
    );
};

export default VisitTableRow;
