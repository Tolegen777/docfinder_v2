'use client'
import React from 'react';
import { MaxWidthLayout } from "@/shared/ui/MaxWidthLayout";
import { ClinicDetails } from '@/shared/api/clinicDetailsApi';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";

import { ClinicBreadcrumbs } from './ClinicBreadcrumbs';
import { ClinicCarousel } from './ClinicCarousel';
import { ClinicMap } from './ClinicMap';
import { ClinicInfoBlock } from './ClinicInfoBlock';
import { AboutSection } from "@/components/ClinicDetails/ClinicDetailBlock/AboutSection";

// Импортируем моковые изображения для фолбэка
import clinicImg1 from '@/shared/assets/images/img.png';
import clinicImg2 from '@/shared/assets/images/img.png';

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

    // Проверяем наличие изображений, если нет, используем моковые
    const hasRealImages = clinic.images && clinic.images.length > 0;
    // const imagesToUse = hasRealImages ? clinic.images : [clinicImg1, clinicImg2];

    // Проверяем наличие координат для карты
    const hasCoordinates = clinic.latitude && clinic.longitude &&
        parseFloat(clinic.latitude) !== 0 &&
        parseFloat(clinic.longitude) !== 0;

    return (
        <MaxWidthLayout className="py-4">
            {/* Хлебные крошки */}
            <ClinicBreadcrumbs clinicName={clinic.title} />

            <h1 className="text-2xl font-medium text-emerald-600 mb-4">{clinic.title}</h1>

            {/* Мобильная версия */}
            <div className="md:hidden space-y-4">
                {/* Блок 1: Карусель */}
                <div className="relative w-full aspect-[4/3]">
                    {/*// @ts-ignore*/}
                    <ClinicCarousel images={clinic?.images ?? []} />
                    {!hasRealImages && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="absolute bottom-2 right-2 bg-white/80 rounded-full p-1">
                                        <Info className="w-5 h-5 text-gray-600" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Используются изображения-заглушки</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>

                {/* Блок 2: Информация о клинике */}
                <div className="rounded-xl">
                    <AboutSection
                        description={clinic.description_fragments || []}
                        features={clinic.features || []}
                        amenities={clinic.amenities || []}
                        specializations={clinic.specialities.map(s => s.title) || []}
                        procedures={clinic.procedures || []}
                    />
                </div>

                {/* Блок 3: Карта */}
                {hasCoordinates ? (
                    <div className="relative w-full aspect-video">
                        <ClinicMap
                            clinicId={clinic.id}
                            latitude={parseFloat(clinic.latitude)}
                            longitude={parseFloat(clinic.longitude)}
                            clinicName={clinic.title}
                            clinicAddress={clinic.address}
                        />
                    </div>
                ) : (
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2">
                            <Info className="w-5 h-5 text-gray-500" />
                            <p className="text-gray-600">Нет данных о местоположении клиники</p>
                        </div>
                    </div>
                )}

                {/* Блок 4: Дополнительные данные */}
                <ClinicInfoBlock
                    address={clinic.address}
                    metro={clinic.metro || ""}
                    busStop={clinic.bus_stop || ""}
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
                            {/*// @ts-ignore*/}
                            <ClinicCarousel images={clinic?.images ?? []} />
                            {!hasRealImages && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="absolute bottom-4 right-4 bg-white/80 rounded-full p-2">
                                                <Info className="w-6 h-6 text-gray-600" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Используются изображения-заглушки, т.к. для клиники нет реальных фото</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>

                        {/* Блок с информацией о клинике */}
                        <div className="rounded-xl">
                            <AboutSection
                                description={clinic.description_fragments || []}
                                features={clinic.features || []}
                                amenities={clinic.amenities || []}
                                specializations={clinic.specialities.map(s => s.title) || []}
                                procedures={clinic.procedures || []}
                            />
                        </div>
                    </div>
                </div>

                {/* Правая колонка */}
                <div className="space-y-6">
                    {/* Блок 2: Карта */}
                    {hasCoordinates ? (
                        <div className="relative h-[400px]">
                            <ClinicMap
                                clinicId={clinic.id}
                                latitude={parseFloat(clinic.latitude)}
                                longitude={parseFloat(clinic.longitude)}
                                clinicName={clinic.title}
                                clinicAddress={clinic.address}
                            />
                        </div>
                    ) : (
                        <div className="h-[400px] p-6 bg-gray-50 rounded-xl flex flex-col items-center justify-center">
                            <Info className="w-10 h-10 text-gray-400 mb-4" />
                            <p className="text-gray-600 text-center">Нет данных о местоположении клиники</p>
                        </div>
                    )}

                    {/* Блок 4: Дополнительные данные */}
                    <div>
                        <ClinicInfoBlock
                            address={clinic.address}
                            metro={clinic.metro || ""}
                            busStop={clinic.bus_stop || ""}
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
