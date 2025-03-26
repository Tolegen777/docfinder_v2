'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { MaxWidthLayout } from "@/shared/ui/MaxWidthLayout";
import { Skeleton } from '@/components/shadcn/skeleton';
import { DoctorBreadcrumbs } from './DoctorBreadcrumbs';
import DoctorCard from "@/components/DoctorsList/DoctorCard/DoctorCard";
import { DoctorAccordions } from './DoctorAccordions';
import {DoctorDetailsAPI} from "@/shared/api/doctorDetailsApi";

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

    // Map API data to the format expected by DoctorCard component
    const mappedScheduleData = {
        // These are static examples assuming the first day is today, second is tomorrow, etc.
        schedule_today: doctor.work_schedule.length > 0 ? [{
            clinic_title: doctor.work_schedule[0].clinic_title,
            clinic_address: doctor.work_schedule[0].clinic_address,
            maps_links: doctor.clinic_today_maps_links || {
                yandex: '',
                google: '',
                "2gis": ''
            },
            working_hours: doctor.work_schedule[0].working_hours.map(hour => ({
                id: hour.id, // Generate random ID since API doesn't provide it
                start_time: hour.start_time,
                end_time: hour.end_time
            })),
            clinic_id: '1' // Placeholder since API doesn't provide it
        }] : [],
        schedule_tomorrow: doctor.work_schedule.length > 1 ? [{
            clinic_title: doctor.work_schedule[1].clinic_title,
            clinic_address: doctor.work_schedule[1].clinic_address,
            maps_links: doctor.clinic_today_maps_links || {
                yandex: '',
                google: '',
                "2gis": ''
            },
            working_hours: doctor.work_schedule[1].working_hours.map(hour => ({
                id: Math.random(),
                start_time: hour.start_time,
                end_time: hour.end_time
            })),
            clinic_id: '1'
        }] : [],
        schedule_day_after_tomorrow: doctor.work_schedule.length > 2 ? [{
            clinic_title: doctor.work_schedule[2].clinic_title,
            clinic_address: doctor.work_schedule[2].clinic_address,
            maps_links: doctor.clinic_today_maps_links || {
                yandex: '',
                google: '',
                "2gis": ''
            },
            working_hours: doctor.work_schedule[2].working_hours.map(hour => ({
                id: Math.random(),
                start_time: hour.start_time,
                end_time: hour.end_time
            })),
            clinic_id: '1'
        }] : []
    };

    // Supplemented doctor data combining API and mock data
    const doctorData = {
        ...doctor,
        // Assume first clinic in schedule is the current one
        clinic_today: doctor.work_schedule.length > 0 ? doctor.work_schedule[0].clinic_title : '',
        clinic_today_address: doctor.work_schedule.length > 0 ? doctor.work_schedule[0].clinic_address : '',
        ...mappedScheduleData
    };

    return (
        <MaxWidthLayout className="py-4">
            {/* Breadcrumbs */}
            <div className="mb-4">
                <DoctorBreadcrumbs
                    doctorName={doctor.full_name}
                    specialization={doctor.specialities.length > 0 ? doctor.specialities[0].title : undefined}
                />
            </div>

            {/* Doctor Card */}
            <div className="mb-8">
                <DoctorCard
                    id={doctorData.id}
                    full_name={doctorData.full_name}
                    slug={doctorData.slug}
                    review_count={doctorData.review_count}
                    average_rating={doctorData.average_rating}
                    clinic_today={doctorData.clinic_today}
                    clinic_today_address={doctorData.clinic_today_address}
                    schedule_today={doctorData.schedule_today}
                    schedule_tomorrow={doctorData.schedule_tomorrow}
                    schedule_day_after_tomorrow={doctorData.schedule_day_after_tomorrow}
                    procedures={doctorData.procedures}
                    consultations={doctorData.consultations}
                    isPreventNavigation
                    main_photo_url={doctor?.main_photo_url}
                    for_child={false}
                    works_since={''}
                    medical_categories={[]}
                    experience_years={null}
                />
            </div>

            {/* Accordions with Info, Specializations, and Services */}
            <div className="mb-8">
                <DoctorAccordions
                    description={doctorData.description_fragments}
                    specializations={doctorData.specialities.map(spec => spec.title)}
                    procedures={doctorData.procedures.map(proc => proc.title)}
                />
            </div>
        </MaxWidthLayout>
    );
}
