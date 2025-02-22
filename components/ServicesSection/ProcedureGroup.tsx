// components/ServicesSection/ProcedureGroup.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { MedicalProcedure } from '@/shared/api/proceduresApi';
import { Button } from '@/components/shadcn/button';

interface ProcedureGroupProps {
    procedure: MedicalProcedure;
}

export const ProcedureGroup = ({ procedure }: ProcedureGroupProps) => {
    const [showAll, setShowAll] = useState(false);
    const hasDescriptions = procedure.descriptions && procedure.descriptions.length > 0;
    const descriptions = hasDescriptions
        ? (showAll ? procedure.descriptions : procedure.descriptions.slice(0, 10))
        : [];

    const toggleShow = () => setShowAll(!showAll);

    return (
        <div className="space-y-4">
            <h3 className="text-base font-semibold">
                {!hasDescriptions ? (
                    <Link
                        href={`/procedure/${procedure.medical_procedure_id}`}
                        className="text-blue-500 hover:text-blue-600"
                    >
                        {procedure.medical_procedure_title}
                    </Link>
                ) : (
                    procedure.medical_procedure_title
                )}
            </h3>

            {hasDescriptions && (
                <div className="space-y-2">
                    {descriptions.map((desc) => (
                        <Link
                            key={desc.id}
                            href={`/procedure-description/${desc.id}`}
                            className="flex gap-2 group p-14-18-400"
                        >
                            <span className="text-blue-500 group-hover:text-blue-600">
                                {desc.title || `Описание ${desc.id}`}
                            </span>
                        </Link>
                    ))}

                    {procedure.descriptions.length > 10 && (
                        <Button
                            variant="outline"
                            className="text-green-500 border-green-500 hover:bg-green-50"
                            onClick={toggleShow}
                        >
                            {showAll ? 'Скрыть' : 'Еще...'}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};
