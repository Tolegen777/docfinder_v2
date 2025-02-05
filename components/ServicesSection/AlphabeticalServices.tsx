import Link from "next/link";
import React from "react";

const services = {
    'А': [
        { name: 'Абдоминальный хирург', count: '3422', href: '#' },
        { name: 'Акушер', count: '3742', href: '#' },
        { name: 'Акушер-гинеколог', count: '5', href: '#' },
        { name: 'Аллерголог', count: '575', href: '#' },
    ],
    'Б': [
        { name: 'Биохимический анализ', count: '234', href: '#' },
        { name: 'Бронхоскопия', count: '123', href: '#' },
    ],
    'В': [
        { name: 'Вакцинация', count: '2341', href: '#' },
        { name: 'Вегетолог', count: '112', href: '#' },
        { name: 'Венеролог', count: '867', href: '#' },
        { name: 'Вертебролог', count: '345', href: '#' },
        { name: 'Врач МРТ', count: '234', href: '#' },
        { name: 'Врач УЗИ', count: '1567', href: '#' },
    ],
    'Г': [
        { name: 'Гастроэнтеролог', count: '1234', href: '#' },
        { name: 'Гематолог', count: '456', href: '#' },
        { name: 'Генетик', count: '234', href: '#' },
        { name: 'Гепатолог', count: '345', href: '#' },
        { name: 'Гинеколог', count: '2345', href: '#' },
        { name: 'Гирудотерапевт', count: '123', href: '#' },
    ],
    'Д': [
        { name: 'Дерматолог', count: '1567', href: '#' },
        { name: 'Диабетолог', count: '456', href: '#' },
        { name: 'Диагност', count: '789', href: '#' },
        { name: 'Диетолог', count: '678', href: '#' },
    ],
    'Е': [
        { name: 'Естественное родовспоможение', count: '234', href: '#' },
    ],
    'З': [
        { name: 'Забор анализов', count: '3456', href: '#' },
        { name: 'Заболевания печени', count: '567', href: '#' },
        { name: 'Зубной врач', count: '2345', href: '#' },
    ],
    'И': [
        { name: 'Иглорефлексотерапевт', count: '234', href: '#' },
        { name: 'Иммунолог', count: '567', href: '#' },
        { name: 'Инфекционист', count: '789', href: '#' },
    ],
    'К': [
        { name: 'Кардиолог', count: '1678', href: '#' },
        { name: 'Кинезиолог', count: '234', href: '#' },
        { name: 'Колопроктолог', count: '456', href: '#' },
        { name: 'Косметолог', count: '1234', href: '#' },
    ],
    'Л': [
        { name: 'Лабораторная диагностика', count: '2345', href: '#' },
        { name: 'Логопед', count: '567', href: '#' },
        { name: 'Лор', count: '1234', href: '#' },
    ],
    'М': [
        { name: 'Маммолог', count: '678', href: '#' },
        { name: 'Мануальный терапевт', count: '456', href: '#' },
        { name: 'Массажист', count: '2345', href: '#' },
        { name: 'Миколог', count: '234', href: '#' },
    ],
    'Н': [
        { name: 'Нарколог', count: '456', href: '#' },
        { name: 'Невролог', count: '1567', href: '#' },
        { name: 'Нейрохирург', count: '345', href: '#' },
        { name: 'Нефролог', count: '567', href: '#' },
    ],
    'О': [
        { name: 'Онколог', count: '789', href: '#' },
        { name: 'Ортопед', count: '1234', href: '#' },
        { name: 'Остеопат', count: '567', href: '#' },
        { name: 'Офтальмолог', count: '1456', href: '#' },
    ],
    'П': [
        { name: 'Педиатр', count: '2345', href: '#' },
        { name: 'Пластический хирург', count: '456', href: '#' },
        { name: 'Психиатр', count: '789', href: '#' },
        { name: 'Психолог', count: '1567', href: '#' },
        { name: 'Пульмонолог', count: '678', href: '#' },
    ],
    'Р': [
        { name: 'Радиолог', count: '345', href: '#' },
        { name: 'Реабилитолог', count: '567', href: '#' },
        { name: 'Ревматолог', count: '456', href: '#' },
        { name: 'Рентгенолог', count: '789', href: '#' },
    ],
    'С': [
        { name: 'Сексолог', count: '234', href: '#' },
        { name: 'Сердечно-сосудистый хирург', count: '456', href: '#' },
        { name: 'Стоматолог', count: '2345', href: '#' },
        { name: 'Сурдолог', count: '123', href: '#' },
    ],
    'Т': [
        { name: 'Терапевт', count: '3456', href: '#' },
        { name: 'Токсиколог', count: '234', href: '#' },
        { name: 'Травматолог', count: '789', href: '#' },
        { name: 'Трихолог', count: '456', href: '#' },
    ],
    'У': [
        { name: 'Уролог', count: '1234', href: '#' },
        { name: 'УЗИ-специалист', count: '1567', href: '#' },
    ],
    'Ф': [
        { name: 'Физиотерапевт', count: '789', href: '#' },
        { name: 'Флеболог', count: '456', href: '#' },
        { name: 'Фтизиатр', count: '234', href: '#' },
    ],
    'Х': [
        { name: 'Хирург', count: '2345', href: '#' },
        { name: 'Химиотерапевт', count: '345', href: '#' },
    ],
    'Э': [
        { name: 'Эндокринолог', count: '1234', href: '#' },
        { name: 'Эндоскопист', count: '567', href: '#' },
        { name: 'Эпилептолог', count: '234', href: '#' },
    ],
    // Добавьте другие буквы и услуги
};

export const AlphabeticalServices = () => {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-8">
            {Object.entries(services).map(([letter, items]) => (
                <div key={letter} className="space-y-4">
                    <h3 className="h4-20-24-600">{letter}</h3>
                    <div className="space-y-2">
                        {items.map((service) => (
                            <Link
                                key={service.name}
                                href={service.href}
                                className="flex gap-2 group p-14-18-400"
                            >
                <span className="text-blue-500 group-hover:text-blue-600">
                  {service.name}
                </span>
                                {service.count && (
                                    <span className="text-gray-500">{service.count}</span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
