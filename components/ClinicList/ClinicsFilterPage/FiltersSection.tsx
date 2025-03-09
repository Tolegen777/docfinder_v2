import {useCityStore} from "@/shared/stores/cityStore";
import {useClinicsStore} from "@/shared/stores/clinicsStore";
import {cn} from "@/lib/utils";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/shadcn/accordion";
import {Checkbox} from "@/components/shadcn/checkbox";
import React, { useEffect } from "react";

export const FiltersSection = ({ className }) => {
    const { currentCity } = useCityStore();
    const {
        amenities,
        specialties,
        filters,
        toggleOpenNow,
        toggle24Hours,
        toggleAmenity,
        toggleSpeciality,
        applyFilters,
        loading,
        fetchSpecialties,
        currentPage
    } = useClinicsStore();

    // Загружаем специальности при инициализации компонента
    useEffect(() => {
        fetchSpecialties(currentCity?.id as number);
    }, [fetchSpecialties, currentCity?.id as number]);

    const handleCheckboxChange = async (type: string, id?: number) => {
        if (type === "24h") {
            toggle24Hours();
        } else if (type === "open-now") {
            toggleOpenNow();
        } else if (type === "amenity" && id) {
            toggleAmenity(id);
        } else if (type === "specialty" && id) {
            toggleSpeciality(id);
        }

        // Apply filters after any change and reset to page 1
        await applyFilters(currentCity?.id as number, 1);
    };

    return (
        <div className={cn("bg-white rounded-xl p-4 shadow-sm", className)}>
            <h2 className="text-lg font-medium mb-4">Фильтр</h2>

            <Accordion type="multiple" defaultValue={["time", "amenities", "specialties"]} className="space-y-4">
                <AccordionItem value="time" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0">
                        <span className="text-base font-medium">Время работы</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-0">
                        <div className="space-y-3">
                            <label className="flex items-center space-x-2">
                                <Checkbox
                                    id="24h"
                                    checked={filters["24hours"]}
                                    onCheckedChange={() => handleCheckboxChange("24h")}
                                    disabled={loading}
                                />
                                <span className="text-sm text-gray-600">Круглосуточно (мок)</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <Checkbox
                                    id="open-now"
                                    checked={filters.openNow}
                                    onCheckedChange={() => handleCheckboxChange("open-now")}
                                    disabled={loading}
                                />
                                <span className="text-sm text-gray-600">Сейчас открыто (мок)</span>
                            </label>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="amenities" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0">
                        <span className="text-base font-medium">Удобства</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-0">
                        <div className="space-y-3">
                            {amenities.length > 0 ? (
                                amenities.map((amenity) => (
                                    <label key={amenity.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`amenity-${amenity.id}`}
                                            checked={filters.amenities.includes(amenity.id)}
                                            onCheckedChange={() => handleCheckboxChange("amenity", amenity.id)}
                                            disabled={loading}
                                        />
                                        <span className="text-sm text-gray-600">{amenity.title}</span>
                                    </label>
                                ))
                            ) : (
                                // Fallback to mocked amenities if API doesn't return any
                                [
                                    { id: 1, title: "Парковка" },
                                    { id: 2, title: "Вайфай" },
                                    { id: 3, title: "Детская игровая комната" },
                                    { id: 4, title: "Комната ожидания" },
                                    { id: 5, title: "Кафе" },
                                    { id: 6, title: "Аптека" },
                                ].map((amenity) => (
                                    <label key={amenity.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`amenity-${amenity.id}`}
                                            checked={filters.amenities.includes(amenity.id)}
                                            onCheckedChange={() => handleCheckboxChange("amenity", amenity.id)}
                                            disabled={loading}
                                        />
                                        <span className="text-sm text-gray-600">{amenity.title} (мок)</span>
                                    </label>
                                ))
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="specialties" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0">
                        <span className="text-base font-medium">Специальности</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-0">
                        <div className="space-y-3">
                            {specialties.length > 0 ? (
                                specialties.map((specialty) => (
                                    <label key={specialty.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`specialty-${specialty.id}`}
                                            checked={filters.specialities.includes(specialty.id)}
                                            onCheckedChange={() => handleCheckboxChange("specialty", specialty.id)}
                                            disabled={loading}
                                        />
                                        <span className="text-sm text-gray-600">{specialty.title}</span>
                                    </label>
                                ))
                            ) : (
                                // Fallback to mocked specialties if API doesn't return any
                                [
                                    { id: 1, title: "Терапевт" },
                                    { id: 2, title: "Кардиолог" },
                                    { id: 3, title: "Невролог" },
                                    { id: 4, title: "Гастроэнтеролог" },
                                    { id: 5, title: "Эндокринолог" },
                                    { id: 6, title: "Педиатр" },
                                ].map((specialty) => (
                                    <label key={specialty.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`specialty-${specialty.id}`}
                                            checked={filters.specialities.includes(specialty.id)}
                                            onCheckedChange={() => handleCheckboxChange("specialty", specialty.id)}
                                            disabled={loading}
                                        />
                                        <span className="text-sm text-gray-600">{specialty.title} (мок)</span>
                                    </label>
                                ))
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="filter4" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0">
                        <span className="text-base font-medium">Фильтр 4 (нет)</span>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="text-sm text-gray-500 italic">Функциональность не реализована на бэкенде</div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};
