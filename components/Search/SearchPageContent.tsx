'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, User, Stethoscope, Building2, ArrowLeft, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { SearchAPI, SearchResponse } from '@/shared/api/searchApi';
import { useCityStore } from '@/shared/stores/cityStore';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import { Card } from '@/components/shadcn/card';
import { Skeleton } from '@/components/shadcn/skeleton';
import { cn } from '@/lib/utils';
import doctorPlaceholder from '@/shared/assets/images/doctorPlaceholder.jpeg';

interface ResultsColumnProps {
    title: string;
    icon: React.ReactNode;
    items: any[];
    onItemClick: (slug: string) => void;
    renderItem: (item: any) => React.ReactNode;
    showMore: boolean;
    onShowMore: () => void;
    isLoading: boolean;
    maxItems?: number;
}

const ResultsColumn: React.FC<ResultsColumnProps> = ({
                                                         title,
                                                         icon,
                                                         items,
                                                         onItemClick,
                                                         renderItem,
                                                         showMore,
                                                         onShowMore,
                                                         isLoading,
                                                         maxItems = 5
                                                     }) => {
    const displayItems = showMore ? items : items.slice(0, maxItems);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    {icon}
                    <h3 className="text-lg font-semibold">{title}</h3>
                </div>
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="p-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="flex-1">
                                <Skeleton className="w-3/4 h-5 mb-2" />
                                <Skeleton className="w-1/2 h-4" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    {icon}
                    <h3 className="text-lg font-semibold">{title}</h3>
                </div>
                <Card className="p-8 text-center border-2 border-dashed border-gray-200 bg-gray-50/50">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        {title === 'Врачи' && <User className="w-8 h-8 text-gray-400" />}
                        {title === 'Процедуры' && <Stethoscope className="w-8 h-8 text-gray-400" />}
                        {title === 'Клиники' && <Building2 className="w-8 h-8 text-gray-400" />}
                    </div>
                    <p className="text-gray-500 font-medium">Ничего не найдено</p>
                    <p className="text-gray-400 text-sm mt-1">Попробуйте изменить поисковый запрос</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                {icon}
                <h3 className="text-lg font-semibold">{title} ({items.length})</h3>
            </div>
            <div className="space-y-3">
                {displayItems.map((item) => renderItem(item))}
            </div>
            {items.length > maxItems && (
                <Button
                    variant="outline"
                    onClick={onShowMore}
                    className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                    {showMore ? 'Скрыть' : `Показать еще ${items.length - maxItems}`}
                    <ChevronDown className={cn("w-4 h-4 ml-2 transition-transform", showMore && "rotate-180")} />
                </Button>
            )}
        </div>
    );
};

