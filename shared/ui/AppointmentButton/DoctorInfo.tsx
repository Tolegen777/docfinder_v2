'use client';

import React from 'react';
import Image from 'next/image';
import doctorAvatar from '@/shared/assets/images/doctorCard.png';

interface DoctorInfoProps {
    doctorName: string;
    procedureName?: string;
}

export const DoctorInfo: React.FC<DoctorInfoProps> = ({ doctorName, procedureName }) => {
    return (
        <div className="flex items-center gap-3">
            <Image src={doctorAvatar} width={64} height={64} alt={doctorName} className="rounded-full" />
            <div>
                <h3 className="font-semibold text-lg">{doctorName}</h3>
                {procedureName && <p className="text-gray-600">{procedureName}</p>}
            </div>
        </div>
    );
};
