'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { useQuery } from '@tanstack/react-query';
import { ProceduresAPI } from '@/shared/api/proceduresApi';
import { useProceduresStore } from '@/stores/useProceduresStore';
import { AnalysisSection } from "@/components/AnalysisSection/AnalysisSection";
import { cn } from '@/shared/lib/utils';
import { ProcedureGroup } from './ProcedureGroup';
import {ProceduresSkeleton} from "@/components/ServicesSection/ProceduresSkeleton";

const SearchBar = () => (
    <div className="relative">
        <input
            type="text"
            placeholder="Поиск по услугам"
            className="w-full px-4 py-2 rounded-md border border-gray-200 bg-green-50 focus:outline-none focus:border-green-500"
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
    </div>
);

const CategoryNav = ({ categories }: { categories: any[] }) => {
    const { activeCategoryId, setActiveCategory } = useProceduresStore();

    return (
        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar border-b">
            {categories.map((category) => (
                <button
                    key={category.procedure_category_id}
                    onClick={() => setActiveCategory(category.procedure_category_id)}
                    className={cn(
                        "text-sm whitespace-nowrap pb-4 -mb-4",
                        category.procedure_category_id === activeCategoryId
                            ? "text-green-500 border-b-2 border-green-500"
                            : "text-gray-600 hover:text-gray-900"
                    )}
                >
                    {category.procedure_category_title}
                </button>
            ))}
            <button
                onClick={() => setActiveCategory(-1)}
                className={cn(
                    "text-sm whitespace-nowrap pb-4 -mb-4",
                    -1 === activeCategoryId
                        ? "text-green-500 border-b-2 border-green-500"
                        : "text-gray-600 hover:text-gray-900"
                )}
            >
                Анализы
            </button>
        </div>
    );
};

const SubCategoryNav = ({ subCategories }: { subCategories: any[] }) => {
    const { activeSubCategoryId, setActiveSubCategory } = useProceduresStore();

    return (
        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar border-b mt-6">
            {subCategories.map((subcat) => (
                <button
                    key={subcat.procedure_category_id}
                    onClick={() => setActiveSubCategory(subcat.procedure_category_id)}
                    className={cn(
                        "text-sm whitespace-nowrap pb-4 -mb-4",
                        subcat.procedure_category_id === activeSubCategoryId
                            ? "text-green-500 border-b-2 border-green-500"
                            : "text-gray-600 hover:text-gray-900"
                    )}
                >
                    {subcat.procedure_category_title}
                </button>
            ))}
        </div>
    );
};

// ServicesSection.tsx
export const ServicesSection = () => {
    const { activeCategoryId, activeSubCategoryId } = useProceduresStore();

    // Загружаем основные категории
    const { data: categories = [] } = useQuery({
        queryKey: ['procedureCategories'],
        queryFn: ProceduresAPI.getTopLevelCategories,
    });

    // Загружаем детали активной категории
    const { data: categoryDetails, isLoading: isCategoryLoading } = useQuery({
        queryKey: ['categoryDetails', activeCategoryId],
        queryFn: () => activeCategoryId ? ProceduresAPI.getCategoryDetails(activeCategoryId) : null,
        enabled: !!activeCategoryId && activeCategoryId !== -1,
    });

    // Загружаем детали активной подкатегории
    const { data: subCategoryDetails, isLoading: isSubCategoryLoading } = useQuery({
        queryKey: ['subCategoryDetails', activeSubCategoryId],
        queryFn: () => activeSubCategoryId ? ProceduresAPI.getCategoryDetails(activeSubCategoryId) : null,
        enabled: !!activeSubCategoryId,
    });

    const renderContent = () => {
        if (activeCategoryId === -1) {
            return <AnalysisSection />;
        }

        // Показываем скелетон только когда идет реальная загрузка
        if ((activeCategoryId && isCategoryLoading) ||
            (activeSubCategoryId && isSubCategoryLoading)) {
            return <ProceduresSkeleton />;
        }

        // Если нет активной категории, возвращаем пустой контент
        if (!activeCategoryId) {
            return null;
        }

        // Если есть данные, показываем их
        if (categoryDetails) {
            const proceduresToShow = activeSubCategoryId && subCategoryDetails
                ? subCategoryDetails.medical_procedures_list
                : categoryDetails.medical_procedures_list;

            return (
                <>
                    {categoryDetails.child_procedure_categories_list.length > 0 && (
                        <SubCategoryNav
                            subCategories={categoryDetails.child_procedure_categories_list}
                        />
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                        {proceduresToShow.map((procedure) => (
                            <ProcedureGroup
                                key={procedure.medical_procedure_id}
                                procedure={procedure}
                            />
                        ))}
                    </div>
                </>
            );
        }

        return null;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <CategoryNav categories={categories} />

            <div className="flex gap-4 items-center my-6">
                <div className="flex-1 max-w-xl">
                    <SearchBar />
                </div>
                <Button className="bg-green-500 hover:bg-green-600 text-white whitespace-nowrap">
                    Записаться онлайн
                </Button>
            </div>

            {renderContent()}
        </div>
    );
};
