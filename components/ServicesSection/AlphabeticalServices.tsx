import Link from "next/link";
import React from "react";

export const AlphabeticalServices = () => {
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
        // Добавьте другие буквы и услуги
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
            {Object.entries(services).map(([letter, items]) => (
                <div key={letter} className="space-y-4">
                    <h3 className="text-xl font-semibold">{letter}</h3>
                    <div className="space-y-2">
                        {items.map((service) => (
                            <Link
                                key={service.name}
                                href={service.href}
                                className="flex justify-between group"
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
