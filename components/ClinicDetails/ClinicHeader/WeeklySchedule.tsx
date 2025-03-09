import React from 'react';

interface WorkHour {
    day: string;
    time: string;
}

interface WeeklyScheduleProps {
    workHours?: WorkHour[];
}

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ workHours }) => {
    // Перевод дней недели с английского на русский
    const translateWeekday = (weekday: string): string => {
        const translations: {[key: string]: string} = {
            'MONDAY': 'Понедельник',
            'TUESDAY': 'Вторник',
            'WEDNESDAY': 'Среда',
            'THURSDAY': 'Четверг',
            'FRIDAY': 'Пятница',
            'SATURDAY': 'Суббота',
            'SUNDAY': 'Воскресенье',
        };

        return translations[weekday] || weekday;
    };

    const scheduleData = workHours?.map(hour => ({
            day: translateWeekday(hour.day),
            time: hour.time
        }));

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-medium mb-4">График работы</h2>
            <div className="space-y-2">
                {scheduleData?.map((item, index) => {
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
