'use client'
import React from 'react';
import { MaxWidthLayout } from "@/shared/ui/MaxWidthLayout";
import { ClinicDetails } from '@/shared/api/clinicDetailsApi';

import { ClinicBreadcrumbs } from './ClinicBreadcrumbs';
import { ClinicCarousel } from './ClinicCarousel';
import { ClinicMap } from './ClinicMap';
import { ClinicInfoBlock } from './ClinicInfoBlock';
import { AboutSection } from "@/components/ClinicDetails/ClinicDetailBlock/AboutSection";

interface ClinicHeaderProps {
    clinic: ClinicDetails;
}

export const ClinicHeader: React.FC<ClinicHeaderProps> = ({ clinic }) => {
    // Преобразуем формат рабочих часов для компонента
    const formattedWorkHours = clinic.working_hours.map(hour => ({
        day: hour.weekday,
        time: hour.open_time && hour.close_time
            ? `${hour.open_time.slice(0, -3)}-${hour.close_time.slice(0, -3)}`
            : 'Выходной'
    }));

    // Карта ссылок
    const mapsLinks = {
        yandex: clinic.yandex_maps_url,
        google: clinic.google_maps_url,
        "2gis": clinic.two_gis_url
    };

    return (
        <MaxWidthLayout className="py-4">
            {/* Хлебные крошки */}
            <ClinicBreadcrumbs clinicName={clinic.title} />

            <h1 className="text-2xl font-medium text-emerald-600 mb-4">{clinic.title}</h1>

            {/* Мобильная версия */}
            <div className="md:hidden space-y-4">
                {/* Блок 1: Карусель */}
                <div className="relative w-full aspect-[4/3]">
                    <ClinicCarousel images={clinic.images || []} />
                </div>

                {/* Блок 2: Информация о клинике */}
                <div className="rounded-xl">
                    <AboutSection
                        description={clinic.description_fragments}
                        features={clinic.features || []}
                        amenities={clinic.amenities || []}
                        specializations={clinic.specialities.map(s => s.title)}
                        procedures={clinic.procedures}
                    />
                </div>

                {/* Блок 3: Карта */}
                <div className="relative w-full aspect-video">
                    <ClinicMap
                        clinicId={clinic.id}
                        latitude={parseFloat(clinic.latitude)}
                        longitude={parseFloat(clinic.longitude)}
                    />
                </div>

                {/* Блок 4: Дополнительные данные */}
                <ClinicInfoBlock
                    address={clinic.address}
                    metro={clinic.metro}
                    busStop={clinic.bus_stop}
                    workHours={formattedWorkHours}
                    mapsLinks={mapsLinks}
                    timeUntilClosing={clinic.time_until_closing}
                    showFullSchedule
                />
            </div>

            {/* Десктопная версия */}
            <div className="hidden md:grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <div className="grid grid-rows-1 gap-6">
                        {/* Блок 1: Карусель */}
                        <div className="relative h-[400px]">
                            <ClinicCarousel images={clinic.images || []} />
                        </div>

                        {/* Блок с информацией о клинике */}
                        <div className="rounded-xl">
                            <AboutSection
                                description={clinic.description_fragments}
                                features={clinic.features || []}
                                amenities={clinic.amenities || []}
                                specializations={clinic.specialities.map(s => s.title)}
                                procedures={clinic.procedures}
                            />
                        </div>
                    </div>
                </div>

                {/* Правая колонка */}
                <div className="space-y-6">
                    {/* Блок 2: Карта */}
                    <div className="relative h-[400px]">
                        <ClinicMap
                            clinicId={clinic.id}
                            latitude={parseFloat(clinic.latitude)}
                            longitude={parseFloat(clinic.longitude)}
                        />
                    </div>

                    {/* Блок 4: Дополнительные данные */}
                    <div>
                        <ClinicInfoBlock
                            address={clinic.address}
                            metro={clinic.metro}
                            busStop={clinic.bus_stop}
                            workHours={formattedWorkHours}
                            mapsLinks={mapsLinks}
                            timeUntilClosing={clinic.time_until_closing}
                            showFullSchedule={true}
                        />
                    </div>
                </div>
            </div>
        </MaxWidthLayout>
    );
};