export function SearchPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currentCity } = useCityStore();
    const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const [showMoreDoctors, setShowMoreDoctors] = useState(false);
    const [showMoreProcedures, setShowMoreProcedures] = useState(false);
    const [showMoreClinics, setShowMoreClinics] = useState(false);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Update URL when search query changes
    useEffect(() => {
        if (debouncedQuery) {
            const url = new URL(window.location.href);
            url.searchParams.set('q', debouncedQuery);
            window.history.replaceState({}, '', url.toString());
        }
    }, [debouncedQuery]);

    // Reset show more states when query changes
    useEffect(() => {
        setShowMoreDoctors(false);
        setShowMoreProcedures(false);
        setShowMoreClinics(false);
    }, [debouncedQuery]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['search', currentCity?.id, debouncedQuery],
        queryFn: () => SearchAPI.search(currentCity?.id as number, debouncedQuery),
        enabled: !!currentCity?.id && debouncedQuery.length > 0,
    });

    const handleBack = () => {
        router.back();
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setDebouncedQuery('');
    };

    const handleDoctorClick = (slug: string) => {
        router.push(`/doctor/${slug}`);
    };

    const handleProcedureClick = (slug: string) => {
        router.push(`/procedure/${slug}`);
    };

    const handleClinicClick = (slug: string) => {
        router.push(`/clinic/${slug}`);
    };

    const renderDoctorItem = (doctor: any) => (
        <Card
            key={doctor.id}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleDoctorClick(doctor.slug)}
        >
            <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    <Image
                        src={doctor.main_photo_url || doctorPlaceholder}
                        alt={doctor.full_name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{doctor.full_name}</h4>
                    <p className="text-sm text-gray-500">Врач</p>
                </div>
                <div className="text-green-600">
                    <User className="w-5 h-5" />
                </div>
            </div>
        </Card>
    );

    const renderProcedureItem = (procedure: any) => (
        <Card
            key={procedure.id}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleProcedureClick(procedure.slug)}
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{procedure.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Процедура</span>
                        {procedure.is_for_children && (
                            <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs">
                Детская
              </span>
                        )}
                    </div>
                </div>
                <div className="text-blue-600">
                    <Stethoscope className="w-5 h-5" />
                </div>
            </div>
        </Card>
    );

    const renderClinicItem = (clinic: any) => (
        <Card
            key={clinic.id}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleClinicClick(clinic.slug)}
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{clinic.title}</h4>
                    <p className="text-sm text-gray-500">{clinic.address}</p>
                </div>
                <div className="text-purple-600">
                    <Building2 className="w-5 h-5" />
                </div>
            </div>
        </Card>
    );

    const totalResults = data ? data.doctors.length + data.procedures.length + data.clinics.length : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="lg"
                            onClick={handleBack}
                            className="h-12 px-4 hover:bg-gray-100 rounded-xl"
                        >
                            <ArrowLeft className="w-6 h-6" />
                            <span className="hidden md:inline ml-2 font-medium">Назад</span>
                        </Button>

                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Поиск врачей, процедур, клиник..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-10 h-12 text-base"
                                autoFocus
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearSearch}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {!debouncedQuery ? (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                            Начните поиск
                        </h2>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Введите название врача, процедуры или клиники в поисковую строку выше
                        </p>
                    </div>
                ) : error ? (
                    /* Error State */
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                            Ошибка поиска
                        </h2>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Произошла ошибка при выполнении поиска. Попробуйте повторить попытку позже
                        </p>
                    </div>
                ) : totalResults === 0 && !isLoading ? (
                    /* No Results */
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                            Ничего не найдено
                        </h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            Мы не смогли найти результаты по запросу <span className="font-medium text-gray-700">"{debouncedQuery}"</span>
                        </p>
                        <div className="text-sm text-gray-400 space-y-1">
                            <p>Попробуйте:</p>
                            <p>• Изменить поисковый запрос</p>
                            <p>• Использовать более общие термины</p>
                            <p>• Проверить правильность написания</p>
                        </div>
                    </div>
                ) : (
                    /* Results */
                    <div>
                        {!isLoading && totalResults > 0 && (
                            <div className="flex items-center gap-2 text-gray-600 mb-6">
                                <Search className="w-5 h-5" />
                                <span>Найдено {totalResults} результатов</span>
                            </div>
                        )}

                        {/* Results Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Doctors Column */}
                            <ResultsColumn
                                title="Врачи"
                                icon={<User className="w-5 h-5 text-green-600" />}
                                items={data?.doctors || []}
                                onItemClick={handleDoctorClick}
                                renderItem={renderDoctorItem}
                                showMore={showMoreDoctors}
                                onShowMore={() => setShowMoreDoctors(!showMoreDoctors)}
                                isLoading={isLoading}
                            />

                            {/* Procedures Column */}
                            <ResultsColumn
                                title="Процедуры"
                                icon={<Stethoscope className="w-5 h-5 text-blue-600" />}
                                items={data?.procedures || []}
                                onItemClick={handleProcedureClick}
                                renderItem={renderProcedureItem}
                                showMore={showMoreProcedures}
                                onShowMore={() => setShowMoreProcedures(!showMoreProcedures)}
                                isLoading={isLoading}
                            />

                            {/* Clinics Column */}
                            <ResultsColumn
                                title="Клиники"
                                icon={<Building2 className="w-5 h-5 text-purple-600" />}
                                items={data?.clinics || []}
                                onItemClick={handleClinicClick}
                                renderItem={renderClinicItem}
                                showMore={showMoreClinics}
                                onShowMore={() => setShowMoreClinics(!showMoreClinics)}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
