import React from 'react';

export const WeeklySchedule = () => {
    const scheduleData = [
        { day: 'Пн', hours: '09:00-18:00', isWeekend: false },
        { day: 'Вторник', hours: '09:00-18:00', isWeekend: false },
        { day: 'Среда', hours: '09:00-18:00', isWeekend: false },
        { day: 'Четверг', hours: '09:00-18:00', isWeekend: false },
        { day: 'Пятница', hours: '09:00-18:00', isWeekend: false },
        { day: 'Суббота', hours: 'Выходной', isWeekend: true },
        { day: 'Воскресенье', hours: 'Выходной', isWeekend: true },
    ];

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-medium mb-4">График работы</h2>
            <div className="space-y-2">
                {scheduleData.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center"
                    >
                        <div className={`text-base ${item.isWeekend ? 'text-gray-400' : 'text-gray-800'}`}>
                            {item.day}
                        </div>
                        <div className={`text-base ${item.isWeekend ? 'text-gray-400' : 'text-green-600'}`}>
                            {item.hours}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
