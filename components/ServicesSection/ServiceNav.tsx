'use client';

import { cn } from '@/shared/lib/utils';
import {useServicesStore} from "@/shared/stores/useServicesStore";

export const ServiceNav = () => {
    const { activeCategory, setActiveCategory } = useServicesStore();

    const categories = [
        { id: 'diagnostics', name: 'Диагностика' },
        { id: 'analysis', name: 'Анализы' },
        { id: 'consultations', name: 'Консультации' },
        { id: 'specialty-services', name: 'Услуги по специальностям' },
        { id: 'procedure-room', name: 'Процедурный кабинет' },
    ];

    return (
        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar border-b">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                        "text-sm whitespace-nowrap pb-4 -mb-4",
                        category.id === activeCategory
                            ? "text-green-500 border-b-2 border-green-500"
                            : "text-gray-600 hover:text-gray-900"
                    )}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
};
