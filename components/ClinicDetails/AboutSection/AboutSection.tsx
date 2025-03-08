import React from 'react';
import { Clock } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/shared/ui/shadcn/accordion";
import {MaxWidthLayout} from "@/shared/ui/MaxWidthLayout";

const features = [
    { id: 'parking', label: 'Есть стационар' },
    { id: 'analysis', label: 'Прием анализов' },
    { id: 'forms', label: 'Оформляем больничный' },
    { id: 'kids', label: 'Принимаем детей' },
    { id: 'wifi', label: 'Бесплатный Wi-Fi' },
    { id: 'diagnostic', label: 'Проводим диагностику' },
    { id: 'playground', label: 'Детская игровая зона' },
    { id: 'pharmacy', label: 'Аптека на территории' },
    { id: '24hours', label: 'Круглосуточно' },
];

const specializations = [
    'Андрология', 'Гастроэнтерология', 'Гинекология', 'Дерматология',
    'Косметология', 'ЛОР (отоларингология)', 'Проктология', 'Урология',
    'Флебология', 'Физиотерапия', 'Анализы', 'Общие процедуры', 'Акушерство',
    'Обследования и диагностики'
];

const services = [
    'УЗИ сосудов нижних конечностей',
    'Пневмомассаж барабанной перепонки',
    'Плазмолифтинг голеностопного сустава',
    'Экскреторная урография',
    'Инстилляция мочевого пузыря',
    'Пункция коленного сустава',
    'Удаление инородного тела из мягких тканей',
    'Рентген органов грудной клетки',
];

// Общий компонент аккордеона для мобильной и десктопной версий
const AccordionSection = () => (
    <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="about" className="border-b">
            <AccordionTrigger className="hover:no-underline group">
                <h2 className="text-xl font-medium group-data-[state=open]:text-emerald-600">О клинике</h2>
            </AccordionTrigger>
            <AccordionContent>
                <div className="space-y-4">
                    <p className="text-gray-600">
                        «Эмирмед» — сеть круглосуточных медицинских центров в Алматы, где каждому
                        пациенту доступно обширное количество медицинских услуг, без праздников и
                        выходных. Наша клиника оснащена самым новым оборудованием для проведения
                        точной и быстрой диагностики причин заболеваний, а так же имеет самых...
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {features.map((feature) => (
                            <div key={feature.id} className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-400" />
                                <span className="text-sm text-gray-600">{feature.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="specializations" className="border-b">
            <AccordionTrigger className="hover:no-underline group">
                <h2 className="text-xl font-medium group-data-[state=open]:text-emerald-600">Специализации</h2>
            </AccordionTrigger>
            <AccordionContent>
                <div className="flex flex-wrap gap-2">
                    {specializations.map((spec) => (
                        <button
                            key={spec}
                            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full
                     text-sm text-gray-600 transition-colors"
                        >
                            {spec}
                        </button>
                    ))}
                    <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full
                       text-sm text-emerald-600 transition-colors">
                        Ещё...
                    </button>
                </div>
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="services" className="border-b">
            <AccordionTrigger className="hover:no-underline group">
                <h2 className="text-xl font-medium group-data-[state=open]:text-emerald-600">Услуги</h2>
            </AccordionTrigger>
            <AccordionContent>
                <div className="flex flex-wrap gap-2">
                    {services.map((service) => (
                        <button
                            key={service}
                            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full
                     text-sm text-gray-600 transition-colors"
                        >
                            {service}
                        </button>
                    ))}
                    <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full
                       text-sm text-emerald-600 transition-colors">
                        Ещё...
                    </button>
                </div>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
);

export const AboutSection = () => {
    return (
        <MaxWidthLayout>
            <AccordionSection />
        </MaxWidthLayout>
    );
};
