// components/ClinicDetails/ClinicDoctorsList/ClinicDoctorCard.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, Eye, Heart, MapPin, Star } from 'lucide-react';
import { Card } from '@/components/shadcn/card';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/shadcn/sheet";
import Image from "next/image";
import doctorCard from '@/shared/assets/images/doctorPlaceholder.jpeg';
import { Button } from "@/components/shadcn/button";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Schedule, RatingInfo, MinConsultation } from '@/shared/api/clinicDoctorsApi';

interface ClinicDoctorCardProps {
    id: number;
    full_name: string;
    experience: number;
    categories: string[];
    specialities: string[];
    rating_info: RatingInfo;
    schedule: Schedule[];
    main_photo_url?: string;
    min_consultation?: MinConsultation;
}

const ClinicDoctorCard: React.FC<ClinicDoctorCardProps> = ({
                                                               full_name,
                                                               id,
                                                               experience,
                                                               categories,
                                                               specialities,
                                                               rating_info,
                                                               schedule,
                                                               main_photo_url,
                                                               min_consultation
                                                           }) => {
    const [selectedDate, setSelectedDate] = useState<number>(0);
    const [showAllTimes, setShowAllTimes] = useState(false);

    // Группируем расписание по датам
    const scheduleByDate = React.useMemo(() => {
        return schedule || [];
    }, [schedule]);

    // Форматируем дату для отображения
    const formatScheduleDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'd MMM', { locale: ru });
    };

    const renderStars = (count: number) => {
        return Array(5).fill(0).map((_, index) => (
            <Star
                key={index}
                className={`w-5 h-5 ${index < count ? 'fill-[#FB923C] stroke-[#FB923C]' : 'stroke-[#FB923C] fill-white'}`}
            />
        ));
    };

    const renderWorkingHours = (selectedSchedule: Schedule | undefined) => {
        if (!selectedSchedule) return <p className="text-gray-500">Нет доступного времени</p>;

        const allHours = selectedSchedule.working_hours || [];
        const displayHours = showAllTimes ? allHours : allHours.slice(0, 12);

        return (
            <div className="space-y-5">
                <div className="grid grid-cols-4 gap-5">
                    {displayHours.map((time, index) => (
                        <button
                            key={index}
                            className="px-5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg hover:border-[#16A34A] transition-colors bg-white"
                        >
                            {time}
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
            <div className="flex border-b border-[#CBD5E1] overflow-x-auto">
                {scheduleByDate.map((schedule, index) => (
                    <button
                        key={schedule.date}
                        onClick={() => setSelectedDate(index)}
                        className={`px-5 py-2.5 ${
                            selectedDate === index
                                ? 'text-[#16A34A] font-semibold border-b-2 border-[#16A34A]'
                                : 'text-[#212121]'
                        } whitespace-nowrap`}
                    >
                        {formatScheduleDate(schedule.date)}
                    </button>
                ))}
            </div>

            {renderWorkingHours(scheduleByDate[selectedDate])}
        </>
    );

    const MobileSchedule = () => (
        <Sheet>
            <SheetTrigger asChild>
                <button
                    className="w-full flex items-center justify-center gap-2.5 px-5 py-2.5 border border-[#16A34A] rounded-lg bg-white">
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

    // Получаем информацию о кабинете для выбранной даты
    const selectedRoomInfo = scheduleByDate[selectedDate]
        ? `${scheduleByDate[selectedDate].room} ${scheduleByDate[selectedDate].floor_number ? ', ' + scheduleByDate[selectedDate].floor_number + 'Этаж': '' }`
        : '';

    return (
        <Card className="w-full max-w-[1181px] p-4 md:p-5 bg-white">
            <h4 className="h4-20-28-600 my-5 md:hidden">{full_name}</h4>
            <div className="md:hidden mb-4">
                <p className="p-14-18-400 mb-2">
                    Стаж {experience} лет
                </p>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"
                        >
                            {category}
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-5">
                {/* Left Column - Photo and Rating */}
                <div className="flex flex-row md:flex-col items-center space-y-2.5">
                    <div className="relative">
                        <Image src={main_photo_url ?? doctorCard} width={104} height={104} alt={full_name} className="rounded-full"/>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-sm text-[#4B81EC] hover:underline cursor-pointer">
                            {rating_info.total_reviews} отзывов
                        </p>
                        <div className="flex space-x-0.5">
                            {renderStars(Math.round(rating_info.average_rating))}
                        </div>
                    </div>
                </div>

                {/* Middle Column - Main Info */}
                <div className="flex-1 space-y-5">
                    <h4 className="h4-20-28-600 my-5 hidden md:block">{full_name}</h4>
                    <div className="hidden md:block">
                        <p className="p-14-18-400 mb-2">
                            Стаж {experience} лет
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2.5 md:max-w-[370px]">
                        <div className="bg-[#F0FDF4] rounded-lg p-4">
                            <h3 className="text-base font-medium text-gray-800 mb-3">Специализации:</h3>
                            <div className="space-y-2.5">
                                {specialities.map((speciality, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-b-0 last:pb-0"
                                    >
                                        <span className="text-sm">{speciality}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Показываем минимальную консультацию, если есть */}
                            {min_consultation && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">{min_consultation.medical_procedure_title}</span>
                                        <div className="text-sm">
                                            <span className="text-[#16A34A] font-semibold">{min_consultation.final_price} тг</span>
                                            {min_consultation.discount > 0 && (
                                                <span className="line-through ml-1 text-[#94A3B8]">{min_consultation.default_price} тг</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5">
                            <MapPin className="w-5 h-5 text-[#16A34A]"/>
                            <span className="text-base text-[#4B81EC]">
                                {selectedRoomInfo}
                            </span>
                        </div>
                    </div>

                    {/*<div className="flex flex-wrap gap-2.5 flex-col md:flex-row">*/}
                    {/*    <Button variant="outline">*/}
                    {/*        <Heart className="w-5 h-5 text-[#16A34A]"/>*/}
                    {/*        <span className="text-base font-semibold text-[#16A34A]">В избранное</span>*/}
                    {/*    </Button>*/}
                    {/*</div>*/}
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

export default ClinicDoctorCard;
