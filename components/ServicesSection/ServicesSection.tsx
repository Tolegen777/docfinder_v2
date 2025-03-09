'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { useQuery } from '@tanstack/react-query';
import { ProceduresAPI } from '@/shared/api/proceduresApi';
import { AnalysisSection } from "@/components/AnalysisSection/AnalysisSection";
import { ProcedureGroup } from './ProcedureGroup';
import { ProceduresSkeleton } from './ProceduresSkeleton';
import { AlphabeticalProcedures } from './AlphabeticalProcedures';
import { CategoryTabs } from './CategoryTabs';

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

// Компонент скелетона для табов
const CategoryTabsSkeleton = ({ level = 0 }) => {
    const count = level === 0 ? 6 : 4; // Разное количество для разных уровней

    // Стили в зависимости от уровня
    const containerStyle =
        level === 0 ? "border-b pb-4" :
            level === 1 ? "border rounded-md border-gray-200 py-4 my-4 bg-gray-50" :
                "border rounded-md py-4 mb-6 bg-gray-100";

    return (
        <div className={`flex flex-wrap gap-x-6 gap-y-4 ${containerStyle}`}>
            {Array(count).fill(0).map((_, i) => (
                <div
                    key={`tab-skeleton-${level}-${i}`}
                    className="h-6 bg-gray-200 rounded-md animate-pulse"
                    style={{ width: `${Math.random() * 60 + 60}px` }}
                />
            ))}
        </div>
    );
};

// Интерфейс для отслеживания активных категорий на каждом уровне
interface ActiveCategories {
    [level: number]: number | null;
}

