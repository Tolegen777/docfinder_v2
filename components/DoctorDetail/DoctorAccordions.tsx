import React, { useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/shadcn/accordion";

interface DoctorAccordionsProps {
    description: {
        id: number;
        title: string;
        content: string;
    }[];
    specializations: string[];
    procedures: string[];
}

export const DoctorAccordions: React.FC<DoctorAccordionsProps> = ({
                                                                      description,
                                                                      specializations,
                                                                      procedures
                                                                  }) => {
    const [showAllSpecs, setShowAllSpecs] = useState(false);
    const [showAllProcedures, setShowAllProcedures] = useState(false);

    // Combine description fragments into a formatted string
    const getDescriptionText = () => {
        if (!description || description.length === 0) {
            return "Информация о враче отсутствует.";
        }

        return description.map(fragment => {
            return (
                <div key={fragment.id} className="mb-4">
                    {fragment.title && (
                        <h3 className="text-lg font-medium mb-2">{fragment.title}</h3>
                    )}
                    <p className="text-gray-600">{fragment.content}</p>
                </div>
            );
        });
    };

    return (
        <Accordion type="multiple" className="w-full" defaultValue={["about", "specializations", "services"]}>
            <AccordionItem value="about" className="border-b">
                <AccordionTrigger className="hover:no-underline group">
                    <h2 className="text-xl font-medium group-data-[state=open]:text-emerald-600">Информация о враче</h2>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-4">
                        {getDescriptionText()}
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="specializations" className="border-b">
                <AccordionTrigger className="hover:no-underline group">
                    <h2 className="text-xl font-medium group-data-[state=open]:text-emerald-600">Специализации</h2>
                </AccordionTrigger>
                <AccordionContent>
                    {specializations && specializations.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {specializations.slice(0, showAllSpecs ? undefined : 10).map((spec, index) => (
                                <button
                                    key={index}
                                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full
                                    text-sm text-gray-600 transition-colors"
                                >
                                    {spec}
                                </button>
                            ))}
                            {specializations.length > 10 && (
                                <div
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowAllSpecs(!showAllSpecs);
                                    }}
                                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full
                                    text-sm text-emerald-600 transition-colors cursor-pointer"
                                >
                                    {showAllSpecs ? 'Скрыть' : 'Ещё...'}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-500">Специализации не указаны</p>
                    )}
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="services" className="border-b">
                <AccordionTrigger className="hover:no-underline group">
                    <h2 className="text-xl font-medium group-data-[state=open]:text-emerald-600">Услуги</h2>
                </AccordionTrigger>
                <AccordionContent>
                    {procedures && procedures.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {procedures.slice(0, showAllProcedures ? undefined : 8).map((procedure, index) => (
                                <button
                                    key={index}
                                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full
                                    text-sm text-gray-600 transition-colors"
                                >
                                    {procedure}
                                </button>
                            ))}
                            {procedures.length > 8 && (
                                <div
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowAllProcedures(!showAllProcedures);
                                    }}
                                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full
                                    text-sm text-emerald-600 transition-colors cursor-pointer"
                                >
                                    {showAllProcedures ? 'Скрыть' : 'Ещё...'}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-500">Услуги не указаны</p>
                    )}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};
