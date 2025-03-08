'use client';

import { cn } from '@/shared/lib/utils';
import {useServicesStore} from "@/shared/stores/useServicesStore";

export const DiagnosticsNav = () => {
    const { activeSubCategory, setActiveSubCategory } = useServicesStore();

    const subcategories = [
        { id: 'mrt', name: 'МРТ' },
        { id: 'kt', name: 'КТ' },
        { id: 'rentgen', name: 'Рентген' },
        { id: 'functional', name: 'Функциональная диагностика' },
        { id: 'uzi', name: 'УЗИ' },
        { id: 'endoscopy', name: 'Эндоскопия' },
    ];

    return (
        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar border-b mt-6">
            {subcategories.map((subcat) => (
                <button
                    key={subcat.id}
                    onClick={() => setActiveSubCategory(subcat.id)}
                    className={cn(
                        "text-sm whitespace-nowrap pb-4 -mb-4",
                        subcat.id === activeSubCategory
                            ? "text-green-500 border-b-2 border-green-500"
                            : "text-gray-600 hover:text-gray-900"
                    )}
                >
                    {subcat.name}
                </button>
            ))}
        </div>
    );
};
