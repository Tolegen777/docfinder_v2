'use client';

import React from 'react';
import {User2} from 'lucide-react';
import {useQuery} from '@tanstack/react-query';
import {SpecialtiesAPI} from '@/shared/api/specialtiesApi';
import {ViewToggle} from './ViewToggle';
import {SpecialtyCard} from './SpecialtyCard';
import {cn} from '@/shared/lib/utils';
import Cookies from 'js-cookie';
import {AlphabeticalServices} from "@/components/SpecialtiesSection/AlphabeticalServices";

export const HomeSpecialties = () => {
    const [view, setView] = React.useState<'grid' | 'list'>('grid');

    // Получаем cityId из кук
    const cityId = Number(Cookies.get('selectedCity')) || 1;

    const { data: specialtyGroups = [], isLoading } = useQuery({
        queryKey: ['specialties', cityId],
        queryFn: () => SpecialtiesAPI.getSpecialties(cityId),
    });

    // Получаем все специальности в один массив для grid view
    const allSpecialties = specialtyGroups.flatMap(group =>
        group.specialities.map(specialty => ({
            ...specialty,
            icon: User2 // Пока используем один icon для всех
        }))
    );

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <>
            <ViewToggle view={view} onViewChange={setView} />

            <div className="mt-8 mb-6">
                <h2 className="h3-28-36-600 text-center md:text-left">
                    Популярные специальности{' '}
                    <span className="text-primary">для взрослых</span>
                </h2>
            </div>

            {view === 'grid' ? (
                <div className={cn(
                    "grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6",
                )}>
                    {allSpecialties.map((specialty) => (
                        <SpecialtyCard
                            key={specialty.id}
                            slug={specialty.slug}
                            name={specialty.title}
                            doctorCount={specialty.doctor_count}
                            // active={String(specialty.id) === currentSpecialty}
                            active={false}
                        />
                    ))}
                </div>
            ) : (
                <AlphabeticalServices specialtyGroups={specialtyGroups} />
            )}
        </>
    );
};
