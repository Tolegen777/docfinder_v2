'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ClinicsAPI, ClinicDetails } from '@/shared/api/clinicDetailsApi';
import { ClinicHeader } from '@/components/ClinicDetails/ClinicHeader/ClinicHeader';
import { Skeleton } from '@/shared/ui/shadcn/skeleton';
import { MaxWidthLayout } from '@/shared/ui/MaxWidthLayout';
import { useParams } from 'next/navigation';

// Моковые изображения (м)
import clinicImg1 from '@/shared/assets/images/img.png';
import clinicImg2 from '@/shared/assets/images/img.png';

const mockFeatures = [
    { id: 'hosp', icon: '🏥', title: 'Есть стационар' },
    { id: 'tests', icon: '🧪', title: 'Прием анализов' },
    { id: 'sick-list', icon: '📋', title: 'Оформляем больничный' },
    { id: 'cards', icon: '💳', title: 'Принимаем Карточки' },
    { id: 'children', icon: '👶', title: 'Принимаем детей' },
    { id: 'wifi', icon: '📶', title: 'Бесплатный Wi-Fi' },
    { id: 'diagnostics', icon: '🔬', title: 'Проводим диагностику' },
    { id: 'parking', icon: '🅿️', title: 'Есть парковка' },
    { id: 'playground', icon: '🎮', title: 'Детская игровая зона' },
    { id: 'pharmacy', icon: '💊', title: 'Аптека на территории' },
    { id: '24h', icon: '⏰', title: 'Круглосуточно' }
]; // (м)

// Компонент-скелетон для загрузки
const ClinicSkeleton = () => (
    <MaxWidthLayout className="py-4">
        <div className="space-y-4">
            <Skeleton className="h-5 w-[250px] bg-emerald-100" />
            <Skeleton className="h-8 w-[350px] bg-emerald-100" />

            <div className="md:hidden space-y-4">
                <Skeleton className="w-full aspect-[4/3] rounded-xl bg-emerald-100" />
                <Skeleton className="w-full h-[300px] rounded-xl bg-emerald-100" />
                <Skeleton className="w-full aspect-video rounded-xl bg-emerald-100" />
                <Skeleton className="w-full h-[250px] rounded-xl bg-emerald-100" />
            </div>

            <div className="hidden md:grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <div className="grid grid-rows-1 gap-6">
                        <Skeleton className="h-[400px] rounded-xl bg-emerald-100" />
                        <Skeleton className="h-[300px] rounded-xl bg-emerald-100" />
                    </div>
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-[400px] rounded-xl bg-emerald-100" />
                    <Skeleton className="h-[250px] rounded-xl bg-emerald-100" />
                </div>
            </div>
        </div>
    </MaxWidthLayout>
);

export const ClinicDetailsPage = () => {
    const params = useParams();
    const clinicSlug = params?.slug as string || '';

    const { data: clinic, isLoading, error } = useQuery({
        queryKey: ['clinic', clinicSlug],
        queryFn: () => ClinicsAPI.getClinicBySlug(clinicSlug),
        enabled: !!clinicSlug,
    });

    // Дополняем полученные данные моковыми для отсутствующих полей
    const enrichedClinic: ClinicDetails | undefined = clinic
        ? {
            ...clinic,
            // Маппинг данных API к формату компонентов
            metro: 'СарыАрка - 5 мин пешком', // (м)
            bus_stop: 'Оптовка - 5 мин пешком', // (м)
            images: [clinicImg1, clinicImg2], // (м)
            features: mockFeatures, // (м)
        }
        : undefined;

    if (isLoading) {
        return <ClinicSkeleton />;
    }

    if (error || !enrichedClinic) {
        return (
            <MaxWidthLayout className="py-4">
                <div className="p-6 bg-red-50 text-red-600 rounded-lg">
                    <h2 className="text-xl font-medium mb-2">Ошибка загрузки данных клиники</h2>
                    <p>Не удалось загрузить информацию о клинике. Пожалуйста, попробуйте позже.</p>
                </div>
            </MaxWidthLayout>
        );
    }

    return <ClinicHeader clinic={enrichedClinic} />;
};

export default ClinicDetailsPage;
