'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DateSelectorProps {
    selectedTab: string;
    onTabChange: (tab: string) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ selectedTab, onTabChange }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Форматировать выбранную дату для отображения в инпуте
    const getFormattedDate = () => {
        if (selectedTab === 'today') {
            return `Сегодня, ${format(new Date(), 'd MMMM', { locale: ru })}`;
        } else if (selectedTab === 'tomorrow') {
            return `Завтра, ${format(new Date(new Date().setDate(new Date().getDate() + 1)), 'd MMMM', { locale: ru })}`;
        } else {
            return `Послезавтра, ${format(new Date(new Date().setDate(new Date().getDate() + 2)), 'd MMMM', { locale: ru })}`;
        }
    };

    // Обработчик выбора даты
    const handleSelectDate = (tab: string) => {
        onTabChange(tab);
        setShowDatePicker(false);
    };

    return (
        <div className="grid gap-2">
            <Label htmlFor="appointment-date">Дата</Label>
            <div className="relative">
                <Input
                    id="appointment-date"
                    readOnly
                    value={getFormattedDate()}
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="pr-10 cursor-pointer"
                />
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />

                {showDatePicker && (
                    <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
                        <div className="p-2">
                            <button
                                className={`w-full text-left py-2 px-3 rounded-md ${selectedTab === 'today' ? 'bg-green-50 text-green-600' : 'hover:bg-gray-50'}`}
                                onClick={() => handleSelectDate('today')}
                            >
                                Сегодня, {format(new Date(), 'd MMMM', { locale: ru })}
                            </button>
                            <button
                                className={`w-full text-left py-2 px-3 rounded-md ${selectedTab === 'tomorrow' ? 'bg-green-50 text-green-600' : 'hover:bg-gray-50'}`}
                                onClick={() => handleSelectDate('tomorrow')}
                            >
                                Завтра, {format(new Date(new Date().setDate(new Date().getDate() + 1)), 'd MMMM', { locale: ru })}
                            </button>
                            <button
                                className={`w-full text-left py-2 px-3 rounded-md ${selectedTab === 'day_after' ? 'bg-green-50 text-green-600' : 'hover:bg-gray-50'}`}
                                onClick={() => handleSelectDate('day_after')}
                            >
                                Послезавтра, {format(new Date(new Date().setDate(new Date().getDate() + 2)), 'd MMMM', { locale: ru })}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
