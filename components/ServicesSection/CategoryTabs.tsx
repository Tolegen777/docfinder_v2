'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';

interface CategoryTabsProps {
    items: {
        id: number;
        title: string;
    }[];
    activeId?: number | null;
    onSelect: (id: number) => void;
    level?: number;
}

/**
 * Компонент для отображения табов категорий с визуальным разделением между уровнями
 */
export const CategoryTabs: React.FC<CategoryTabsProps> = ({
                                                              items,
                                                              activeId,
                                                              onSelect,
                                                              level = 0
                                                          }) => {
    // Визуальное оформление в зависимости от уровня
    const getLevelStyles = () => {
        switch (level) {
            case 0: // Верхний уровень - зеленый индикатор снизу
                return {
                    container: "border-b pb-4",
                    tab: "pb-2",
                    activeIndicator: "border-b-2 border-green-500 text-green-500",
                    inactiveText: "text-gray-600 hover:text-gray-900"
                };
            case 1: // Второй уровень - линия сверху и снизу
                return {
                    container: "border rounded-md border-gray-200 py-4 my-4 bg-gray-50",
                    tab: "px-3 py-1",
                    activeIndicator: "text-green-500 font-medium",
                    inactiveText: "text-gray-600 hover:text-gray-900"
                };
            default: // Третий и далее уровни - темно-серый фон
                return {
                    container: "border rounded-md py-4 mb-6 bg-gray-100",
                    tab: "px-3 py-1",
                    activeIndicator: "text-green-500 font-medium",
                    inactiveText: "text-gray-600 hover:text-gray-900"
                };
        }
    };

    // Генерация уникального ключа для таба
    const generateTabKey = (id: number, title: string) => {
        return `tab-${level}-${id}-${title.replace(/\s+/g, '').toLowerCase()}-${Math.random().toString(36).substring(2, 5)}`;
    };

    const styles = getLevelStyles();

    return (
        <div className={cn("flex flex-wrap gap-x-6 gap-y-4", styles.container)}>
            {items.map((item) => (
                <button
                    key={generateTabKey(item.id, item.title)}
                    onClick={() => onSelect(item.id)}
                    className={cn(
                        "text-sm whitespace-nowrap",
                        styles.tab,
                        activeId === item.id
                            ? styles.activeIndicator
                            : styles.inactiveText
                    )}
                >
                    {item.title}
                </button>
            ))}
        </div>
    );
};
