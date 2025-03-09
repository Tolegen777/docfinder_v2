'use client';

import React, {useState, useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {useQuery} from '@tanstack/react-query';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select";
import {MaxWidthLayout} from "@/shared/ui/MaxWidthLayout";
import {Skeleton} from '@/components/shadcn/skeleton';
import {ReviewsAPI} from '@/shared/api/reviewsApi';
import {ReviewCard} from "@/components/ClinicDetails/Review/ReviewCard/ReviewCard";
import {Button} from "@/components/shadcn/button";

// Количество отзывов на странице
const PAGE_SIZE = 10;

// Компонент-скелетон для отзыва
const ReviewCardSkeleton = () => (
    <div className="w-full bg-white rounded-xl p-4 space-y-4">
        <div className="flex items-start gap-3">
            <Skeleton className="w-10 h-10 rounded-full"/>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <Skeleton className="w-32 h-5"/>
                    <Skeleton className="w-24 h-4"/>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="w-24 h-4"/>
                </div>
                <Skeleton className="w-40 h-6 rounded-full mb-3"/>
                <Skeleton className="w-full h-16 mb-3"/>
                <Skeleton className="w-24 h-4 mb-1"/>
                <Skeleton className="w-40 h-4"/>
            </div>
        </div>
    </div>
);

export const ReviewsList = () => {
    // Состояния
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('');

    // Получаем slug клиники из URL
    const pathname = usePathname();
    const doctorSlug = pathname?.split('/').pop() || '';

    // Запрос на получение отзывов
    const {data, isLoading, isFetching} = useQuery({
        queryKey: ['doctorReviews', doctorSlug, currentPage, sortBy],
        queryFn: () => ReviewsAPI.getDoctorReviews(doctorSlug, currentPage, PAGE_SIZE),
        enabled: !!doctorSlug,
    });

    // Обработчик изменения сортировки
    const handleSortingChange = (value: string) => {
        setSortBy(value);
        setCurrentPage(1); // Сбрасываем страницу при изменении сортировки
    };

    // Обработчик кнопки "Показать еще"
    const handleShowMore = () => {
        if (data && data.next) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Общее количество отзывов
    const totalReviews = data?.count || 0;

    // Проверяем, есть ли еще страницы
    const hasMorePages = data?.next !== null;

    return (
        <MaxWidthLayout className="py-6">
            {/* Header with count and filter */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">
                    <span className="text-emerald-600">{totalReviews}</span> отзывов
                </h2>
                <Select value={sortBy} onValueChange={handleSortingChange}>
                    <SelectTrigger className="bg-white w-[180px]">
                        <SelectValue placeholder="Сортировка"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="-created_at">Сначала новые</SelectItem>
                        <SelectItem value="created_at">Сначала старые</SelectItem>
                        <SelectItem value="-rating">Высокий рейтинг</SelectItem>
                        <SelectItem value="rating">Низкий рейтинг</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Reviews list */}
            <div className="space-y-4">
                {isLoading ? (
                    // Скелетоны при загрузке
                    Array.from({length: 3}).map((_, index) => (
                        <ReviewCardSkeleton key={index}/>
                    ))
                ) : data?.results.length ? (
                    // Список отзывов
                    data.results.map((review) => (
                        <ReviewCard
                            key={review.id}
                            id={review.id}
                            authorName={review.author_name}
                            text={review.text}
                            rating={review.rating / 2}
                            createdAt={review.created_at}
                        />
                    ))
                ) : (
                    // Если отзывов нет
                    <div className="w-full bg-white rounded-xl p-8 text-center">
                        <p className="text-gray-500">Отзывов пока нет. Будьте первым, кто оставит отзыв!</p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-4">
                {hasMorePages && (
                    <Button
                        variant="outline"
                        onClick={handleShowMore}
                        disabled={isFetching}
                        className="w-full px-5 py-2.5 text-primary h-10"
                    >
                        {isFetching ? 'Загрузка...' : 'Показать еще'}
                    </Button>
                )}
                <Button
                >
                    Написать отзыв
                </Button>
            </div>
        </MaxWidthLayout>
    );
};
