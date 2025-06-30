'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, User, Stethoscope, Building2, Loader2, ChevronDown, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import { SearchAPI } from '@/shared/api/searchApi';
import { useCityStore } from '@/shared/stores/cityStore';
import { useWindowSize } from '@/shared/hooks/useWindowSize';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import { MobileSearchSheet } from '@/components/Search/MobileSearchSheet';
import { cn } from '@/lib/utils';
import doctorPlaceholder from '@/shared/assets/images/doctorPlaceholder.jpeg';

interface SearchDropdownProps {
    placeholder?: string;
    className?: string;
    onSelect?: () => void;
}

interface ResultsSectionProps {
    title: string;
    icon: React.ReactNode;
    items: any[];
    onItemClick: (slug: string) => void;
    renderItem: (item: any) => React.ReactNode;
    showMore: boolean;
    onShowMore: () => void;
    maxItems?: number;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
                                                           title,
                                                           icon,
                                                           items,
                                                           onItemClick,
                                                           renderItem,
                                                           showMore,
                                                           onShowMore,
                                                           maxItems = 5
                                                       }) => {
    if (items.length === 0) return null;

    const displayItems = showMore ? items : items.slice(0, maxItems);

    return (
        <div className="px-3 py-2">
            <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600">
                {icon}
                <span>{title} ({items.length})</span>
            </div>
            <div className="space-y-1">
                {displayItems.map((item) => renderItem(item))}
            </div>
            {items.length > maxItems && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onShowMore}
                    className="w-full mt-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                    {showMore ? 'Скрыть' : `Показать еще ${items.length - maxItems}`}
                    <ChevronDown className={cn("w-4 h-4 ml-1 transition-transform", showMore && "rotate-180")} />
                </Button>
            )}
        </div>
    );
};

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
                                                                  placeholder = "Поиск врачей, процедур, клиник...",
                                                                  className,
                                                                  onSelect
                                                              }) => {
    const router = useRouter();
    const { currentCity } = useCityStore();
    const { isMobile } = useWindowSize();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [showMoreDoctors, setShowMoreDoctors] = useState(false);
    const [showMoreProcedures, setShowMoreProcedures] = useState(false);
    const [showMoreClinics, setShowMoreClinics] = useState(false);
    const [showMoreSpecialities, setShowMoreSpecialities] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset show more states when query changes
    useEffect(() => {
        setShowMoreDoctors(false);
        setShowMoreProcedures(false);
        setShowMoreClinics(false);
        setShowMoreSpecialities(false);
    }, [debouncedQuery]);

    const { data, isLoading } = useQuery({
        queryKey: ['search-dropdown', currentCity?.id, debouncedQuery],
        queryFn: () => SearchAPI.search(currentCity?.id as number, debouncedQuery),
        enabled: !!currentCity?.id && debouncedQuery.length > 0 && !isMobile,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (!isMobile) {
            setIsOpen(value.length > 0);
        }
    };

    const handleInputFocus = () => {
        if (!isMobile && query.length > 0) {
            setIsOpen(true);
        }
    };

    const handleInputClick = () => {
        if (isMobile) {
            setIsMobileSheetOpen(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (isMobile) {
                setIsMobileSheetOpen(true);
            } else {
                handleViewAllResults();
            }
        }
    };

    const handleItemClick = (type: 'doctor' | 'procedure' | 'clinic' | 'speciality', slug: string) => {
        setIsOpen(false);
        setQuery('');
        onSelect?.();

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
            case 'speciality':
                router.push(`/specialities/${slug}`);
                break;
        }
    };

    const handleViewAllResults = () => {
        setIsOpen(false);
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleMobileSheetClose = () => {
        setIsMobileSheetOpen(false);
        setQuery('');
    };

    const renderDoctorItem = (doctor: any) => (
        <button
            key={doctor.id}
            onClick={() => handleItemClick('doctor', doctor.slug)}
            className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
        >
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                    src={doctor.main_photo_url || doctorPlaceholder}
                    alt={doctor.full_name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex-1 text-left">
                <div className="font-medium text-gray-900 text-sm">{doctor.full_name}</div>
                <div className="text-xs text-gray-500">Врач</div>
            </div>
        </button>
    );

    const renderProcedureItem = (procedure: any) => (
        <button
            key={procedure.id}
            onClick={() => handleItemClick('procedure', procedure.slug)}
            className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
        >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
                <div className="font-medium text-gray-900 text-sm">{procedure.title}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>Процедура</span>
                    {procedure.is_for_children && (
                        <span className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-full text-xs">
              Детская
            </span>
                    )}
                </div>
            </div>
        </button>
    );

    const renderClinicItem = (clinic: any) => (
        <button
            key={clinic.id}
            onClick={() => handleItemClick('clinic', clinic.slug)}
            className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
        >
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1 text-left">
                <div className="font-medium text-gray-900 text-sm">{clinic.title}</div>
                <div className="text-xs text-gray-500">{clinic.address}</div>
            </div>
        </button>
    );

    const renderSpecialityItem = (speciality: any) => (
        <button
            key={speciality.id}
            onClick={() => handleItemClick('speciality', speciality.slug)}
            className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
        >
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex-1 text-left">
                <div className="font-medium text-gray-900 text-sm">{speciality.title}</div>
                <div className="text-xs text-gray-500">Специальность</div>
            </div>
        </button>
    );

    const hasResults = data && (data.doctors.length > 0 || data.procedures.length > 0 || data.clinics.length > 0 || data.specialities.length > 0);

    const ResultsContent = () => (
        <>
            {isLoading ? (
                <div className="p-4 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">Поиск...</span>
                </div>
            ) : !debouncedQuery ? (
                <div className="p-4 text-center text-gray-500">
                    Введите запрос для поиска
                </div>
            ) : !hasResults ? (
                <div className="p-4 text-center">
                    <div className="text-gray-500 mb-2">Ничего не найдено</div>
                    <button
                        onClick={handleViewAllResults}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                        Перейти к полному поиску
                    </button>
                </div>
            ) : (
                <div className="py-2 max-h-96 overflow-y-auto">
                    {/* Doctors */}
                    <ResultsSection
                        title="Врачи"
                        icon={<User className="w-4 h-4 text-green-600" />}
                        items={data.doctors}
                        onItemClick={(slug) => handleItemClick('doctor', slug)}
                        renderItem={renderDoctorItem}
                        showMore={showMoreDoctors}
                        onShowMore={() => setShowMoreDoctors(!showMoreDoctors)}
                    />

                    {/* Procedures */}
                    <ResultsSection
                        title="Процедуры"
                        icon={<Stethoscope className="w-4 h-4 text-blue-600" />}
                        items={data.procedures}
                        onItemClick={(slug) => handleItemClick('procedure', slug)}
                        renderItem={renderProcedureItem}
                        showMore={showMoreProcedures}
                        onShowMore={() => setShowMoreProcedures(!showMoreProcedures)}
                    />

                    {/* Clinics */}
                    <ResultsSection
                        title="Клиники"
                        icon={<Building2 className="w-4 h-4 text-purple-600" />}
                        items={data.clinics}
                        onItemClick={(slug) => handleItemClick('clinic', slug)}
                        renderItem={renderClinicItem}
                        showMore={showMoreClinics}
                        onShowMore={() => setShowMoreClinics(!showMoreClinics)}
                    />

                    {/* Specialities */}
                    <ResultsSection
                        title="Специальности"
                        icon={<GraduationCap className="w-4 h-4 text-indigo-600" />}
                        items={data.specialities}
                        onItemClick={(slug) => handleItemClick('speciality', slug)}
                        renderItem={renderSpecialityItem}
                        showMore={showMoreSpecialities}
                        onShowMore={() => setShowMoreSpecialities(!showMoreSpecialities)}
                    />
                </div>
            )}
        </>
    );

    return (
        <div ref={dropdownRef} className={cn('relative w-full', className)}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onClick={handleInputClick}
                    onKeyDown={handleKeyDown}
                    readOnly={isMobile}
                    className={cn(
                        "h-12 w-full pl-10 pr-4 py-2 bg-green-light-1 border-0 focus:ring-1 focus:ring-green-500 rounded-md",
                        isMobile && "cursor-pointer"
                    )}
                />
            </div>

            {/* Desktop Dropdown */}
            {!isMobile && isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <ResultsContent />
                </div>
            )}

            {/* Mobile Sheet */}
            <MobileSearchSheet
                isOpen={isMobileSheetOpen}
                onClose={handleMobileSheetClose}
                initialQuery={query}
            />
        </div>
    );
};
