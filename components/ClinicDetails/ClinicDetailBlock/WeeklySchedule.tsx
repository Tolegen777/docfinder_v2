import React from 'react';

interface WorkHour {
    day: string;
    time: string;
}

interface WeeklyScheduleProps {
    workHours?: WorkHour[];
}

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ workHours = [] }) => {
    // Перевод дней недели с английского на русский
    const translateWeekday = (weekday: string): string => {
        const translations: {[key: string]: string} = {
            'MONDAY': 'Понедельник',
            'Monday': 'Понедельник',
            'TUESDAY': 'Вторник',
            'Tuesday': 'Вторник',
            'WEDNESDAY': 'Среда',
            'Wednesday': 'Среда',
            'THURSDAY': 'Четверг',
            'Thursday': 'Четверг',
            'FRIDAY': 'Пятница',
            'Friday': 'Пятница',
            'SATURDAY': 'Суббота',
            'Saturday': 'Суббота',
            'SUNDAY': 'Воскресенье',
            'Sunday': 'Воскресенье',
            // Добавляем русские названия для случая, если API возвращает их
            'Понедельник': 'Понедельник',
            'Вторник': 'Вторник',
            'Среда': 'Среда',
            'Четверг': 'Четверг',
            'Пятница': 'Пятница',
            'Суббота': 'Суббота',
            'Воскресенье': 'Воскресенье',
        };

        return translations[weekday] || weekday;
    };

    const scheduleData = workHours.map(hour => ({
        day: translateWeekday(hour.day),
        time: hour.time
    }));

    // Если нет данных о расписании
    if (scheduleData.length === 0) {
        return (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-medium mb-4">График работы</h2>
                <p className="text-gray-500 text-center">Нет данных о расписании работы</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-medium mb-4">График работы</h2>
            <div className="space-y-2">
                {scheduleData.map((item, index) => {
                    const isWeekend = item.time === 'Выходной';

                    return (
                        <div
                            key={index}
                            className="flex justify-between items-center"
                        >
                            <div className={`text-base ${isWeekend ? 'text-gray-400' : 'text-gray-800'}`}>
                                {item.day}
                            </div>
                            <div className={`text-base ${isWeekend ? 'text-gray-400' : 'text-green-600'}`}>
                                {item.time}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
