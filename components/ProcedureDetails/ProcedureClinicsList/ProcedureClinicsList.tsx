'use client';

import React, { useState, useEffect } from 'react';
import { MaxWidthLayout } from "@/shared/ui/MaxWidthLayout";
import ClinicCard from '@/components/ClinicList/ClinicCard/ClinicCard';
import { ClinicCardSkeleton } from '@/components/ClinicList/ClinicCard/ClinicCardSkeleton';
import { Button } from '@/components/shadcn/button';
import { useQuery } from '@tanstack/react-query';
import { ProcedureClinicsAPI, procedureClinicKeys } from '@/shared/api/procedureClinicsApi';
import { ProcedureClinicsMap } from './ProcedureClinicsMap';
import { useParams } from "next/navigation";
import { TabBar, TabOption } from '@/shared/ui/TabBar';
import { Users, Building2 } from 'lucide-react';
import { ProcedureDoctorsList } from '../ProcedureDoctorsList/ProcedureDoctorsList';

type TabValue = 'doctors' | 'clinics';

const tabs: TabOption[] = [
    {
        value: 'doctors',
        icon: <Users className="w-5 h-5" />,
        label: 'Врачи'
    },
    {
        value: 'clinics',
        icon: <Building2 className="w-5 h-5" />,
        label: 'Клиники'
    }
];

