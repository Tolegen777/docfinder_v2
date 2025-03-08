'use client'
import React from 'react';
import { MaxWidthLayout } from "@/shared/ui/MaxWidthLayout";

import { ClinicBreadcrumbs } from './ClinicBreadcrumbs';
import { ClinicCarousel } from './ClinicCarousel';
import { ClinicMap } from './ClinicMap';
import { ClinicInfoBlock } from './ClinicInfoBlock';

// Импорт изображений
import clininc1Img from '../../../shared/assets/images/img.png';
import clininc2Img from '../../../shared/assets/images/img.png';
import {AboutSection} from "@/components/ClinicDetails/AboutSection/AboutSection";

// Данные клиники - в реальном приложении должны быть получены из API/props
const clinicData = {
    id: 1,
    name: 'Эмирмед на Манаса 59',
    address: 'улица Абдуллы Розыбакиева, 37В, Алматы',
    metro: 'СарыАрка - 5 мин пешком',
    busStop: 'Оптовка - 5 мин пешком',
    description: '«Эмирмед» — сеть круглосуточных медицинских центров в Алматы, где каждому пациенту доступно обширное количество медицинских услуг, без праздников и выходных. Наша клиника оснащена самым новым оборудованием для проведений точной и быстрой диагностики причин заболеваний, а так же имеет самый...',
    images: [clininc1Img, clininc2Img],
    workHours: [
        {day: 'Пн', time: '09:00-18:00'},
        {day: 'Вторник', time: '09:00-18:00'},
        {day: 'Среда', time: '09:00-18:00'},
        {day: 'Четверг', time: '09:00-18:00'},
        {day: 'Пятница', time: '09:00-18:00'},
        {day: 'Суббота', time: 'Выходной'},
        {day: 'Воскресенье', time: 'Выходной'}
    ],
    features: [
        { id: 'hosp', icon: '🏥', title: 'Есть стационар' },
        { id: 'tests', icon: '🧪', title: 'Прием анализов' },
        { id: 'sick-list', icon: '📋', title: 'Оформляем больничный' },
        { id: 'cards', icon: '💳', title: 'Принимаем Карточки' },
        { id: 'children', icon: '👶', title: 'Принимаем детей' },
        { id: 'wifi', icon: '📶', title: 'Бесплатный Wi-Fi' },
        { id: 'diagnostics', icon: '🔬', title: 'Проводим диагностику' },
        { id: 'parking', icon: '🅿️', title: 'Есть парковка' },
        { id: 'playground', icon: '🎮', title: 'Детская игровая зона' },
        { id: 'pharmacy', icon: '💊', title: 'Аптека на территории' },
        { id: '24h', icon: '⏰', title: 'Круглосуточно' }
    ]
};

interface ClinicHeaderProps {
    clinicId?: number; // Можно использовать для загрузки данных клиники по ID
}

export const ClinicHeader: React.FC<ClinicHeaderProps> = ({ clinicId = 1 }) => {
    // В реальном приложении здесь был бы запрос данных по clinicId

    return (
        <MaxWidthLayout className="py-4">
            {/* Хлебные крошки */}
            <ClinicBreadcrumbs clinicName={clinicData.name} />

            <h1 className="text-2xl font-medium text-emerald-600 mb-4">{clinicData.name}</h1>

            {/* Мобильная версия */}
            <div className="md:hidden space-y-4">
                {/* Блок 1: Карусель */}
                <div className="relative w-full aspect-[4/3]">
                    <ClinicCarousel images={clinicData.images} />
                </div>

                {/* Блок 2: Пустой блок с синим фоном */}
                <div className="rounded-xl">
                    {/* Пустой блок, куда вы добавите свой компонент */}
                    <AboutSection/>
                </div>

                {/* Блок 3: Карта */}
                <div className="relative w-full aspect-video">
                    <ClinicMap clinicId={clinicData.id} />
                </div>

                {/* Блок 4: Дополнительные данные */}
                <ClinicInfoBlock
                    address={clinicData.address}
                    metro={clinicData.metro}
                    busStop={clinicData.busStop}
                    workHours={clinicData.workHours}
                    showFullSchedule
                />
            </div>

            {/* Десктопная версия */}
            <div className="hidden md:grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <div className="grid grid-rows-1 gap-6">
                        {/* Блок 1: Карусель */}
                        <div className="relative h-[400px]">
                            <ClinicCarousel images={clinicData.images} />
                        </div>

                        <div className="rounded-xl">
                            <AboutSection/>
                        </div>
                    </div>
                </div>

                {/* Правая колонка */}
                <div className="space-y-6">
                    {/* Блок 2: Карта */}
                    <div className="relative h-[400px]">
                        <ClinicMap clinicId={clinicData.id} />
                    </div>

                    {/* Блок 4: Дополнительные данные */}
                    <div>
                        <ClinicInfoBlock
                            address={clinicData.address}
                            metro={clinicData.metro}
                            busStop={clinicData.busStop}
                            workHours={clinicData.workHours}
                            showFullSchedule={true} // Более компактный вид для десктопа
                        />
                    </div>
                </div>
            </div>
        </MaxWidthLayout>
    );
};
