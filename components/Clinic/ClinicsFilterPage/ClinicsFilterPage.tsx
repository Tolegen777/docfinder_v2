import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../../shadcn/accordion";
import { Checkbox } from "../../shadcn/checkbox";
import { cn } from "@/shared/lib/utils";
import ClinicCard from "../ClinicCard/ClinicCard";

// Импорт компонента карточки клиники

const filters = {
    "Время работы": [
        { id: "24h", label: "Круглосуточно" },
        { id: "open-now", label: "Сейчас открыто" },
    ],
    "Удобства": [
        { id: "parking", label: "Парковка" },
        { id: "wifi", label: "Вайфай" },
        { id: "kids-room", label: "Детская игровая комната" },
        { id: "waiting-room", label: "Комната ожидания" },
        { id: "kids-corner", label: "Детская игровая комната" },
        { id: "cafe", label: "Кафе" },
        { id: "pharmacy", label: "Аптека" },
    ]
};

// Моковые данные для клиник
const clinics = Array(5).fill(null);

const FiltersSection = ({ className }) => {
    return (
        <div className={cn("bg-white rounded-xl p-4 shadow-sm", className)}>
            <h2 className="text-lg font-medium mb-4">Фильтр</h2>

            <Accordion type="multiple" defaultValue={["time", "amenities"]} className="space-y-4">
                <AccordionItem value="time" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0">
                        <span className="text-base font-medium">Время работы</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-0">
                        <div className="space-y-3">
                            {filters["Время работы"].map((item) => (
                                <label key={item.id} className="flex items-center space-x-2">
                                    <Checkbox id={item.id} />
                                    <span className="text-sm text-gray-600">{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="amenities" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0">
                        <span className="text-base font-medium">Удобства</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-0">
                        <div className="space-y-3">
                            {filters["Удобства"].map((item) => (
                                <label key={item.id} className="flex items-center space-x-2">
                                    <Checkbox id={item.id} />
                                    <span className="text-sm text-gray-600">{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="filter3" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0">
                        <span className="text-base font-medium">Фильтр 3</span>
                    </AccordionTrigger>
                    <AccordionContent>
                        {/* Содержимое фильтра 3 */}
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="filter4" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0">
                        <span className="text-base font-medium">Фильтр 4</span>
                    </AccordionTrigger>
                    <AccordionContent>
                        {/* Содержимое фильтра 4 */}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

const ClinicsPage = () => {
    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
            {/* Мобильная версия */}
            <div className="md:hidden space-y-4">
                <FiltersSection className="w-full" />
                <div className="space-y-4">
                    {clinics.map((_, index) => (
                        <ClinicCard key={index} />
                    ))}
                </div>
            </div>

            {/* Десктопная версия */}
            <div className="hidden md:flex gap-6">
                <aside className="w-[280px] shrink-0">
                    <FiltersSection className="" />
                </aside>
                <main className="flex-1 space-y-4">
                    {clinics.map((_, index) => (
                        <ClinicCard key={index} />
                    ))}
                </main>
            </div>
        </div>
    );
};

export default ClinicsPage;
