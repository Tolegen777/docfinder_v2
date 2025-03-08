'use client'
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeStatusProps {
    openingHour?: number;
    closingHour?: number;
    workingDays?: number[]; // Массив дней, когда клиника работает (0-вс, 1-пн, ..., 6-сб)
}

export const TimeStatus: React.FC<TimeStatusProps> = ({
                                                          openingHour = 9,
                                                          closingHour = 18,
                                                          workingDays = [1, 2, 3, 4, 5] // По умолчанию Пн-Пт
                                                      }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const dayOfWeek = now.getDay(); // 0 = воскресенье, 1 = понедельник, ...

            // Проверяем, рабочий ли день
            if (workingDays.includes(dayOfWeek)) {
                const closingTime = new Date();
                closingTime.setHours(closingHour, 0, 0, 0);

                // Если уже после закрытия
                if (now > closingTime) {
                    // Находим следующий рабочий день
                    let nextWorkDay = dayOfWeek;
                    do {
                        nextWorkDay = (nextWorkDay + 1) % 7;
                    } while (!workingDays.includes(nextWorkDay));

                    const daysUntilNext = (nextWorkDay - dayOfWeek + 7) % 7;
                    const nextDayText = daysUntilNext === 1 ? 'завтра' : `через ${daysUntilNext} дн.`;

                    setTimeLeft(`Откроется ${nextDayText} в ${openingHour}:00`);
                    return;
                }

                // Расчет оставшегося времени
                const diffMs = closingTime.getTime() - now.getTime();
                const diffMins = Math.floor(diffMs / 60000);

                setTimeLeft(`Закроется через ${diffMins} мин`);
            } else {
                // Находим следующий рабочий день
                let nextWorkDay = dayOfWeek;
                do {
                    nextWorkDay = (nextWorkDay + 1) % 7;
                } while (!workingDays.includes(nextWorkDay));

                const daysUntilNext = (nextWorkDay - dayOfWeek + 7) % 7;
                const nextDayText = daysUntilNext === 1 ? 'завтра' : `через ${daysUntilNext} дн.`;

                setTimeLeft(`Закрыто (выходной). Откроется ${nextDayText}`);
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 60000); // Обновляем каждую минуту

        return () => clearInterval(interval);
    }, [openingHour, closingHour, workingDays]);

    return (
        <div className="flex items-center gap-2 text-red-500">
            <Clock className="w-4 h-4 shrink-0" />
            <p className="text-sm">{timeLeft}</p>
        </div>
    );
};
