'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProceduresAPI } from '@/shared/api/proceduresApi';
import { cn } from '@/lib/utils';
import { ProcedureGroup } from './ProcedureGroup';
import { ProceduresSkeleton } from './ProceduresSkeleton';

interface CategoryViewProps {
    categoryId: number;
    level: number;
    onSelectCategory?: (id: number) => void;
}

export const RecursiveCategoryView: React.FC<CategoryViewProps> = ({
                                                                       categoryId,
                                                                       level,
                                                                       onSelectCategory
                                                                   }) => {
    const [activeSubCategoryId, setActiveSubCategoryId] = React.useState<number | null>(null);

    // Загружаем детали текущей категории
    const { data: categoryDetails, isLoading } = useQuery({
        queryKey: ['categoryDetails', categoryId, level],
        queryFn: () => categoryId ? ProceduresAPI.getCategoryDetails(categoryId) : null,
        enabled: !!categoryId && categoryId !== -1,
    });

    if (isLoading) {
        return <ProceduresSkeleton />;
    }

    if (!categoryDetails) {
        return null;
    }

    const handleCategorySelect = (id: number) => {
        setActiveSubCategoryId(id);
        if (onSelectCategory) {
            onSelectCategory(id);
        }
    };

    // Определяем, есть ли у нас дочерние категории для отображения
    const hasChildColumns = categoryDetails.child_procedure_categories_columns &&
        categoryDetails.child_procedure_categories_columns.length > 0;

    // Если активна подкатегория и у нас есть колонки, найдем активную колонку
    const activeColumn = hasChildColumns && activeSubCategoryId
        ? categoryDetails.child_procedure_categories_columns.find(col => col.procedure_category_id === activeSubCategoryId)
        : hasChildColumns
            ? categoryDetails.child_procedure_categories_columns[0]
            : null;

    // Определяем, имеет ли активная колонка дочерние категории
    const hasChildCategories = activeColumn &&
        activeColumn.child_categories &&
        activeColumn.child_categories.length > 0;

    return (
        <div className={`mt-${level > 0 ? '6' : '0'}`}>
            {/* Отображаем табы для колонок дочерних категорий */}
            {hasChildColumns && (
                <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar border-b mb-6">
                    {categoryDetails.child_procedure_categories_columns.map((column) => (
                        <button
                            key={column.procedure_category_id}
                            onClick={() => handleCategorySelect(column.procedure_category_id)}
                            className={cn(
                                "text-sm whitespace-nowrap pb-4 -mb-4",
                                (activeSubCategoryId === column.procedure_category_id ||
                                    (!activeSubCategoryId && column === categoryDetails.child_procedure_categories_columns[0]))
                                    ? "text-green-500 border-b-2 border-green-500"
                                    : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            {column.procedure_category_title}
                        </button>
                    ))}
                </div>
            )}

            {/* Если у активной колонки есть дочерние категории, отображаем их как табы */}
            {activeColumn && hasChildCategories && (
                <div>
                    {/* Отображаем табы для дочерних категорий */}
                    <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar border-b mb-6">
                        {activeColumn.child_categories.map((childCategory) => (
                            <button
                                key={childCategory.procedure_category_id}
                                onClick={() => handleCategorySelect(childCategory.procedure_category_id)}
                                className={cn(
                                    "text-sm whitespace-nowrap pb-4 -mb-4",
                                    activeSubCategoryId === childCategory.procedure_category_id
                                        ? "text-green-500 border-b-2 border-green-500"
                                        : "text-gray-600 hover:text-gray-900"
                                )}
                            >
                                {childCategory.procedure_category_title}
                            </button>
                        ))}
                    </div>

                    {/* Если выбрана дочерняя категория, рекурсивно отображаем её содержимое */}
                    {activeSubCategoryId && (
                        <RecursiveCategoryView
                            categoryId={activeSubCategoryId}
                            level={level + 1}
                            onSelectCategory={onSelectCategory}
                        />
                    )}
                </div>
            )}

            {/* Отображаем процедуры из текущей категории или активной колонки */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                {/* Если есть активная колонка, показываем её процедуры */}
                {activeColumn && activeColumn.procedures && activeColumn.procedures.map(procedure => (
                    <ProcedureGroup
                        key={procedure.medical_procedure_id}
                        procedure={procedure}
                    />
                ))}

                {/* Если нет активной колонки или у активной колонки нет процедур,
            показываем процедуры из текущей категории */}
                {(!activeColumn || !activeColumn.procedures || activeColumn.procedures.length === 0) &&
                    categoryDetails.medical_procedures_list &&
                    categoryDetails.medical_procedures_list.map(procedure => (
                        <ProcedureGroup
                            key={procedure.medical_procedure_id}
                            procedure={procedure}
                        />
                    ))
                }
            </div>
        </div>
    );
};
