import React from 'react';

type Specialist = {
    id: string;
    name: string;
};

const specialists: Specialist[] = [
    { id: '1', name: 'Аллерголог' },
    { id: '2', name: 'Андролог' },
    { id: '3', name: 'Анестезиолог' },
    { id: '4', name: 'Аритмолог' },
    { id: '5', name: 'Венеролог' },
    { id: '6', name: 'Вертебролог' },
    { id: '7', name: 'Гастроэнтеролог' },
    { id: '8', name: 'Гематолог' },
    { id: '9', name: 'Генетик' },
    { id: '10', name: 'Гепатолог' },
    { id: '11', name: 'Гинеколог' },
    { id: '12', name: 'Гирудотерапевт' },
    { id: '13', name: 'Дерматолог' },
    { id: '14', name: 'Диетолог' },
    { id: '15', name: 'Иммунолог' },
    { id: '16', name: 'Инфекционист' },
    { id: '17', name: 'Кардиолог' },
    { id: '18', name: 'Кардиохирург' },
    { id: '19', name: 'Косметолог' },
    { id: '20', name: 'Логопед' },
    { id: '21', name: 'Лор (отоларинголог)' },
    { id: '22', name: 'Маммолог' },
    { id: '23', name: 'Мануальный терапевт' },
    { id: '24', name: 'Миколог' },
    { id: '25', name: 'Невропатолог (Невролог)' },
];

const SpecialistsSelection = () => {
    return (
        <div className="flex flex-wrap gap-2 max-w-4xl">
            {specialists.map((specialist) => (
                <button
                    key={specialist.id}
                    className="px-4 py-2 rounded-full bg-white hover:bg-gray-50
                   border border-gray-200 text-gray-700 text-sm
                   transition-colors duration-200 ease-in-out"
                >
                    {specialist.name}
                </button>
            ))}
            <button
                className="px-4 py-2 rounded-full bg-white hover:bg-gray-50
                 border border-gray-200 text-emerald-600 text-sm
                 transition-colors duration-200 ease-in-out"
            >
                Ещё...
            </button>
        </div>
    );
};

export default SpecialistsSelection;
