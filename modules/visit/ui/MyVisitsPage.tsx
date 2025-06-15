// src/components/ProfilePage/MyVisitsPage.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetVisits, filterVisitsByCategory } from '@/shared/api/visitsApi';
import VisitTableRow from "@/modules/visit/ui/VisitCard";

type VisitTab = 'upcoming' | 'past' | 'cancelled';

const MyVisitsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<VisitTab>('upcoming');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Получаем данные визитов
    const { data, isLoading, isError, error } = useGetVisits(currentPage, pageSize);

    // Фильтрованные визиты по активному табу
    const filteredVisits = useMemo(() => {
        if (!data?.results) return [];
        return filterVisitsByCategory(data.results, activeTab);
    }, [data?.results, activeTab]);

    // Подсчет визитов для каждой категории
    const visitCounts = useMemo(() => {
        if (!data?.results) return { upcoming: 0, past: 0, cancelled: 0 };

        return {
            upcoming: filterVisitsByCategory(data.results, 'upcoming').length,
            past: filterVisitsByCategory(data.results, 'past').length,
            cancelled: filterVisitsByCategory(data.results, 'cancelled').length,
        };
    }, [data?.results]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab as VisitTab);
        // setCurrentPage(1); // Сбрасываем страницу при смене таба
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">
                    {error instanceof Error ? error.message : 'Произошла ошибка при загрузке данных'}
                </p>
            </div>
        );
    }

    // Пагинация (простая версия)
    const totalPages = Math.ceil((data?.count || 0) / pageSize);
    const canGoPrev = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages: number[] = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-center gap-2 mt-4">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!canGoPrev}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded ${
                            page === currentPage
                                ? 'bg-green-600 text-white'
                                : 'hover:bg-gray-100'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                {totalPages > 10 && (
                    <>
                        <span className="px-2">...</span>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            className="px-3 py-1 rounded hover:bg-gray-100"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!canGoNext}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        );
    };

    return (
        <div className="w-full">
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="w-full">
                    {/* Табы в стиле ViewToggle */}
                    <div className="border-b mb-5 mt-6 sm:mt-0">
                        <div className="flex items-center w-full">
                            <div
                                className={`justify-center flex p-4 border-b border-gray-300 flex-1 items-center cursor-pointer ${
                                    activeTab === 'upcoming' ? 'border-green-600 border-b-2' : ''
                                }`}
                                onClick={() => handleTabChange('upcoming')}
                            >
                                <button className={`flex items-center gap-2 ${
                                    activeTab === 'upcoming' ? 'text-green-600' : 'text-gray-900'
                                }`}>
                                    <span className="font-medium">Предстоящие ({visitCounts.upcoming})</span>
                                </button>
                            </div>
                            <div
                                className={`justify-center flex p-4 border-b border-gray-300 flex-1 items-center cursor-pointer ${
                                    activeTab === 'past' ? 'border-green-600 border-b-2' : ''
                                }`}
                                onClick={() => handleTabChange('past')}
                            >
                                <button className={`flex items-center gap-2 ${
                                    activeTab === 'past' ? 'text-green-600' : 'text-gray-900'
                                }`}>
                                    <span className="font-medium">Прошедшие ({visitCounts.past})</span>
                                </button>
                            </div>
                            <div
                                className={`justify-center flex p-4 border-b border-gray-300 flex-1 items-center cursor-pointer ${
                                    activeTab === 'cancelled' ? 'border-green-600 border-b-2' : ''
                                }`}
                                onClick={() => handleTabChange('cancelled')}
                            >
                                <button className={`flex items-center gap-2 ${
                                    activeTab === 'cancelled' ? 'text-green-600' : 'text-gray-900'
                                }`}>
                                    <span className="font-medium">Отмененные ({visitCounts.cancelled})</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Контент */}
                    <div className="p-0 mt-0">
                        {activeTab === 'cancelled' ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 mb-2">Нет отмененных записей</p>
                                <p className="text-sm text-gray-400">Отмененные записи будут отображаться здесь</p>
                            </div>
                        ) : filteredVisits.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-green-600 hover:bg-green-600 border-green-600">
                                        <TableHead className="font-semibold text-white">Дата</TableHead>
                                        <TableHead className="font-semibold text-white">Врач</TableHead>
                                        <TableHead className="font-semibold text-white">Клиника</TableHead>
                                        <TableHead className="font-semibold text-white">Услуга</TableHead>
                                        <TableHead className="text-right font-semibold text-white">Стоимость</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredVisits.map((visit) => (
                                        <VisitTableRow key={visit.id} visit={visit} />
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 mb-2">
                                    {activeTab === 'upcoming' ? 'Нет предстоящих записей' : 'Нет прошедших записей'}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {activeTab === 'upcoming'
                                        ? 'Записи на будущее время будут отображаться здесь'
                                        : 'История ваших посещений будет отображаться здесь'
                                    }
                                </p>
                            </div>
                        )}
                        {renderPagination()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyVisitsPage;
