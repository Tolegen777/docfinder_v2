'use client';

import React, { useState } from 'react';
import { Star, Eye, MapPin, Heart, Home, Headphones, Car, ChevronDown, Pen } from 'lucide-react';
import { Card } from '../../shadcn/card';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../../shadcn/sheet";
import Image from "next/image";
import doctorCard from '@/shared/assets/images/doctorCard.png';
import { Breadcrumb } from "@/shared/ui/Breadcrumb";
import { DiscountBanner } from "@/components/DoctorsList/DoctorCard/DiscountBanner";
import { Button } from "@/components/shadcn/button";
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Schedule {
    clinic_title: string;
    clinic_address: string;
    maps_links: {
        yandex: string;
        google: string;
        "2gis": string;
    };
    working_hours: {
        id: number;
        start_time: string;
        end_time: string;
    }[];
}

interface DoctorCardProps {
    id: number;
    full_name: string;
    slug: string;
    medical_categories: { medical_category: number }[];
    experience_years: number;
    clinic_today: string;
    clinic_today_address: string;
    schedule_today: Schedule[];
    schedule_tomorrow: Schedule[];
    schedule_day_after_tomorrow: Schedule[];
}

const DoctorCard: React.FC<DoctorCardProps> = ({
                                                   full_name,
                                                   experience_years,
                                                   clinic_today,
                                                   clinic_today_address,
                                                   schedule_today,
                                                   schedule_tomorrow,
                                                   schedule_day_after_tomorrow
                                               }) => {
    const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow' | 'day_after'>('today');
    const [showAllTimes, setShowAllTimes] = useState(false);

    const getScheduleForDate = (date: 'today' | 'tomorrow' | 'day_after'): Schedule[] => {
        switch (date) {
            case 'today':
                return schedule_today;
            case 'tomorrow':
                return schedule_tomorrow;
            case 'day_after':
                return schedule_day_after_tomorrow;
            default:
                return [];
        }
    };

    const formatScheduleDate = (dateType: 'today' | 'tomorrow' | 'day_after') => {
        const date = new Date();
        switch (dateType) {
            case 'tomorrow':
                date.setDate(date.getDate() + 1);
                break;
            case 'day_after':
                date.setDate(date.getDate() + 2);
                break;
        }
        return format(date, 'd MMM', { locale: ru });
    };

    const renderWorkingHours = (schedule: Schedule[]) => {
        if (!schedule.length) return <p className="text-gray-500">Нет доступного времени</p>;

        const allHours = schedule[0]?.working_hours || [];
        const displayHours = showAllTimes ? allHours : allHours.slice(0, 12);

        return (
            <div className="space-y-5">
                <div className="grid grid-cols-4 gap-5">
                    {displayHours.map(({ id, start_time }) => (
                        <button
                            key={id}
                            className="px-5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg hover:border-[#16A34A] transition-colors bg-white"
                        >
                            {format(new Date(`2000-01-01T${start_time}`), 'HH:mm')}
                        </button>
                    ))}
                </div>

                {allHours.length > 12 && (
                    <button
                        onClick={() => setShowAllTimes(!showAllTimes)}
                        className="w-full flex items-center justify-center gap-2.5 px-5 py-2.5 border border-[#16A34A] rounded-lg bg-white hover:bg-[#F0FDF4] transition-colors"
                    >
                        <Eye className="w-5 h-5 text-[#16A34A]"/>
                        <span className="text-base font-semibold text-[#16A34A]">
                            {showAllTimes ? 'Скрыть' : 'Показать еще'}
                        </span>
                    </button>
                )}
            </div>
        );
    };

    const ScheduleContent = () => (
        <>
            <div className="flex border-b border-[#CBD5E1]">
                {['today', 'tomorrow', 'day_after'].map((date) => (
                    <button
                        key={date}
                        onClick={() => setSelectedDate(date as 'today' | 'tomorrow' | 'day_after')}
                        className={`px-5 py-2.5 ${
                            selectedDate === date
                                ? 'text-[#16A34A] font-semibold border-b-2 border-[#16A34A]'
                                : 'text-[#212121]'
                        }`}
                    >
                        {formatScheduleDate(date as 'today' | 'tomorrow' | 'day_after')}
                    </button>
                ))}
            </div>

            {renderWorkingHours(getScheduleForDate(selectedDate))}

            <Button className="w-full mt-4">
                <Pen className="w-5 h-5 text-white"/>
                <span className="text-base font-semibold">Записаться онлайн</span>
            </Button>
        </>
    );

    const MobileSchedule = () => (
        <Sheet>
            <SheetTrigger asChild>
                <button className="w-full flex items-center justify-center gap-2.5 px-5 py-2.5 border border-[#16A34A] rounded-lg bg-white">
                    <span className="text-base font-semibold text-[#16A34A]">Выберите дату</span>
                    <ChevronDown className="w-5 h-5 text-[#16A34A]"/>
                </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-[20px]">
                <SheetHeader>
                    <SheetTitle className="text-xl font-semibold text-[#212121]">
                        Выберите время приёма для записи онлайн
                    </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-5 overflow-auto">
                    <ScheduleContent/>
                </div>
            </SheetContent>
        </Sheet>
    );

    return (
        <Card className="w-full max-w-[1181px] p-4 md:p-5 bg-white">
            <div className="mb-2 -mt-2">
                <Breadcrumb/>
            </div>
            <h4 className="h4-20-28-600 my-5 md:hidden">{full_name}</h4>
            <p className="p-14-18-400 md:hidden mb-4">
                Стаж {experience_years} лет
            </p>
            <div className="flex flex-col lg:flex-row gap-5">
                {/* Left Column - Photo and Rating */}
                <div className="flex flex-row md:flex-col items-center space-y-2.5">
                    <div className="relative">
                        <Image src={doctorCard} width={104} height={104} alt={full_name} className="rounded-full"/>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        {/* Рейтинг и отзывы можно добавить когда будут в API */}
                    </div>
                </div>

                {/* Middle Column - Main Info */}
                <div className="flex-1 space-y-5">
                    <h4 className="h4-20-28-600 my-5 hidden md:block">{full_name}</h4>
                    <p className="p-14-18-400 hidden md:inline">
                        Стаж {experience_years} лет
                    </p>

                    <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5">
                            <MapPin className="w-5 h-5 text-[#16A34A]"/>
                            <span className="text-base text-[#4B81EC] hover:underline cursor-pointer">
                                {clinic_today}
                            </span>
                        </div>
                        <p className="text-sm text-[#94A3B8]">{clinic_today_address}</p>
                    </div>

                    <div className="flex flex-wrap gap-2.5 flex-col md:flex-row">
                        <Button variant="outline">
                            <MapPin className="w-5 h-5 text-[#16A34A]"/>
                            <span className="text-base font-semibold text-[#16A34A]">На карте</span>
                        </Button>
                        <Button variant="outline">
                            <Heart className="w-5 h-5 text-[#16A34A]"/>
                            <span className="text-base font-semibold text-[#16A34A]">В избранное</span>
                        </Button>
                    </div>
                </div>

                {/* Right Column - Appointment */}
                <div className="lg:w-[453px] space-y-5">
                    <h3 className="text-xl md:text-2xl lg:text-[28px] font-semibold leading-tight text-[#212121]">
                        Выберите время приёма для записи онлайн
                    </h3>

                    {/* Desktop Schedule */}
                    <div className="hidden lg:flex lg:flex-col gap-5">
                        <ScheduleContent/>
                    </div>

                    {/* Mobile Schedule */}
                    <div className="lg:hidden">
                        <MobileSchedule/>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default DoctorCard;
