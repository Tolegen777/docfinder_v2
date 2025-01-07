import React from "react";
import Link from "next/link";

interface Service {
    name: string;
    count?: string;
    href: string;
}

interface ServiceGroup {
    title: string;
    items: Service[];
}

const ServiceGroup = ({ title, items, category }: {
    title: string;
    items: Service[];
    category: string;
}) => (
    <div className="space-y-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="space-y-2">
            {items.map((service) => (
                <Link
                    key={service.name}
                    href={service.href}
                    className="block text-blue-500 hover:text-blue-600"
                >
                    {service.name}
                </Link>
            ))}
        </div>
        <Link
            href={`/services/${category}/${title.toLowerCase().replace(/\s+/g, '-')}`}
            className="inline-flex items-center px-4 py-2 text-green-500 border border-green-500 rounded-md hover:bg-green-50"
        >
            Показать еще
        </Link>
    </div>
);

// Компонент категории с кнопкой "Показать еще"
export const CategoryServices = ({ services, category }: {
    services: ServiceGroup[];
    category: string;
}) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((group) => (
            <ServiceGroup
                key={group.title}
                title={group.title}
                items={group.items}
                category={category}
            />
        ))}
    </div>
);
