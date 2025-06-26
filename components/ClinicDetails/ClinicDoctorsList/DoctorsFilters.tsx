// components/ClinicDetails/ClinicDoctorsList/DoctorsFilters.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/shadcn/accordion";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Input } from "@/components/shadcn/input";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { ClinicDoctorsFilters } from '@/shared/api/clinicDoctorsApi';
import { AllSpecialtiesAPI, AllSpecialty } from '@/shared/api/specialtiesApi';
import { AllProceduresAPI, AllProcedure } from '@/shared/api/proceduresApi';

interface DoctorsFiltersProps {
    className?: string;
    filters: ClinicDoctorsFilters;
    onFilterChange: (filters: ClinicDoctorsFilters) => void;
    isLoading?: boolean;
    setCurrentPage: (page: number) => void;
}

const INITIAL_ITEMS_COUNT = 10;

export const DoctorsFilters: React.FC<DoctorsFiltersProps> = ({
                                                                  className,
                                                                  filters,
                                                                  onFilterChange,
                                                                  setCurrentPage,
                                                                  isLoading = false,
                                                              }) => {
    // Состояния для поиска
    const [specialtySearch, setSpecialtySearch] = useState('');
    const [procedureSearch, setProcedureSearch] = useState('');

    // Состояния для "показать еще"
    const [showAllSpecialties, setShowAllSpecialties] = useState(false);
    const [showAllProcedures, setShowAllProcedures] = useState(false);

    // Запросы к API
    const { data: allSpecialties = [], isLoading: isLoadingSpecialties } = useQuery({
        queryKey: ['all-specialties'],
        queryFn: AllSpecialtiesAPI.getAllSpecialties,
        staleTime: 5 * 60 * 1000, // 5 минут
    });

    const { data: allProcedures = [], isLoading: isLoadingProcedures } = useQuery({
        queryKey: ['all-procedures'],
        queryFn: AllProceduresAPI.getAllProcedures,
        staleTime: 5 * 60 * 1000, // 5 минут
    });

    // Фильтрация специальностей по поиску
    const filteredSpecialties = useMemo(() => {
        return allSpecialties.filter(specialty =>
            specialty.title.toLowerCase().includes(specialtySearch.toLowerCase())
        );
    }, [allSpecialties, specialtySearch]);

    // Фильтрация процедур по поиску
    const filteredProcedures = useMemo(() => {
        return allProcedures.filter(procedure =>
            procedure.title.toLowerCase().includes(procedureSearch.toLowerCase())
        );
    }, [allProcedures, procedureSearch]);

    // Получаем отображаемые элементы
    const displayedSpecialties = useMemo(() => {
        const items = filteredSpecialties;
        return showAllSpecialties || specialtySearch ? items : items.slice(0, INITIAL_ITEMS_COUNT);
    }, [filteredSpecialties, showAllSpecialties, specialtySearch]);

    const displayedProcedures = useMemo(() => {
        const items = filteredProcedures;
        return showAllProcedures || procedureSearch ? items : items.slice(0, INITIAL_ITEMS_COUNT);
    }, [filteredProcedures, showAllProcedures, procedureSearch]);

    const handleSpecialityChange = (specialityId: number, checked: boolean) => {
        const currentSpecialities = filters.specialities || [];
        const newSpecialities = checked
            ? [...currentSpecialities, specialityId]
            : currentSpecialities.filter(id => id !== specialityId);

        onFilterChange({
            ...filters,
            specialities: newSpecialities,
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
        });
        setCurrentPage(1)
    };

    const handleGenderChange = (gender: string) => {
        onFilterChange({
            ...filters,
            gender: gender === 'all' ? undefined : (gender as 'MALE' | 'FEMALE'),
        });
        setCurrentPage(1)
    };

    const clearAllFilters = () => {
        setCurrentPage(1)
        setSpecialtySearch('');
        setProcedureSearch('');
        setShowAllSpecialties(false);
        setShowAllProcedures(false);
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
                        <AccordionContent className="pt-3 pb-0 px-0.5">
                            {/* Поиск по специальностям */}
                            <div className="relative mb-3">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Поиск специальностей..."
                                    value={specialtySearch}
                                    onChange={(e) => setSpecialtySearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <div className="space-y-3 max-h-[380px] overflow-y-auto">
                                {isLoadingSpecialties ? (
                                    <div className="text-sm text-gray-500">Загрузка специальностей...</div>
                                ) : displayedSpecialties.length > 0 ? (
                                    displayedSpecialties.map((speciality) => (
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
                                        {specialtySearch ? 'Ничего не найдено' : 'Нет доступных специальностей'}
                                    </div>
                                )}

                                {/* Кнопка "Показать еще" для специальностей */}
                                {!specialtySearch && filteredSpecialties.length > INITIAL_ITEMS_COUNT && (
                                    <button
                                        onClick={() => setShowAllSpecialties(!showAllSpecialties)}
                                        className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                    >
                                        {showAllSpecialties ? (
                                            <>
                                                <ChevronUp className="w-4 h-4" />
                                                Скрыть
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="w-4 h-4" />
                                                Показать еще ({filteredSpecialties.length - INITIAL_ITEMS_COUNT})
                                            </>
                                        )}
                                    </button>
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
                        <AccordionContent className="pt-3 pb-0 px-0.5">
                            {/* Поиск по процедурам */}
                            <div className="relative mb-3">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Поиск процедур..."
                                    value={procedureSearch}
                                    onChange={(e) => setProcedureSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <div className="space-y-3 max-h-[380px] overflow-y-auto">
                                {isLoadingProcedures ? (
                                    <div className="text-sm text-gray-500">Загрузка процедур...</div>
                                ) : displayedProcedures.length > 0 ? (
                                    displayedProcedures.map((procedure) => (
                                        <label key={procedure.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`procedure-${procedure.id}`}
                                                checked={filters.procedures?.includes(procedure.id) || false}
                                                onCheckedChange={(checked) =>
                                                    handleProcedureChange(procedure.id, checked as boolean)
                                                }
                                                disabled={isLoading}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-600">{procedure.title}</span>
                                                {procedure.is_for_children && (
                                                    <span className="text-xs text-blue-500">
                                                        Детская процедура ({procedure.child_age_from} - {procedure.child_age_to})
                                                    </span>
                                                )}
                                            </div>
                                        </label>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-500">
                                        {procedureSearch ? 'Ничего не найдено' : 'Нет доступных процедур'}
                                    </div>
                                )}

                                {/* Кнопка "Показать еще" для процедур */}
                                {!procedureSearch && filteredProcedures.length > INITIAL_ITEMS_COUNT && (
                                    <button
                                        onClick={() => setShowAllProcedures(!showAllProcedures)}
                                        className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                    >
                                        {showAllProcedures ? (
                                            <>
                                                <ChevronUp className="w-4 h-4" />
                                                Скрыть
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="w-4 h-4" />
                                                Показать еще ({filteredProcedures.length - INITIAL_ITEMS_COUNT})
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
};
