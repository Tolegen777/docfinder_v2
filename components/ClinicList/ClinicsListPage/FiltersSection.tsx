import { useCityStore } from "@/shared/stores/cityStore";
import { useLocationStore } from "@/shared/stores/locationStore";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/shadcn/accordion";
import { Checkbox } from "@/components/shadcn/checkbox";
import React from "react";
import { useAmenities, useSpecialties } from "@/shared/api/queries/clinicQueries";

interface FiltersSectionProps {
    className?: string;
    filters: {
        specialities: number[];
        amenities: number[];
        isOpenNow: boolean;
        is24hours: boolean;
        nearbyOnly: boolean;
    };
    onFilterChange: (filterKey: string, value: any) => void;
    isLoading: boolean;
}

export const FiltersSection = ({
                                   className,
                                   filters,
                                   onFilterChange,
                                   isLoading
                               }: FiltersSectionProps) => {
    const { currentCity } = useCityStore();
    const { coords, hasLocation } = useLocationStore();
    const cityId = currentCity?.id as number;

    // Fetch amenities and specialties using React Query
    const amenitiesQuery = useAmenities(cityId);
    // const specialtiesQuery = useSpecialties(cityId);

    const handleCheckboxChange = (type: string, id?: number) => {
        if (type === "24h") {
            onFilterChange("is24hours", !filters.is24hours);
        } else if (type === "open-now") {
            onFilterChange("isOpenNow", !filters.isOpenNow);
        } else if (type === "nearby") {
            onFilterChange("nearbyOnly", !filters.nearbyOnly);
        } else if (type === "amenity" && id) {
            const newAmenities = filters.amenities.includes(id)
                ? filters.amenities.filter(amenityId => amenityId !== id)
                : [...filters.amenities, id];
            onFilterChange("amenities", newAmenities);
        } else if (type === "specialty" && id) {
            const newSpecialities = filters.specialities.includes(id)
                ? filters.specialities.filter(specId => specId !== id)
                : [...filters.specialities, id];
            onFilterChange("specialities", newSpecialities);
        }
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
                            {/*<label className="flex items-center space-x-2">*/}
                            {/*    <Checkbox*/}
                            {/*        id="24h"*/}
                            {/*        checked={filters.is24hours}*/}
                            {/*        onCheckedChange={() => handleCheckboxChange("24h")}*/}
                            {/*        disabled={isLoading}*/}
                            {/*    />*/}
                            {/*    <span className="text-sm text-gray-600">Круглосуточно</span>*/}
                            {/*</label>*/}
                            <label className="flex items-center space-x-2">
                                <Checkbox
                                    id="open-now"
                                    checked={filters.isOpenNow}
                                    onCheckedChange={() => handleCheckboxChange("open-now")}
                                    disabled={isLoading}
                                />
                                <span className="text-sm text-gray-600">Сейчас открыто</span>
                            </label>

                            {/* Фильтр "Рядом" - показывается только если есть местоположение */}
                            {hasLocation() && (
                                <label className="flex items-center space-x-2">
                                    <Checkbox
                                        id="nearby"
                                        checked={filters.nearbyOnly}
                                        onCheckedChange={() => handleCheckboxChange("nearby")}
                                        disabled={isLoading}
                                    />
                                    <span className="text-sm text-gray-600">Рядом</span>
                                </label>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="amenities" className="border-none">
                    <AccordionTrigger className="hover:no-underline p-0">
                        <span className="text-base font-medium">Удобства</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-0">
                        <div className="space-y-3">
                            {amenitiesQuery.isLoading ? (
                                <div className="text-sm text-gray-500">Загрузка...</div>
                            ) : amenitiesQuery.error ? (
                                <div className="text-sm text-red-500">Ошибка загрузки удобств</div>
                            ) : amenitiesQuery.data && amenitiesQuery.data.length > 0 ? (
                                amenitiesQuery.data.map((amenity) => (
                                    <label key={amenity.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`amenity-${amenity.id}`}
                                            checked={filters.amenities.includes(amenity.id)}
                                            onCheckedChange={() => handleCheckboxChange("amenity", amenity.id)}
                                            disabled={isLoading}
                                        />
                                        <span className="text-sm text-gray-600">{amenity.title}</span>
                                    </label>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500">Нет доступных удобств</div>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/*<AccordionItem value="specialties" className="border-none">*/}
                {/*    <AccordionTrigger className="hover:no-underline p-0">*/}
                {/*        <span className="text-base font-medium">Специальности</span>*/}
                {/*    </AccordionTrigger>*/}
                {/*    <AccordionContent className="pt-4 pb-0">*/}
                {/*        <div className="space-y-3">*/}
                {/*            {specialtiesQuery.isLoading ? (*/}
                {/*                <div className="text-sm text-gray-500">Загрузка...</div>*/}
                {/*            ) : specialtiesQuery.error ? (*/}
                {/*                <div className="text-sm text-red-500">Ошибка загрузки специальностей</div>*/}
                {/*            ) : specialtiesQuery.data && specialtiesQuery.data.length > 0 ? (*/}
                {/*                specialtiesQuery.data.map((specialty) => (*/}
                {/*                    <label key={specialty.id} className="flex items-center space-x-2">*/}
                {/*                        <Checkbox*/}
                {/*                            id={`specialty-${specialty.id}`}*/}
                {/*                            checked={filters.specialities.includes(specialty.id)}*/}
                {/*                            onCheckedChange={() => handleCheckboxChange("specialty", specialty.id)}*/}
                {/*                            disabled={isLoading}*/}
                {/*                        />*/}
                {/*                        <span className="text-sm text-gray-600">{specialty.title}</span>*/}
                {/*                    </label>*/}
                {/*                ))*/}
                {/*            ) : (*/}
                {/*                <div className="text-sm text-gray-500">Нет доступных специальностей</div>*/}
                {/*            )}*/}
                {/*        </div>*/}
                {/*    </AccordionContent>*/}
                {/*</AccordionItem>*/}
            </Accordion>
        </div>
    );
};
