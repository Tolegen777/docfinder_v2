import React from 'react';
import { Search, UserX, Calendar, Stethoscope } from 'lucide-react';
import { Button } from '@/components/shadcn/button';

interface EmptyStateProps {
    variant?: 'doctors' | 'search' | 'schedule' | 'general';
    title?: string;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

const EmptyStateVariants = {
    doctors: {
        icon: UserX,
        defaultTitle: 'Врачи не найдены',
        defaultMessage: 'По вашему запросу не найдено ни одного врача. Попробуйте изменить фильтры поиска.',
        defaultAction: 'Сбросить фильтры'
    },
    search: {
        icon: Search,
        defaultTitle: 'Ничего не найдено',
        defaultMessage: 'Попробуйте изменить поисковый запрос или использовать другие ключевые слова.',
        defaultAction: 'Очистить поиск'
    },
    schedule: {
        icon: Calendar,
        defaultTitle: 'Расписание недоступно',
        defaultMessage: 'У данного врача пока нет доступных слотов для записи. Попробуйте выбрать другую дату.',
        defaultAction: 'Выбрать другую дату'
    },
    general: {
        icon: Stethoscope,
        defaultTitle: 'Данные отсутствуют',
        defaultMessage: 'В данный момент информация недоступна. Попробуйте обновить страницу.',
        defaultAction: 'Обновить'
    }
};

export const EmptyState: React.FC<EmptyStateProps> = ({
                                                          variant = 'general',
                                                          title,
                                                          message,
                                                          actionLabel,
                                                          onAction,
                                                          className = ''
                                                      }) => {
    const config = EmptyStateVariants[variant];
    const Icon = config.icon;

    const displayTitle = title || config.defaultTitle;
    const displayMessage = message || config.defaultMessage;
    const displayActionLabel = actionLabel || config.defaultAction;

    return (
        <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
            {/* Иконка */}
            <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-gray-400" />
                </div>
            </div>

            {/* Заголовок */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {displayTitle}
            </h3>

            {/* Описание */}
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
                {displayMessage}
            </p>

            {/* Действие */}
            {onAction && (
                <Button
                    onClick={onAction}
                    variant="outline"
                    className="px-6 py-2"
                >
                    {displayActionLabel}
                </Button>
            )}
        </div>
    );
};

// Конкретные компоненты для удобства
export const EmptyDoctors: React.FC<Omit<EmptyStateProps, 'variant'>> = (props) => (
    <EmptyState variant="doctors" {...props} />
);
