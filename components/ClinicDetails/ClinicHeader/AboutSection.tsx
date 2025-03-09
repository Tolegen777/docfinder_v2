import React from 'react';
import {Clock} from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/shared/ui/shadcn/accordion";
import {MaxWidthLayout} from "@/shared/ui/MaxWidthLayout";

interface AboutSectionProps {
    description: {
        id: number;
        title: string;
        content: string;
    }[];
    features?: { id: string; icon: string; title: string }[];
    amenities?: { id: number; title: string }[];
    specializations?: string[];
    procedures?: string[];
}

function getAmenityIcon(title: string): string {
    const iconMap: { [key: string]: string } = {
        'Стационар': '🏥',
        'Прием анализов': '🧪',
        'Больничный': '📋',
        'Для детей': '👶',
        'WiFi': '📶',
        'Диагностика': '🔬',
        'Детская зона': '🎮',
        'Аптека': '💊',
        'Круглосуточно': '⏰',
        'Парковка': '🅿️',
        'Карточки': '💳',
    };

    // Пытаемся найти подходящую иконку по ключевым словам
    for (const [key, icon] of Object.entries(iconMap)) {
        if (title.toLowerCase().includes(key.toLowerCase())) {
            return icon;
        }
    }

    // Если не нашли, возвращаем общую иконку
    return '✅';
}

export const AboutSection: React.FC<AboutSectionProps> = ({
                                                              description,
                                                              features = [],
                                                              amenities = [],
                                                              specializations = [],
                                                              procedures = []
                                                          }) => {
    const [showAllSpecs, setShowAllSpecs] = React.useState(false);
    const [showAllProcedures, setShowAllProcedures] = React.useState(false);
    // Если описание приходит из API как массив фрагментов, объединяем их
    const descriptionText = Array.isArray(description) && description.length > 0
        ? description.map(fragment => fragment.content || '').join(' ')
        : ''; // (м)

    // Используем переданные amenities или особенности/моковые данные
    const featuresToShow = amenities.map(amenity => ({
        id: `amenity-${amenity.id}`,
        icon: getAmenityIcon(amenity.title), // Функция для подбора иконки
        title: amenity.title
    }))


    // Функция для определения иконки в зависимости от типа удобства

    // Общий компонент аккордеона для мобильной и десктопной версий
    const AccordionSection = () => (
        <Accordion type="multiple" className="w-full" defaultValue={["specializations", "services", "about"]}>
            <AccordionItem value="about" className="border-b">
                <AccordionTrigger className="hover:no-underline group">
                    <h2 className="text-xl font-medium group-data-[state=open]:text-emerald-600">О клинике</h2>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            {descriptionText}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {featuresToShow.map((feature) => (
                                <div key={feature.id} className="flex items-center gap-2">
                                    <span className="text-xl">{feature.icon}</span>
                                    <span className="text-sm text-gray-600">{feature.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="specializations" className="border-b">
                <AccordionTrigger className="hover:no-underline group">
                    <h2 className="text-xl font-medium group-data-[state=open]:text-emerald-600">Специализации</h2>
                </AccordionTrigger>
                <AccordionContent>
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
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="services" className="border-b">
                <AccordionTrigger className="hover:no-underline group">
                    <h2 className="text-xl font-medium group-data-[state=open]:text-emerald-600">Услуги</h2>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-wrap gap-2">
                        {procedures.slice(0, showAllProcedures ? undefined : 8).map((service, index) => (
                            <button
                                key={index}
                                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full
                     text-sm text-gray-600 transition-colors"
                            >
                                {service}
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
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );

    return (
        <MaxWidthLayout>
            <AccordionSection/>
        </MaxWidthLayout>
    );
};
