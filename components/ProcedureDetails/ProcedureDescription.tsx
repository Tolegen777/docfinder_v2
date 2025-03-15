'use client'

import React, { useState } from 'react';
import { MaxWidthLayout } from "@/shared/ui/MaxWidthLayout";
import { Description } from '@/shared/api/procedureDetailsApi';

interface ProcedureDescriptionProps {
    descriptions: Description[];
}

export const ProcedureDescription: React.FC<ProcedureDescriptionProps> = ({ descriptions }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Get the first description for the initial view
    const mainDescription = descriptions?.[0] || { id: 0, title: 'Общая информация', content: '' };

    // Get the rest of the descriptions for the expanded view
    const additionalDescriptions = descriptions?.slice(1) || [];

    const hasAdditionalContent = additionalDescriptions.length > 0;

    return (
        <MaxWidthLayout>
            <div className="mb-4">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{mainDescription.title}</h1>

                <div className="text-base text-gray-700 mb-4"
                     dangerouslySetInnerHTML={{ __html: mainDescription.content }} />
            </div>

            {isExpanded && additionalDescriptions.length > 0 && (
                <div className="mb-4">
                    {additionalDescriptions.map((description) => (
                        <div key={description.id} className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">{description.title}</h2>
                            <div className="text-base text-gray-700"
                                 dangerouslySetInnerHTML={{ __html: description.content }} />
                        </div>
                    ))}
                </div>
            )}

            {hasAdditionalContent && (
                <button
                    className="flex items-center justify-center w-full border border-green-500 rounded-md py-3 text-green-500 hover:bg-green-50 transition-colors mb-5"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 mr-2" fill="currentColor">
                        <path d={isExpanded ?
                            "M19 9l-7 7-7-7" :
                            "M12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm1-6.83V14h-2v-2.83l-2.59 2.59L7 12.34 12 7.34l5 5-1.41 1.42L13 11.17z"}
                        />
                    </svg>
                    {isExpanded ? 'Скрыть' : 'Показать еще'}
                </button>
            )}
        </MaxWidthLayout>
    );
};
