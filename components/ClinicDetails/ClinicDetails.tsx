import React from 'react';
import Image from 'next/image';
import {
    Car,
    Clock,
    Phone,
    MapPin,
    Wifi,
    Baby,
    Stethoscope,
    Factory,
    ActivitySquare,
    ChevronRight,
} from 'lucide-react';
import clininc1Img from '../../shared/assets/images/img.png'
// import clininc2Img from '../../shared/assets/images/img.png'

const scheduleData = [
    { day: "Понедельник", hours: "08:00-18:00" },
    { day: "Вторник", hours: "08:00-18:00" },
    { day: "Среда", hours: "08:00-18:00" },
    { day: "Четверг", hours: "08:00-18:00" },
    { day: "Пятница", hours: "08:00-18:00" },
    { day: "Суббота", hours: "Выходной" },
    { day: "Воскресенье", hours: "Выходной" },
];

const amenities = [
    { icon: Car, label: "Есть стоянка" },
    { icon: Phone, label: "Прием анализов" },
    { icon: Clock, label: "Работаем допоздна" },
    { icon: Baby, label: "Принимаем детей" },
    { icon: Wifi, label: "Бесплатный Wi-Fi" },
    { icon: Stethoscope, label: "Проводим диагностику" },
    { icon: ActivitySquare, label: "Детская игровая зона" },
    { icon: Factory, label: "Аптека на территории" },
    { icon: Clock, label: "Круглосуточно" },
];

const specializations = [
    "Андрология",
    "Гастроэнтерология",
    "Гинекология",
    "Дерматология",
    "Косметология",
    "ЛОР (отоларингология)",
    "Проктология",
    "Урология",
    "Флебология",
    "Физиотерапия",
    "Анализы",
    "Общие процедуры",
    "Неврология",
];

const services = [
    "Специальная чистка организма",
    "Комплексная проверка организма",
    "Позолоченные зубные протезы",
    "Диагностика кровеного давления",
    "Пункция височного сустава",
    "Полное исследование желчного пузыря",
    "Удаление инородного тела из мягких тканей",
    "Ремонт детских игровой мелочи",
];

const ClinicDetails = () => {
    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
            <div className="space-y-8">
                {/* Главное изображение и название */}
                <div className="space-y-4">
                    <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden">
                        <Image
                            src={clininc1Img}
                            alt="Эмирмед"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h1 className="text-2xl font-medium">Эмирмед на Манаса 59</h1>
                </div>

                {/* О клинике */}
                <section className="bg-white rounded-xl p-6 space-y-6">
                    <h2 className="text-xl font-medium">О клинике</h2>
                    <p className="text-gray-600">
                        «Эмирмед» — сеть круглосуточных медицинских центров в Алматы, где каждому
                        пациенту доступно образцовое комплектом медицинское обслуживание. Наши клиники оснащены самым новым оборудованием
                        для проведения точной и быстрой диагностики любых заболеваний, а так же имеют самых...
                    </p>

                    {/* График работы */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium mb-4">График работы</h3>
                            <div className="space-y-2">
                                {scheduleData.map((item) => (
                                    <div key={item.day} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{item.day}</span>
                                        <span>{item.hours}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Адрес на карте */}
                        <div>
                            <h3 className="font-medium mb-4">Адрес</h3>
                            <div className="flex items-start gap-2 text-sm">
                                <MapPin className="w-4 h-4 mt-1 shrink-0 text-gray-400" />
                                <div className="text-gray-600">
                                    улица Манаса 59, Алматы
                                    <p className="mt-1 text-blue-600 hover:underline cursor-pointer">
                                        Метро: Сарыарка - 5 мин пешком
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Удобства */}
                    <div>
                        <h3 className="font-medium mb-4">Удобства и услуги</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {amenities.map((item) => (
                                <div key={item.label} className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm text-gray-600">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Специализации */}
                <section className="bg-white rounded-xl p-6">
                    <h2 className="text-xl font-medium mb-6">Специализации</h2>
                    <div className="flex flex-wrap gap-2">
                        {specializations.map((spec) => (
                            <button
                                key={spec}
                                className="px-4 py-2 bg-gray-50 hover:bg-gray-100
                         rounded-full text-sm text-gray-600 transition-colors"
                            >
                                {spec}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Услуги */}
                <section className="bg-white rounded-xl p-6">
                    <h2 className="text-xl font-medium mb-6">Услуги</h2>
                    <div className="grid md:grid-cols-2 gap-3">
                        {services.map((service) => (
                            <button
                                key={service}
                                className="flex items-center justify-between p-4 bg-gray-50
                         hover:bg-gray-100 rounded-xl text-sm transition-colors"
                            >
                                <span>{service}</span>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ClinicDetails;
