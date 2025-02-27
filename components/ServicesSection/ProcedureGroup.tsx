// components/ServicesSection/ProcedureGroup.tsx
import React from 'react';
import Link from 'next/link';

interface ProcedureProps {
    medical_procedure_id: number;
    medical_procedure_title: string;
    medical_procedure_slug: string;
}

interface ProcedureGroupProps {
    procedure: ProcedureProps;
}

export const ProcedureGroup = ({ procedure }: ProcedureGroupProps) => {
    return (
        <div className="space-y-2">
            <Link
                href={`/procedure/${procedure.medical_procedure_slug}`}
                className="block group"
            >
                <h3 className="text-base text-blue-500 group-hover:text-blue-600">
                    {procedure.medical_procedure_title}
                </h3>
            </Link>
        </div>
    );
};
