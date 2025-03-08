// components/ServicesSection/ProceduresSkeleton.tsx
import { Skeleton } from "@/shared/ui/shadcn/skeleton";

export const ProceduresSkeleton = () => {
    // Создаем массив из 6 элементов для имитации загрузки
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-4">
                    {/* Заголовок */}
                    <Skeleton className="h-7 w-4/5" />

                    {/* Описания */}
                    <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-6 w-11/12" />
                        ))}
                    </div>

                    {/* Кнопка */}
                    <Skeleton className="h-9 w-24" />
                </div>
            ))}
        </div>
    );
};
