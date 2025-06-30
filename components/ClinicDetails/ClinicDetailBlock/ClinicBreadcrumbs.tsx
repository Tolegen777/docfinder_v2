'use client'
import React from 'react';
import Link from 'next/link';

interface ClinicBreadcrumbsProps {
    clinicName: string;
}

export const ClinicBreadcrumbs: React.FC<ClinicBreadcrumbsProps> = ({ clinicName }) => {
    return (
        <div className="flex text-sm text-gray-500 mb-2 items-center">
            <Link href="/" className="hover:text-emerald-600 transition-colors">
                Главная
            </Link>
            <span className="mx-2">•</span>
            <span className="text-emerald-600">{clinicName}</span>
        </div>
    );
};
