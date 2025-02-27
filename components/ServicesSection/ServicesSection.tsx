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
import { ProceduresSkeleton } from "@/components/ServicesSection/ProceduresSkeleton";
import { AlphabeticalProcedures } from './AlphabeticalProcedures';

const SearchBar = () => (
    <div className="relative">
        <input
            type="text"
            placeholder="Поиск по услугам"
            className="w-full px-4 py-2 rounded-md border border-gray-200 bg-green-light-1 focus:outline-none focus:border-green-500"
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

const SubCategoryNav = ({ columns }: { columns: any[] }) => {
    const { activeColumnId, setActiveColumn } = useProceduresStore();

    return (
        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar border-b mt-6">
            {columns.map((column) => (
                <button
                    key={column.procedure_category_id}
                    onClick={() => setActiveColumn(column.procedure_category_id)}
                    className={cn(
                        "text-sm whitespace-nowrap pb-4 -mb-4",
                        column.procedure_category_id === activeColumnId
                            ? "text-green-500 border-b-2 border-green-500"
                            : "text-gray-600 hover:text-gray-900"
                    )}
                >
                    {column.procedure_category_title}
                </button>
            ))}
        </div>
    );
};

// ServicesSection.tsx
export const ServicesSection = () => {
    const { activeCategoryId, activeColumnId, activeChildCategoryId } = useProceduresStore();

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

    // Загружаем детали активной дочерней категории
    const { data: childCategoryDetails, isLoading: isChildCategoryLoading } = useQuery({
        queryKey: ['childCategoryDetails', activeChildCategoryId],
        queryFn: () => activeChildCategoryId ? ProceduresAPI.getCategoryDetails(activeChildCategoryId) : null,
        enabled: !!activeChildCategoryId,
    });

    const renderContent = () => {
        if (activeCategoryId === -1) {
            return <AnalysisSection />;
        }

        // Показываем скелетон только когда идет реальная загрузка
        if ((activeCategoryId && isCategoryLoading) ||
            (activeChildCategoryId && isChildCategoryLoading)) {
            return <ProceduresSkeleton />;
        }

        // Если нет активной категории, возвращаем пустой контент
        if (!activeCategoryId || !categoryDetails) {
            return null;
        }

        // Определяем, какие данные показывать
        // let proceduresToShow = [];
        let showAlphabeticalList = true;

        // Если выбрана дочерняя категория и есть её данные
        if (activeChildCategoryId && childCategoryDetails) {
            // proceduresToShow = childCategoryDetails.medical_procedures_list || [];
            // Для дочерней категории не показываем алфавитный список снизу
            showAlphabeticalList = false;
        } else {
            // Находим активную колонку
            const columns = categoryDetails.child_procedure_categories_columns || [];
            const activeColumn = columns.find(col => col.procedure_category_id === activeColumnId) ||
                (columns.length > 0 ? columns[0] : null);

            if (activeColumn) {
                // proceduresToShow = activeColumn.procedures || [];
            }
        }

        return (
            <>
                {/* Отображаем табы колонок */}
                {categoryDetails.child_procedure_categories_columns?.length > 0 && (
                    <SubCategoryNav columns={categoryDetails.child_procedure_categories_columns} />
                )}

                {/* Отображаем активную колонку */}
                {!activeChildCategoryId && activeColumnId && categoryDetails.child_procedure_categories_columns && (
                    <div className="mt-6">
                        {/* Активная колонка */}
                        {(() => {
                            const activeColumn = categoryDetails.child_procedure_categories_columns.find(
                                col => col.procedure_category_id === activeColumnId
                            ) || (categoryDetails.child_procedure_categories_columns.length > 0
                                ? categoryDetails.child_procedure_categories_columns[0]
                                : null);

                            if (!activeColumn) return null;

                            return (
                                <>
                                    {/* Показываем дочерние категории как табы */}
                                    {activeColumn.child_categories && activeColumn.child_categories.length > 0 && (
                                        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar border-b mb-6">
                                            {activeColumn.child_categories.map((childCategory) => (
                                                <button
                                                    key={childCategory.procedure_category_id}
                                                    onClick={() => useProceduresStore.getState().setActiveChildCategory(childCategory.procedure_category_id)}
                                                    className={cn(
                                                        "text-sm whitespace-nowrap pb-4 -mb-4",
                                                        useProceduresStore.getState().activeChildCategoryId === childCategory.procedure_category_id
                                                            ? "text-green-500 border-b-2 border-green-500"
                                                            : "text-gray-600 hover:text-gray-900"
                                                    )}
                                                >
                                                    {childCategory.procedure_category_title}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Отображаем процедуры из активной колонки */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {activeColumn.procedures?.map(procedure => (
                                            <ProcedureGroup
                                                key={procedure.medical_procedure_id}
                                                procedure={procedure}
                                            />
                                        ))}
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                )}

                {/* Отображаем контент дочерней категории, если она выбрана */}
                {activeChildCategoryId && childCategoryDetails && (
                    <div className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {childCategoryDetails.medical_procedures_list?.map(procedure => (
                                <ProcedureGroup
                                    key={procedure.medical_procedure_id}
                                    procedure={procedure}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Группируем и отображаем medical_procedures_list по алфавиту */}
                {showAlphabeticalList && categoryDetails.medical_procedures_list &&
                    categoryDetails.medical_procedures_list.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-xl font-semibold mb-6">Медицинские услуги</h2>
                            <AlphabeticalProcedures
                                procedures={categoryDetails.medical_procedures_list}
                            />
                        </div>
                    )}
            </>
        );
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
