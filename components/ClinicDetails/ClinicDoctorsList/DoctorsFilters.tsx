// components/ClinicDetails/ClinicDoctorsList/DoctorsFilters.tsx
'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/shadcn/accordion";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { ClinicDoctorsFilters } from '@/shared/api/clinicDoctorsApi';

interface DoctorsFiltersProps {
    className?: string;
    filters: ClinicDoctorsFilters;
    onFilterChange: (filters: ClinicDoctorsFilters) => void;
    isLoading?: boolean;
    availableSpecialities?: Array<{
        id: number;
        title: string;
    }>;
    availableProcedures?: Array<{
        id: number;
        title: string;
    }>;
}

export const DoctorsFilters: React.FC<DoctorsFiltersProps> = ({
                                                                  className,
                                                                  filters,
                                                                  onFilterChange,
                                                                  isLoading = false,
                                                                  availableSpecialities = [],
                                                                  availableProcedures = []
                                                              }) => {
    const handleSpecialityChange = (specialityId: number, checked: boolean) => {
        const currentSpecialities = filters.specialities || [];
        const newSpecialities = checked
            ? [...currentSpecialities, specialityId]
            : currentSpecialities.filter(id => id !== specialityId);

        onFilterChange({
            ...filters,
            specialities: newSpecialities,
            page: 1 // Сбрасываем на первую страницу при изменении фильтров
        });
    };

    const handleProcedureChange = (procedureId: number, checked: boolean) => {
        const currentProcedures = filters.procedures || [];
        const newProcedures = checked
            ? [...currentProcedures, procedureId]
            : currentProcedures.filter(id => id !== procedureId);

        onFilterChange({
            ...filters,
            procedures: newProcedures,
            page: 1
        });
    };

    const handleGenderChange = (gender: string) => {
        onFilterChange({
            ...filters,
            gender: gender === 'all' ? undefined : (gender as 'MALE' | 'FEMALE'),
            page: 1
        });
    };

    const clearAllFilters = () => {
        onFilterChange({
            page: 1,
            page_size: filters.page_size || 10
        });
    };

    const hasActiveFilters =
        (filters.specialities && filters.specialities.length > 0) ||
        (filters.procedures && filters.procedures.length > 0) ||
        filters.gender;

    return (
        <div className={cn("bg-white rounded-xl p-4 shadow-sm", className)}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Фильтры врачей</h2>
                {hasActiveFilters && (
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-emerald-600 hover:text-emerald-700 underline"
                        disabled={isLoading}
                    >
                        Очистить все
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {/* Фильтр по полу */}
                <div>
                    <label className="text-sm font-medium mb-2 block">Пол врача</label>
                    <Select
                        value={filters.gender || 'all'}
                        onValueChange={handleGenderChange}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Выберите пол" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Все</SelectItem>
                            <SelectItem value="MALE">Мужской</SelectItem>
                            <SelectItem value="FEMALE">Женский</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Accordion type="multiple" defaultValue={["specialities", "procedures"]} className="space-y-2">
                    {/* Фильтр по специальностям */}
                    <AccordionItem value="specialities" className="border-none">
                        <AccordionTrigger className="hover:no-underline p-0">
                            <span className="text-sm font-medium">
                                Специальности
                                {filters.specialities && filters.specialities.length > 0 && (
                                    <span className="ml-1 text-emerald-600">({filters.specialities.length})</span>
                                )}
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-3 pb-0">
                            <div className="space-y-3 max-h-48 overflow-y-auto">
                                {availableSpecialities.length > 0 ? (
                                    availableSpecialities.map((speciality) => (
                                        <label key={speciality.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`speciality-${speciality.id}`}
                                                checked={filters.specialities?.includes(speciality.id) || false}
                                                onCheckedChange={(checked) =>
                                                    handleSpecialityChange(speciality.id, checked as boolean)
                                                }
                                                disabled={isLoading}
                                            />
                                            <span className="text-sm text-gray-600">{speciality.title}</span>
                                        </label>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-500">
                                        {isLoading ? 'Загрузка...' : 'Нет доступных специальностей'}
                                    </div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Фильтр по процедурам */}
                    <AccordionItem value="procedures" className="border-none">
                        <AccordionTrigger className="hover:no-underline p-0">
                            <span className="text-sm font-medium">
                                Процедуры
                                {filters.procedures && filters.procedures.length > 0 && (
                                    <span className="ml-1 text-emerald-600">({filters.procedures.length})</span>
                                )}
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="pt-3 pb-0">
                            <div className="space-y-3 max-h-48 overflow-y-auto">
                                {availableProcedures.length > 0 ? (
                                    availableProcedures.map((procedure) => (
                                        <label key={procedure.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`procedure-${procedure.id}`}
                                                checked={filters.procedures?.includes(procedure.id) || false}
                                                onCheckedChange={(checked) =>
                                                    handleProcedureChange(procedure.id, checked as boolean)
                                                }
                                                disabled={isLoading}
                                            />
                                            <span className="text-sm text-gray-600">{procedure.title}</span>
                                        </label>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-500">
                                        {isLoading ? 'Загрузка...' : 'Нет доступных процедур'}
                                    </div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
};
