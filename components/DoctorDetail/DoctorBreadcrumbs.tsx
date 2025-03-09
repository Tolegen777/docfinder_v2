'use client'
import React from 'react';
import Link from 'next/link';

interface DoctorBreadcrumbsProps {
    doctorName: string;
    specialization?: string;
}

export const DoctorBreadcrumbs: React.FC<DoctorBreadcrumbsProps> = ({
                                                                        doctorName,
                                                                        specialization = 'Специалист' // Default value if not provided
                                                                    }) => {
    return (
        <div className="flex text-sm text-gray-500 mb-2 items-center">
            <Link href="/" className="hover:text-emerald-600 transition-colors">
                Главная
            </Link>
            <span className="mx-2">•</span>
            <Link href="/doctors" className="hover:text-emerald-600 transition-colors">
                Врачи
            </Link>
            {specialization && (
                <>
                    <span className="mx-2">•</span>
                    <Link href={`/doctors?spec=${encodeURIComponent(specialization)}`} className="hover:text-emerald-600 transition-colors">
                        {specialization}
                    </Link>
                </>
            )}
            <span className="mx-2">•</span>
            <span className="text-emerald-600">{doctorName}</span>
        </div>
    );
};