// ServicesSection.tsx
export const ServicesSection = () => {
    // Состояние для хранения активных категорий на каждом уровне
    const [activeCategories, setActiveCategories] = useState<ActiveCategories>({});

    // Храним загруженные категории для каждого уровня
    const [loadedCategories, setLoadedCategories] = useState<{ [key: string]: any }>({});

    // Отслеживаем загрузки для каждого уровня
    const [loadingStates, setLoadingStates] = useState<{ [level: number]: boolean }>({});

    // Флаг для отображения алфавитного списка (только на верхнем уровне)
    const [showAlphabeticalList, setShowAlphabeticalList] = useState(true);

    // Загружаем основные категории
    const { data: topLevelCategories = [], isLoading: isTopLevelLoading } = useQuery({
        queryKey: ['procedureCategories'],
        queryFn: ProceduresAPI.getTopLevelCategories,
    });

    // Функция для установки активной категории на указанном уровне
    const setActiveCategoryAtLevel = (level: number, categoryId: number) => {
        setActiveCategories(prev => {
            const newState = { ...prev, [level]: categoryId };

            // Очищаем все более глубокие уровни
            Object.keys(prev).forEach(key => {
                if (parseInt(key) > level) {
                    delete newState[parseInt(key)];
                }
            });

            return newState;
        });

        // Показываем алфавитный список только если выбрана категория верхнего уровня
        setShowAlphabeticalList(level === 0);
    };

    // Загрузка данных для категории на каждом уровне
    useEffect(() => {
        const loadCategoryDataForLevel = async (level: number) => {
            const categoryId = activeCategories[level];

            if (!categoryId || categoryId === -1) {
                return;
            }

            // Устанавливаем состояние загрузки для этого уровня
            setLoadingStates(prev => ({ ...prev, [level]: true }));

            try {
                const data = await ProceduresAPI.getCategoryDetails(categoryId);
                setLoadedCategories(prev => ({
                    ...prev,
                    [categoryId]: data
                }));
            } catch (error) {
                console.error(`Error loading data for category ${categoryId}:`, error);
            } finally {
                // Завершаем состояние загрузки
                setLoadingStates(prev => ({ ...prev, [level]: false }));
            }
        };

        // Загружаем данные для всех активных категорий
        Object.keys(activeCategories).forEach(level => {
            const categoryId = activeCategories[parseInt(level)];
            if (categoryId && categoryId !== -1 && !loadedCategories[categoryId]) {
                loadCategoryDataForLevel(parseInt(level));
            }
        });
    }, [activeCategories, loadedCategories]);

    // Обработчик для верхнего уровня категорий
    const handleTopLevelClick = (id: number) => {
        setActiveCategoryAtLevel(0, id);
    };

    // Обработчик для любого другого уровня
    const handleCategoryClick = (level: number, id: number) => {
        setActiveCategoryAtLevel(level, id);
    };

    // Генерация уникального ключа для элемента
    const generateUniqueKey = (prefix: string, id: number | string, suffix?: string) => {
        return `${prefix}-${id}-${suffix || Math.random().toString(36).substring(2, 7)}`;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Основная навигация по категориям верхнего уровня */}
            {isTopLevelLoading ? (
                <CategoryTabsSkeleton level={0} />
            ) : (
                <CategoryTabs
                    items={[
                        ...topLevelCategories.map(cat => ({
                            id: cat.procedure_category_id,
                            title: cat.procedure_category_title
                        })),
                        { id: -1, title: 'Анализы' }
                    ]}
                    activeId={activeCategories[0] || null}
                    onSelect={handleTopLevelClick}
                    level={0}
                />
            )}

            <div className="flex gap-4 items-center my-6">
                <div className="flex-1 max-w-xl">
                    <SearchBar />
                </div>
                <Button className="bg-green-500 hover:bg-green-600 text-white whitespace-nowrap">
                    Записаться онлайн
                </Button>
            </div>

            {/* Отображение категорий и их содержимого уровень за уровнем */}
            {activeCategories[0] === -1 ? (
                <AnalysisSection />
            ) : (
                <>
                    {/* Рендерим каждый активный уровень и его дочерние категории */}
                    {Object.keys(activeCategories)
                        .map(levelStr => parseInt(levelStr))
                        .sort((a, b) => a - b)
                        .map(level => {
                            const categoryId = activeCategories[level];
                            if (!categoryId || categoryId === -1) return null;

                            // Если данные для этой категории загружаются, показываем скелетон
                            if (loadingStates[level]) {
                                return (
                                    <div key={generateUniqueKey('loading', level)}>
                                        <CategoryTabsSkeleton level={level + 1} />
                                        <ProceduresSkeleton />
                                    </div>
                                );
                            }

                            const categoryData = loadedCategories[categoryId];
                            if (!categoryData) return null;

                            // Отображаем дочерние категории текущего уровня (если есть)
                            const hasChildColumns = categoryData.child_procedure_categories_columns &&
                                categoryData.child_procedure_categories_columns.length > 0;

                            return (
                                <div key={generateUniqueKey('level', level, `cat-${categoryId}`)}>
                                    {/* Дочерние категории в виде табов */}
                                    {hasChildColumns && (
                                        <CategoryTabs
                                            items={categoryData.child_procedure_categories_columns.map(column => ({
                                                id: column.procedure_category_id,
                                                title: column.procedure_category_title
                                            }))}
                                            activeId={activeCategories[level + 1] || null}
                                            onSelect={(id) => handleCategoryClick(level + 1, id)}
                                            level={level + 1}
                                        />
                                    )}

                                    {/* Если это самый нижний уровень, отображаем процедуры */}
                                    {(level === Math.max(...Object.keys(activeCategories).map(k => parseInt(k)))) && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                                            {/* Показываем процедуры из активной категории */}
                                            {categoryData.medical_procedures_list?.map(procedure => (
                                                <ProcedureGroup
                                                    key={generateUniqueKey('proc', procedure.medical_procedure_id, procedure.medical_procedure_slug)}
                                                    procedure={procedure}
                                                />
                                            ))}

                                            {/* Показываем процедуры из активной колонки, если она выбрана */}
                                            {activeCategories[level + 1] && categoryData.child_procedure_categories_columns && (
                                                <>
                                                    {categoryData.child_procedure_categories_columns
                                                        .filter(col => col.procedure_category_id === activeCategories[level + 1])
                                                        .flatMap(col => col.procedures || [])
                                                        .map(procedure => (
                                                            <ProcedureGroup
                                                                key={generateUniqueKey('col-proc', procedure.medical_procedure_id, procedure.medical_procedure_slug)}
                                                                procedure={procedure}
                                                            />
                                                        ))
                                                    }
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                    {/* Алфавитный список медицинских услуг (только для верхнего уровня) */}
                    {showAlphabeticalList && activeCategories[0] && loadedCategories[activeCategories[0]] &&
                        loadedCategories[activeCategories[0]].medical_procedures_list &&
                        loadedCategories[activeCategories[0]].medical_procedures_list.length > 0 && (
                            <div className="mt-12">
                                <h2 className="text-xl font-semibold mb-6">Медицинские услуги</h2>
                                <AlphabeticalProcedures
                                    procedures={loadedCategories[activeCategories[0]].medical_procedures_list}
                                />
                            </div>
                        )}
                </>
            )}
        </div>
    );
};
