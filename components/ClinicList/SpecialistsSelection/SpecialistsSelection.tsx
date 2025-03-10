import React, { useState } from 'react';
import { useClinicsStore } from '@/shared/stores/clinicsStore';
import { Skeleton } from '@/components/shadcn/skeleton';
import { useQuery } from '@tanstack/react-query';
import { SpecialtiesAPI, Specialty } from '@/shared/api/specialtiesApi';
import {useCityStore} from "@/shared/stores/cityStore";

// Default city ID (should come from user selection or context)
const DEFAULT_CITY_ID = 1;

interface SpecialistType {
    id: number;
    name: string;
    slug?: string;
    count?: number;
}

interface SpecialistsSelectionProps {
    maxVisible?: number;
}

export const SpecialistsSelection: React.FC<SpecialistsSelectionProps> = ({ maxVisible = 25 }) => {
    const [showAll, setShowAll] = useState(false);
    const { filters, toggleSpeciality, applyFilters } = useClinicsStore();

    const {currentCity} = useCityStore()

    // Fetch specialties from API
    const { data: specialtyGroups, isLoading, error } = useQuery({
        queryKey: ['specialties', currentCity?.id],
        queryFn: () => SpecialtiesAPI.getSpecialties(currentCity?.id as number),
        enabled: !!currentCity?.id
    });

    // Flatten specialty groups into a single array of specialties
    const specialties = React.useMemo(() => {
        if (!specialtyGroups) return [];

        return specialtyGroups.flatMap(group =>
            group.specialities.map(specialty => ({
                id: specialty.id,
                name: specialty.title,
                slug: specialty.slug,
                count: specialty.doctor_count
            }))
        );
    }, [specialtyGroups]);

    // Handle specialty selection
    const handleSpecialtyClick = async (id: number) => {
        toggleSpeciality(id);
        await applyFilters(DEFAULT_CITY_ID);
    };

    // Determine which specialties to show
    const visibleSpecialties = showAll
        ? specialties
        : specialties.slice(0, maxVisible);

    if (isLoading) {
        // Loading skeleton
        return (
            <div className="flex flex-wrap gap-2 max-w-4xl">
                {Array(12).fill(0).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-24 rounded-full" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500">
                Не удалось загрузить специальности. Пожалуйста, попробуйте позже.
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-2 max-w-4xl">
            {visibleSpecialties.map((specialty) => (
                <button
                    key={specialty.id}
                    className={`px-4 py-2 rounded-full ${
                        filters.specialities.includes(specialty.id)
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-700'
                    } text-sm transition-colors duration-200 ease-in-out`}
                    onClick={() => handleSpecialtyClick(specialty.id)}
                >
                    {specialty.name}
                    {specialty.count && (
                        <span className="ml-1 text-xs opacity-70">({specialty.count})</span>
                    )}
                </button>
            ))}

            {specialties.length > maxVisible && (
                <button
                    className="px-4 py-2 rounded-full bg-white hover:bg-gray-50
                     border border-gray-200 text-emerald-600 text-sm
                     transition-colors duration-200 ease-in-out"
                    onClick={() => setShowAll(!showAll)}
                >
                    {showAll ? 'Скрыть' : 'Ещё...'}
                </button>
            )}
        </div>
    );
};
