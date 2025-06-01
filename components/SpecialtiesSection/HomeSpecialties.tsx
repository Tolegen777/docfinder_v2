'use client';

import React from 'react';
import {ChevronDown, ChevronUp, User2} from 'lucide-react';
import {useQuery} from '@tanstack/react-query';
import {SpecialtiesAPI} from '@/shared/api/specialtiesApi';
import {ViewToggle} from './ViewToggle';
import {SpecialtyCard} from './SpecialtyCard';
import {cn} from '@/lib/utils';
import {AlphabeticalServices} from "@/components/SpecialtiesSection/AlphabeticalServices";
import {useCityStore} from "@/shared/stores/cityStore";

export const HomeSpecialties = () => {
    const [view, setView] = React.useState<'grid' | 'list'>('grid');
    const [showAll, setShowAll] = React.useState(false);

    const {currentCity} = useCityStore()

    const { data: specialtyGroups = [], isLoading } = useQuery({
        queryKey: ['specialties', currentCity?.id],
        queryFn: () => SpecialtiesAPI.getSpecialties(currentCity?.id as number),
        enabled: !!currentCity?.id
    });

    // Получаем все специальности в один массив для grid view
    const allSpecialties = specialtyGroups.flatMap(group =>
        group.specialities.map(specialty => ({
            ...specialty,
            icon: User2 // Пока используем один icon для всех
        }))
    );

    // Настройки для показа части данных
    const INITIAL_ITEMS_GRID = 12; // Показываем 2 ряда по 6 карточек
    const INITIAL_GROUPS_LIST = 4; // Показываем первые 4 буквы

    // Для grid view
    const visibleSpecialties = showAll ? allSpecialties : allSpecialties.slice(0, INITIAL_ITEMS_GRID);
    const hasMoreSpecialties = allSpecialties.length > INITIAL_ITEMS_GRID;

    // Для list view
    const visibleGroups = showAll ? specialtyGroups : specialtyGroups.slice(0, INITIAL_GROUPS_LIST);
    const hasMoreGroups = specialtyGroups.length > INITIAL_GROUPS_LIST;

    const handleToggleShow = () => {
        setShowAll(!showAll);
    };

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <>
            <ViewToggle view={view} onViewChange={setView} />

            <div className="mt-8 mb-6">
                <h2 className="h3-28-36-600 text-center md:text-left">
                    Специальности
                </h2>
            </div>

            {view === 'grid' ? (
                <>
                    <div className={cn(
                        "grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6",
                    )}>
                        {visibleSpecialties.map((specialty) => (
                            <SpecialtyCard
                                key={specialty.id}
                                slug={specialty.slug}
                                name={specialty.title}
                                doctorCount={specialty.doctor_count}
                                active={false}
                            />
                        ))}
                    </div>

                    {hasMoreSpecialties && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleToggleShow}
                                className={cn(
                                    "group flex items-center gap-2 px-8 py-4 rounded-2xl transition-all duration-300",
                                    "bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100",
                                    "border border-blue-200 hover:border-blue-300",
                                    "text-blue-700 hover:text-blue-800",
                                    "shadow-sm hover:shadow-md",
                                    "transform hover:scale-[1.02] active:scale-[0.98]"
                                )}
                            >
                                <span className="font-medium">
                                    {showAll ? 'Скрыть' : `Показать еще ${allSpecialties.length - INITIAL_ITEMS_GRID}`}
                                </span>
                                {showAll ? (
                                    <ChevronUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-0.5" />
                                )}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <AlphabeticalServices
                        specialtyGroups={visibleGroups}
                    />

                    {hasMoreGroups && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleToggleShow}
                                className={cn(
                                    "group flex items-center gap-2 px-8 py-4 rounded-2xl transition-all duration-300",
                                    "bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100",
                                    "border border-blue-200 hover:border-blue-300",
                                    "text-blue-700 hover:text-blue-800",
                                    "shadow-sm hover:shadow-md",
                                    "transform hover:scale-[1.02] active:scale-[0.98]"
                                )}
                            >
                                <span className="font-medium">
                                    {showAll ? 'Скрыть' : `Показать еще ${specialtyGroups.length - INITIAL_GROUPS_LIST} групп`}
                                </span>
                                {showAll ? (
                                    <ChevronUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-0.5" />
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
};
