'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, User, Stethoscope, Building2, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { SearchAPI } from '@/shared/api/searchApi';
import { useCityStore } from '@/shared/stores/cityStore';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import { Card } from '@/components/shadcn/card';
import { Skeleton } from '@/components/shadcn/skeleton';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/shadcn/sheet";
import { cn } from '@/lib/utils';
import doctorPlaceholder from '@/shared/assets/images/doctorPlaceholder.jpeg';

interface MobileSearchSheetProps {
    isOpen: boolean;
    onClose: () => void;
    initialQuery?: string;
}

interface MobileResultsSectionProps {
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

const MobileResultsSection: React.FC<MobileResultsSectionProps> = ({
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
            <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                    {icon}
                    <h3 className="text-lg font-semibold">{title}</h3>
                </div>
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="p-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="flex-1">
                                <Skeleton className="w-3/4 h-4 mb-2" />
                                <Skeleton className="w-1/2 h-3" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                    {icon}
                    <h3 className="text-lg font-semibold">{title}</h3>
                </div>
                <Card className="p-6 text-center">
                    <div className="text-gray-400 mb-2 flex justify-center">
                        {title === 'Врачи' && <User className="w-8 h-8" />}
                        {title === 'Процедуры' && <Stethoscope className="w-8 h-8" />}
                        {title === 'Клиники' && <Building2 className="w-8 h-8" />}
                    </div>
                    <p className="text-gray-500 text-sm">Ничего не найдено</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
                {icon}
                <h3 className="text-lg font-semibold">{title} ({items.length})</h3>
            </div>
            <div className="space-y-2">
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

export const MobileSearchSheet: React.FC<MobileSearchSheetProps> = ({
                                                                        isOpen,
                                                                        onClose,
                                                                        initialQuery = ''
                                                                    }) => {
    const router = useRouter();
    const { currentCity } = useCityStore();
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
    const [showMoreDoctors, setShowMoreDoctors] = useState(false);
    const [showMoreProcedures, setShowMoreProcedures] = useState(false);
    const [showMoreClinics, setShowMoreClinics] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto focus when sheet opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300); // Delay to ensure sheet animation is complete
        }
    }, [isOpen]);

    // Reset initial query when sheet opens
    useEffect(() => {
        if (isOpen) {
            setSearchQuery(initialQuery);
            setDebouncedQuery(initialQuery);
        }
    }, [isOpen, initialQuery]);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Reset show more states when query changes
    useEffect(() => {
        setShowMoreDoctors(false);
        setShowMoreProcedures(false);
        setShowMoreClinics(false);
    }, [debouncedQuery]);

    const { data, isLoading } = useQuery({
        queryKey: ['mobile-search', currentCity?.id, debouncedQuery],
        queryFn: () => SearchAPI.search(currentCity?.id as number, debouncedQuery),
        enabled: !!currentCity?.id && debouncedQuery.length > 0 && isOpen,
    });

    const handleItemClick = (type: 'doctor' | 'procedure' | 'clinic', slug: string) => {
        onClose();

        switch (type) {
            case 'doctor':
                router.push(`/doctor/${slug}`);
                break;
            case 'procedure':
                router.push(`/procedure/${slug}`);
                break;
            case 'clinic':
                router.push(`/clinic/${slug}`);
                break;
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setDebouncedQuery('');
    };

    const renderDoctorItem = (doctor: any) => (
        <Card
            key={doctor.id}
            className="p-3 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
            onClick={() => handleItemClick('doctor', doctor.slug)}
        >
            <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                    <Image
                        src={doctor.main_photo_url || doctorPlaceholder}
                        alt={doctor.full_name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{doctor.full_name}</h4>
                    <p className="text-xs text-gray-500">Врач</p>
                </div>
                <div className="text-green-600">
                    <User className="w-4 h-4" />
                </div>
            </div>
        </Card>
    );

    const renderProcedureItem = (procedure: any) => (
        <Card
            key={procedure.id}
            className="p-3 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
            onClick={() => handleItemClick('procedure', procedure.slug)}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{procedure.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Процедура</span>
                        {procedure.is_for_children && (
                            <span className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-full text-xs">
                Детская
              </span>
                        )}
                    </div>
                </div>
                <div className="text-blue-600">
                    <Stethoscope className="w-4 h-4" />
                </div>
            </div>
        </Card>
    );

    const renderClinicItem = (clinic: any) => (
        <Card
            key={clinic.id}
            className="p-3 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
            onClick={() => handleItemClick('clinic', clinic.slug)}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{clinic.title}</h4>
                    <p className="text-xs text-gray-500">{clinic.address}</p>
                </div>
                <div className="text-purple-600">
                    <Building2 className="w-4 h-4" />
                </div>
            </div>
        </Card>
    );

    const totalResults = data ? data.doctors.length + data.procedures.length + data.clinics.length : 0;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="bottom" className="h-[90vh] rounded-t-[20px] p-0 flex flex-col">
                {/* Header */}
                <SheetHeader className="p-4 border-b flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-xl font-semibold">
                            Поиск
                        </SheetTitle>
                    </div>

                    {/* Search Input */}
                    <div className="mt-4 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            ref={inputRef}
                            type="text"
                            placeholder="Поиск врачей, процедур, клиник..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-10 h-12 text-base"
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

                    {/* Results Summary */}
                    {!isLoading && totalResults > 0 && (
                        <div className="flex items-center gap-2 text-gray-600 mt-2">
                            <Search className="w-4 h-4" />
                            <span className="text-sm">Найдено {totalResults} результатов</span>
                        </div>
                    )}
                </SheetHeader>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4">
                        {!debouncedQuery ? (
                            /* Empty State */
                            <div className="text-center py-8">
                                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                    Начните поиск
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    Введите название врача, процедуры или клиники
                                </p>
                            </div>
                        ) : totalResults === 0 && !isLoading ? (
                            /* No Results */
                            <div className="text-center py-8">
                                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                    Ничего не найдено
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    Попробуйте изменить поисковый запрос
                                </p>
                            </div>
                        ) : (
                            /* Results */
                            <div className="space-y-6">
                                {/* Doctors */}
                                <MobileResultsSection
                                    title="Врачи"
                                    icon={<User className="w-5 h-5 text-green-600" />}
                                    items={data?.doctors || []}
                                    onItemClick={(slug) => handleItemClick('doctor', slug)}
                                    renderItem={renderDoctorItem}
                                    showMore={showMoreDoctors}
                                    onShowMore={() => setShowMoreDoctors(!showMoreDoctors)}
                                    isLoading={isLoading}
                                />

                                {/* Procedures */}
                                <MobileResultsSection
                                    title="Процедуры"
                                    icon={<Stethoscope className="w-5 h-5 text-blue-600" />}
                                    items={data?.procedures || []}
                                    onItemClick={(slug) => handleItemClick('procedure', slug)}
                                    renderItem={renderProcedureItem}
                                    showMore={showMoreProcedures}
                                    onShowMore={() => setShowMoreProcedures(!showMoreProcedures)}
                                    isLoading={isLoading}
                                />

                                {/* Clinics */}
                                <MobileResultsSection
                                    title="Клиники"
                                    icon={<Building2 className="w-5 h-5 text-purple-600" />}
                                    items={data?.clinics || []}
                                    onItemClick={(slug) => handleItemClick('clinic', slug)}
                                    renderItem={renderClinicItem}
                                    showMore={showMoreClinics}
                                    onShowMore={() => setShowMoreClinics(!showMoreClinics)}
                                    isLoading={isLoading}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
