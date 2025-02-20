'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    // Создаем инстанс QueryClient внутри компонента,
    // чтобы избежать проблем с серверным рендерингом
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Глобальные настройки для всех запросов
                        refetchOnWindowFocus: false, // Отключаем повторный запрос при фокусе окна
                        retry: 1, // Количество повторных попыток при ошибке
                        staleTime: 1000 * 60 * 5, // Данные считаются свежими в течение 5 минут
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
