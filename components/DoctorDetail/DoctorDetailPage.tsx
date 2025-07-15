'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { MaxWidthLayout } from "@/shared/ui/MaxWidthLayout";
import { Skeleton } from '@/components/shadcn/skeleton';
import { DoctorBreadcrumbs } from './DoctorBreadcrumbs';
import { DoctorAccordions } from './DoctorAccordions';
import {DoctorDetailsAPI} from "@/shared/api/doctorDetailsApi";
import DoctorCard from "@/shared/ui/UniversalDoctorsList/DoctorCard";

// Create a skeleton for loading state
const DoctorDetailSkeleton = () => (
    <MaxWidthLayout className="py-4">
        {/* Breadcrumb Skeleton */}
        <div className="mb-4">
            <Skeleton className="h-5 w-[300px]" />
        </div>

        {/* Doctor Card Skeleton */}
        <Skeleton className="w-full h-[300px] rounded-lg mb-8" />

        {/* Accordions Skeleton */}
        <div className="space-y-4 mb-8">
            <Skeleton className="w-full h-12 rounded-lg" />
            <Skeleton className="w-full h-64 rounded-lg" />
            <Skeleton className="w-full h-12 rounded-lg" />
            <Skeleton className="w-full h-48 rounded-lg" />
        </div>

        {/* Reviews Skeleton */}
        <Skeleton className="w-full h-[400px] rounded-lg" />
    </MaxWidthLayout>
);

export default function DoctorDetailPage() {
    const params = useParams();
    const doctorSlug = params?.slug as string || '';

    // Fetch doctor details
    const { data: doctor, isLoading, error } = useQuery({
        queryKey: ['doctor', doctorSlug],
        queryFn: () => DoctorDetailsAPI.getDoctorBySlug(doctorSlug),
        enabled: !!doctorSlug,
    });

    // Функция для определения расписания и флага использования next_available_schedule
    const getScheduleInfo = (doctor: any) => {
        if (!doctor) return { schedule: undefined, isNextAvailable: false };

        const hasCurrentSchedule = doctor?.weekly_schedule?.[0]?.schedules?.[0]?.working_hours_list?.length > 0;

        if (hasCurrentSchedule) {
            return {
                schedule: doctor.weekly_schedule,
                isNextAvailable: false
            };
        } else {
            return {
                schedule: doctor?.next_available_schedule?.weekly_schedule || doctor?.weekly_schedule,
                isNextAvailable: !!doctor?.next_available_schedule?.weekly_schedule
            };
        }
    };

    if (isLoading) {
        return <DoctorDetailSkeleton />;
    }

    if (error || !doctor) {
        return (
            <MaxWidthLayout className="py-4">
                <div className="p-6 bg-red-50 text-red-600 rounded-lg">
                    <h2 className="text-xl font-medium mb-2">Ошибка загрузки данных</h2>
                    <p>Не удалось загрузить информацию о враче. Пожалуйста, попробуйте позже.</p>
                </div>
            </MaxWidthLayout>
        );
    }

    const { schedule, isNextAvailable } = getScheduleInfo(doctor);

    return (
        <MaxWidthLayout className="py-4">
            {/* Breadcrumbs */}
            <div className="mb-4">
                <DoctorBreadcrumbs
                    doctorName={doctor.full_name}
                />
            </div>

            {/* Doctor Card */}
            <div className="my-7">
                <DoctorCard
                    key={doctor.id}
                    id={doctor.id}
                    full_name={doctor.full_name}
                    slug={doctor.slug}
                    medical_categories={doctor.medical_categories}
                    specialities={doctor.specialities}
                    experience_years={doctor.experience_years}
                    review_count={doctor.review_count}
                    average_rating={doctor.average_rating}
                    clinic_today_title={doctor.clinic_today_title}
                    clinic_today_address={doctor.clinic_today_address}
                    clinic_today_coords={doctor.clinic_today_coords}
                    clinic_today_maps_links={doctor.clinic_today_maps_links}
                    weekly_schedule={schedule}
                    procedures={doctor.procedures}
                    consultation={doctor.consultation}
                    main_photo_url={doctor.main_photo_url}
                    isPreventNavigation
                    isNextAvailableSchedule={isNextAvailable}
                />
            </div>

            {/* Accordions with Info, Specializations, and Services */}
            <div className="mb-8">
                <DoctorAccordions
                    description={doctor.description_fragments}
                    specializations={doctor.specialities.map(spec => spec)}
                    procedures={doctor.procedures.map(proc => proc.medical_procedure_title)}
                />
            </div>
        </MaxWidthLayout>
    );
}
