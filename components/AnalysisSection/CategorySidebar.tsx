// components/services/CategorySidebar.tsx
'use client';

import {useServicesStore} from '@/stores/useServicesStore';
import { cn } from '@/shared/lib/utils';

export function CategorySidebar() {
    const { activeAnalysisCategory, setActiveAnalysisCategory } = useServicesStore();

    const categories = [
        { id: 'blood-general', name: 'Общие исследования крови' },
        { id: 'blood-biochem', name: 'Биохимические исследования крови' },
        { id: 'oncomarkers', name: 'Онкомаркеры' },
        { id: 'stool-general', name: 'Общеклинические исследования кала' },
        { id: 'allergy', name: 'Панели аллергенов' },
        { id: 'histology', name: 'Гистологические исследования' },
        { id: 'hormones', name: 'Гормональные исследования крови' },
        { id: 'urine', name: 'Исследования мочи' },
        { id: 'blood-immune', name: 'Иммунологические исследования крови' },
        { id: 'blood-hematology', name: 'Гематологические исследования' },
        { id: 'allergy-tests', name: 'Аллергологические исследования' },
        { id: 'stool', name: 'Исследования кала' },
        { id: 'autoimmune', name: 'Аутоиммунные заболевания' },
        { id: 'sperm', name: 'Исследование спермы' },
        { id: 'genetic', name: 'Генетический анализ' },
        { id: 'blood-infection', name: 'Исследования крови на инфекции' },
    ];

    return (
        <div className="space-y-2 pr-6">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => setActiveAnalysisCategory(category.id)}
                    className={cn(
                        "block w-full text-left py-2 px-4 rounded-lg transition-colors",
                        category.id === activeAnalysisCategory
                            ? "bg-green-50 text-green-600"
                            : "hover:bg-gray-50"
                    )}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}