export const ProcedureClinicsList = () => {
    const params = useParams();
    const procedureSlug = params?.slug as string;

    const [activeTab, setActiveTab] = useState<TabValue>('doctors');
    const [selectedClinicId, setSelectedClinicId] = useState<number | undefined>(undefined);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // State to store all loaded clinics
    const [allClinics, setAllClinics] = useState<any[]>([]);
    const [isFetchingNext, setIsFetchingNext] = useState(false);

    // Fetch initial clinics
    const {
        data: initialData,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: [...procedureClinicKeys.lists(), { procedureSlug, page: 1, pageSize, activeTab }],
        queryFn: async () => {
            const response = await ProcedureClinicsAPI.getProcedureClinics({
                procedureSlug,
                page: 1,
                pageSize
            });

            return {
                clinics: response.results.map(clinic => ({
                    ...clinic,
                    cardProps: {
                        name: clinic.title,
                        address: clinic.address,
                        rating: {
                            stars: Math.round(clinic.rating_info?.average_rating || 0),
                            reviewCount: clinic.rating_info?.total_reviews || 0
                        },
                        schedule: convertWorkingHoursToSchedule(clinic.working_hours),
                        specialists: clinic.specialities?.length || 0,
                        timeUntilClose: clinic.time_until_closing || "Нет данных о времени закрытия",
                    }
                })),
                totalCount: response.count
            };
        },
        enabled: !!procedureSlug && activeTab === 'clinics'
    });

    // Update allClinics when initial data changes
    useEffect(() => {
        if (initialData?.clinics) {
            setAllClinics(initialData.clinics);
        }
    }, [initialData]);

    // Function to load more clinics
    const loadMoreClinics = async () => {
        if (isFetchingNext) return;

        const nextPage = page + 1;
        setIsFetchingNext(true);

        try {
            const response = await ProcedureClinicsAPI.getProcedureClinics({
                procedureSlug,
                page: nextPage,
                pageSize
            });

            const newClinics = response.results.map(clinic => ({
                ...clinic,
                cardProps: {
                    name: clinic.title,
                    address: clinic.address,
                    rating: {
                        stars: Math.round(clinic.rating_info?.average_rating || 0),
                        reviewCount: clinic.rating_info?.total_reviews || 0
                    },
                    schedule: convertWorkingHoursToSchedule(clinic.working_hours),
                    specialists: clinic.specialities?.length || 0,
                    timeUntilClose: clinic.time_until_closing || "Нет данных о времени закрытия",
                    doctor_count: clinic?.doctor_count
                }
            }));

            setAllClinics(prev => [...prev, ...newClinics]);
            setPage(nextPage);
        } catch (error) {
            console.error("Error loading more clinics:", error);
        } finally {
            setIsFetchingNext(false);
        }
    };

    // Helper function to convert working hours to schedule
    function convertWorkingHoursToSchedule(workingHours: any[] = []) {
        const schedule = {
            monday: "Нет данных",
            tuesday: "Нет данных",
            wednesday: "Нет данных",
            thursday: "Нет данных",
            friday: "Нет данных",
            saturday: "Нет данных",
            sunday: "Нет данных"
        };

        const weekdayMap: Record<string, keyof typeof schedule> = {
            "Monday": "monday",
            "Tuesday": "tuesday",
            "Wednesday": "wednesday",
            "Thursday": "thursday",
            "Friday": "friday",
            "Saturday": "saturday",
            "Sunday": "sunday",
            "Понедельник": "monday",
            "Вторник": "tuesday",
            "Среда": "wednesday",
            "Четверг": "thursday",
            "Пятница": "friday",
            "Суббота": "saturday",
            "Воскресенье": "sunday",
        };

        workingHours?.forEach(hour => {
            const day = weekdayMap[hour.weekday];
            if (day) {
                schedule[day] = `${hour.open_time}-${hour.close_time}`;
            }
        });

        return schedule;
    }

    // Extract data
    const clinics = allClinics || [];
    const totalCount = initialData?.totalCount || 0;

    // Calculate if there are more pages
    const hasMorePages = clinics.length < totalCount;

    // Handle "Show more" button click
    const handleShowMore = () => {
        loadMoreClinics();
    };

    // Handle tab change
    const handleTabChange = (tab: string) => {
        const newTab = tab as TabValue;
        setActiveTab(newTab);
        // Reset pagination when switching tabs
        setPage(1);

        if (newTab === 'clinics') {
            // Clear existing clinics data when switching to clinics tab
            setAllClinics([]);
        }
    };

    return (
        <div className="mb-8">
            <MaxWidthLayout>
                {/* Tab Bar */}
                <div className="mb-6">
                    <TabBar
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        tabs={tabs}
                    />
                </div>

                {/* Tab Content */}
                {activeTab === 'doctors' && (
                    <ProcedureDoctorsList />
                )}

                {/* Map component - only show for clinics */}
                {!isLoading && clinics.length > 0 && activeTab === 'clinics' && (
                    <ProcedureClinicsMap
                        clinics={clinics}
                        totalCount={totalCount}
                        selectedClinicId={selectedClinicId}
                    />
                )}

                {activeTab === 'clinics' && (
                    <>
                        {/* Error state */}
                        {isError && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                                <p className="text-red-700">
                                    {error instanceof Error ? error.message : 'Произошла ошибка при загрузке данных'}
                                </p>
                            </div>
                        )}

                        {/* Loading state */}
                        {isLoading && (
                            <div className="space-y-4">
                                {Array(3).fill(null).map((_, index) => (
                                    <ClinicCardSkeleton key={index} />
                                ))}
                            </div>
                        )}

                        {/* Clinics list */}
                        {!isLoading && clinics.length > 0 && (
                            <div className="space-y-4">
                                {clinics.map((clinic) => (
                                    <ClinicCard
                                        key={clinic.id}
                                        id={clinic.id}
                                        slug={clinic.slug}
                                        name={clinic.cardProps.name}
                                        address={clinic.cardProps.address}
                                        rating={clinic.cardProps.rating}
                                        schedule={clinic.cardProps.schedule}
                                        specialists={clinic.cardProps.specialists}
                                        timeUntilClose={clinic.cardProps.timeUntilClose}
                                        doctor_count={clinic?.doctor_count}
                                        main_photo_url={clinic?.main_photo_url}
                                    />
                                ))}
                            </div>
                        )}

                        {/* No results state */}
                        {!isLoading && clinics.length === 0 && (
                            <div className="text-center py-8 bg-white rounded-xl shadow-sm p-8">
                                <p className="text-gray-500 mb-2">Клиники не найдены</p>
                                <p className="text-sm text-gray-400">К сожалению, нет клиник, предлагающих данную процедуру</p>
                            </div>
                        )}

                        {/* "Show more" button */}
                        {!isLoading && hasMorePages && (
                            <div className="flex justify-center mt-6">
                                <Button
                                    variant="outline"
                                    className="w-full border border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-md py-3"
                                    onClick={handleShowMore}
                                    disabled={isFetchingNext}
                                >
                                    <span className="flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor">
                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                        </svg>
                                        {isFetchingNext ? 'Загрузка...' : 'Показать еще'}
                                    </span>
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </MaxWidthLayout>
        </div>
    )}
