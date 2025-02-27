'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { DoctorsAPI } from '@/shared/api/doctorsApi';
import DoctorCard from "./DoctorCard/DoctorCard";
import { AppointmentTypeFilters } from "@/components/AppointmentTypeFilters/AppointmentTypeFilters";
import { Skeleton } from '@/components/shadcn/skeleton';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/shadcn/pagination";
import {cn} from "@/shared/lib/utils";

const PAGE_SIZE = 10;

const DoctorCardSkeleton = () => (
    <div className="w-full max-w-[1181px] h-[300px] rounded-lg">
        <Skeleton className="w-full h-full" />
    </div>
);

const DoctorsPagination = ({
                               currentPage,
                               totalPages,
                               onPageChange,
                               onPrevNext
                           }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPrevNext: (page: number) => void;
}) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    let displayedPages = pages;

    if (totalPages > 7) {
        if (currentPage <= 4) {
            displayedPages = [...pages.slice(0, 5), -1, totalPages];
        } else if (currentPage >= totalPages - 3) {
            displayedPages = [1, -1, ...pages.slice(totalPages - 5)];
        } else {
            displayedPages = [
                1,
                -1,
                currentPage - 1,
                currentPage,
                currentPage + 1,
                -1,
                totalPages,
            ];
        }
    }

    return (
        <Pagination className="mt-8">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onPrevNext(currentPage - 1);
                        }}
                        className={cn(
                            currentPage === 1 ? 'pointer-events-none opacity-50' : '',
                            'gap-1 pl-2.5'
                        )}
                    >
                        Назад
                    </PaginationPrevious>
                </PaginationItem>

                {displayedPages.map((pageNum, i) => (
                    pageNum === -1 ? (
                        <PaginationItem key={`ellipsis-${i}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={pageNum}>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(pageNum);
                                }}
                                isActive={pageNum === currentPage}
                            >
                                {pageNum}
                            </PaginationLink>
                        </PaginationItem>
                    )
                ))}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onPrevNext(currentPage + 1);
                        }}
                        className={cn(
                            currentPage === totalPages ? 'pointer-events-none opacity-50' : '',
                            'gap-1 pr-2.5'
                        )}
                    >
                        Вперед
                    </PaginationNext>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export const DoctorsList = () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const cityId = Number(Cookies.get('selectedCity')) || 1;

    const { data, isLoading } = useQuery({
        queryKey: ['doctors', cityId, currentPage],
        queryFn: () => DoctorsAPI.getDoctors(cityId, currentPage, PAGE_SIZE),
    });

    const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 0;

    // Обработчик для нажатия на номер страницы (с прокруткой)
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Обработчик для кнопок prev/next (без прокрутки)
    const handlePrevNext = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-8">
            <AppointmentTypeFilters />

            <div className="space-y-4">
                {isLoading ? (
                    Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <DoctorCardSkeleton key={i} />
                    ))
                ) : (
                    data?.results.map((doctor) => (
                        <DoctorCard
                            key={doctor.id}
                            id={doctor.id}
                            full_name={doctor.full_name}
                            slug={doctor.slug}
                            medical_categories={doctor.medical_categories}
                            experience_years={doctor.experience_years}
                            clinic_today={doctor.clinic_today}
                            clinic_today_address={doctor.clinic_today_address}
                            schedule_today={doctor.schedule_today}
                            schedule_tomorrow={doctor.schedule_tomorrow}
                            schedule_day_after_tomorrow={doctor.schedule_day_after_tomorrow}
                        />
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <DoctorsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onPrevNext={handlePrevNext}
                />
            )}
        </div>
    );
};
