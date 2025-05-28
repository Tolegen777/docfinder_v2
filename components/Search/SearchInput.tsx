'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import { MobileSearchSheet } from '@/components/Search/MobileSearchSheet';
import { useWindowSize } from '@/shared/hooks/useWindowSize';
import { cn } from '@/lib/utils';

interface SearchInputProps {
    placeholder?: string;
    className?: string;
    variant?: 'default' | 'hero' | 'compact';
    onSearch?: (query: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
                                                            placeholder = "Поиск врачей, процедур, клиник...",
                                                            className,
                                                            variant = 'default',
                                                            onSearch
                                                        }) => {
    const router = useRouter();
    const { isMobile } = useWindowSize();
    const [query, setQuery] = useState('');
    const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            if (onSearch) {
                onSearch(query.trim());
            } else if (!isMobile) {
                router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            }
        }
    };

    const handleInputClick = () => {
        if (isMobile) {
            setIsMobileSheetOpen(true);
        } else if (variant === 'compact' || variant === 'hero') {
            router.push('/search');
        }
    };

    const handleMobileSheetClose = () => {
        setIsMobileSheetOpen(false);
    };

    const getInputStyles = () => {
        switch (variant) {
            case 'hero':
                return 'h-12 text-base pl-10 pr-4 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-green-600 bg-green-50 cursor-pointer';
            case 'compact':
                return 'h-10 text-sm pl-10 pr-4 rounded-lg border border-gray-300 cursor-pointer';
            default:
                return 'h-12 text-base pl-10 pr-16 rounded-lg border border-gray-300 focus:border-green-500';
        }
    };

    const getButtonStyles = () => {
        switch (variant) {
            case 'hero':
                return 'hidden'; // Убираем кнопку для hero варианта
            case 'compact':
                return 'hidden';
            default:
                return 'absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm';
        }
    };

    const getIconStyles = () => {
        switch (variant) {
            case 'hero':
                return 'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400';
            case 'compact':
                return 'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400';
            default:
                return 'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400';
        }
    };

    const isReadOnly = variant === 'compact' || variant === 'hero' || isMobile;

    return (
        <>
            <form
                onSubmit={handleSearch}
                className={cn('relative w-full', className)}
            >
                <Search className={getIconStyles()} />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onClick={handleInputClick}
                    readOnly={isReadOnly}
                    className={getInputStyles()}
                />
                {!isReadOnly && (
                    <Button
                        type="submit"
                        size="sm"
                        className={getButtonStyles()}
                    >
                        Поиск
                    </Button>
                )}
            </form>

            {/* Mobile Sheet */}
            <MobileSearchSheet
                isOpen={isMobileSheetOpen}
                onClose={handleMobileSheetClose}
            />
        </>
    );
};
