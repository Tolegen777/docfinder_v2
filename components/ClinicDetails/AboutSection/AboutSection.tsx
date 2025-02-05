import React from 'react';
import { Clock } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../../shadcn/accordion";
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
];

const services = [
    'УЗИ сосудов нижних конечностей',
    'Промывание миндалин',
    'Пневмомассаж барабанной перепонки',
    'Позолоченные коронки полный состав',
    'Экспортация трофеев',
    'Инстилляция мочевого пузыря',
    'Пункция коленного сустава',
    'Удаление инородного тела из мягких тканей',
    'Ремонт органов грудной клетки',
];

// Мобильная версия с аккордеоном
const MobileContent = () => (
    <div className="md:hidden">
        <Accordion type="single" collapsible>
            <AccordionItem value="about" className="border-b">
                <AccordionTrigger className="hover:no-underline">
                    <h2 className="text-xl font-medium">О клинике</h2>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            «Эмирмед» — сеть круглосуточных медицинских центров в Алматы, где каждому
                            пациенту доступно образцовое количество медицинских услуг, без праздников и
                            выходных. Наша клиника оснащена самым новым оборудованием для проведения
                            точной и быстрой диагностики любых заболеваний, а так же имеет самых...
                        </p>
                        <div className="grid grid-cols-2 gap-4">
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
                <AccordionTrigger className="hover:no-underline">
                    <h2 className="text-xl font-medium">Специализации</h2>
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
                <AccordionTrigger className="hover:no-underline">
                    <h2 className="text-xl font-medium">Услуги</h2>
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
    </div>
);

// Десктопная версия
const DesktopContent = () => (
    <div className="hidden md:block space-y-6">
        {/* О клинике */}
        <section className="w-full bg-white rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-medium">О клинике</h2>
            <p className="text-gray-600">
                «Эмирмед» — сеть круглосуточных медицинских центров в Алматы, где каждому
                пациенту доступно образцовое количество медицинских услуг, без праздников и
                выходных. Наша клиника оснащена самым новым оборудованием для проведения
                точной и быстрой диагностики любых заболеваний, а так же имеет самых...
            </p>
            <div className="grid grid-cols-3 gap-4">
                {features.map((feature) => (
                    <div key={feature.id} className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">{feature.label}</span>
                    </div>
                ))}
            </div>
        </section>

        {/* Специализации */}
        <section className="w-full bg-white rounded-xl p-6">
            <h2 className="text-xl font-medium mb-6">Специализации</h2>
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
        </section>

        {/* Услуги */}
        <section className="w-full bg-white rounded-xl p-6">
            <h2 className="text-xl font-medium mb-6">Услуги</h2>
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
        </section>
    </div>
);

const ClinicContent = () => {
    return (
        <MaxWidthLayout>
            <MobileContent />
            <DesktopContent />
        </MaxWidthLayout>
    );
};

export default ClinicContent;
