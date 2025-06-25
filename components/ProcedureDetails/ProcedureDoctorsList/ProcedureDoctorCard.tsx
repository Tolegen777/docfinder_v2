'use client';

import React, { useState } from 'react';
import { Star, Eye, MapPin, Heart, ChevronDown, X } from 'lucide-react';
import { Card } from '@/components/shadcn/card';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/shadcn/sheet";
import {
    Dialog,
    DialogContent,
    DialogClose,
} from "@/components/shadcn/dialog";
import Image from "next/image";
import doctorCard from '@/shared/assets/images/doctorPlaceholder.jpeg';
import { DiscountBanner } from "@/components/DoctorsList/DoctorCard/DiscountBanner";
import { Button } from "@/components/shadcn/button";
import dynamic from "next/dynamic";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ProcedureDoctor, WeeklySchedule } from '@/shared/api/procedureDoctorsApi';
import { useRouter } from "next/navigation";

// Динамически импортируем карту
const DoctorClinicMapContent = dynamic(() => import('@/components/DoctorsList/DoctorCard/DoctorClinicMapContent'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
        <MapPin className="w-8 h-8 text-gray-400" />
    </div>
});

interface ProcedureDoctorCardProps {
    doctor: ProcedureDoctor;
    isPreventNavigation?: boolean;
}

const ProcedureDoctorCard: React.FC<ProcedureDoctorCardProps> = ({
                                                                     doctor,
                                                                     isPreventNavigation
                                                                 }) => {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [showAllTimes, setShowAllTimes] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);

    // Получаем первые 3 даты из расписания
    const availableDates = doctor.weekly_schedule.slice(0, 3);

    // Устанавливаем первую доступную дату как выбранную по умолчанию
    React.useEffect(() => {
        if (availableDates.length > 0 && !selectedDate) {
            setSelectedDate(availableDates[0].date);
        }
    }, [availableDates, selectedDate]);

    const getScheduleForDate = (date: string): WeeklySchedule | undefined => {
        return doctor.weekly_schedule.find(schedule => schedule.date === date);
    };

    const formatScheduleDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'd MMM', { locale: ru });
    };

    // Обработчик клика по временному слоту
    const handleTimeSlotClick = (timeSlot: any, date: string) => {
        // Здесь можно добавить логику записи
        console.log('Clicked time slot:', timeSlot, 'for date:', date);
    };

    // Рейтинг из API или 0, если null
    const stars = Math.round(doctor.rating || 0);

    // Определяем, есть ли скидка
    const hasDiscount = doctor.procedure_discount && doctor.procedure_discount > 0;

    // Обработчик клика по кнопке "На карте"
    const handleMapButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsMapOpen(true);
    };

    // Конвертируем расписание для карты (адаптируем под существующий интерфейс)
    const scheduleForMap = doctor.weekly_schedule.map(schedule => ({
        clinic_title: schedule.clinic_title,
        clinic_address: doctor.today_clinic_address,
        clinic_id: schedule.clinic_id.toString(),
        maps_links: doctor.clinic_today_maps_links || {},
        working_hours: schedule.time_slots.map(slot => ({
            id: slot.time_slot_id,
            start_time: slot.start_time,
            end_time: slot.end_time
        }))
    }));

    const renderStars = (count: number) => {
        return Array(5).fill(0).map((_, index) => (
            <Star
                key={index}
                className={`w-5 h-5 ${index < count ? 'fill-[#FB923C] stroke-[#FB923C]' : 'stroke-[#FB923C] fill-white'}`}
            />
        ));
    };

    const renderWorkingHours = (schedule: WeeklySchedule | undefined) => {
        if (!schedule || !schedule.time_slots.length) {
            return <p className="text-gray-500">Нет доступного времени</p>;
        }

        const allSlots = schedule.time_slots;
        const displaySlots = showAllTimes ? allSlots : allSlots.slice(0, 12);

        return (
            <div className="space-y-5">
                <div className="grid grid-cols-4 gap-5">
                    {displaySlots.map((slot) => (
                        <button
                            key={slot.time_slot_id}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleTimeSlotClick(slot, selectedDate);
                            }}
                            className="px-5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg hover:border-[#16A34A] hover:bg-[#F0FDF4] transition-colors bg-white cursor-pointer"
                        >
                            {format(new Date(`2000-01-01T${slot.start_time}`), 'HH:mm')}
                        </button>
                    ))}
                </div>

                {allSlots.length > 12 && (
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
                {availableDates.map((schedule) => (
                    <button
                        key={schedule.date}
                        onClick={() => setSelectedDate(schedule.date)}
                        className={`px-5 py-2.5 ${
                            selectedDate === schedule.date
                                ? 'text-[#16A34A] font-semibold border-b-2 border-[#16A34A]'
                                : 'text-[#212121]'
                        }`}
                    >
                        {formatScheduleDate(schedule.date)}
                    </button>
                ))}
            </div>

            {renderWorkingHours(getScheduleForDate(selectedDate))}

            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                Записаться онлайн
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
        <>
            <Card className={cn('w-full max-w-[1181px] p-4 md:p-5 bg-white', !isPreventNavigation && 'cursor-pointer')} onClick={() => {
                if (!isPreventNavigation) {
                    // Здесь можно добавить навигацию к странице врача
                    console.log('Navigate to doctor:', doctor.id);
                }
            }}>
                <h4 className="h4-20-28-600 my-5 md:hidden">{doctor.full_name}</h4>
                <div className="md:hidden mb-4">
                    {doctor.experience_years && <p className="p-14-18-400 mb-2">
                        Стаж {doctor.experience_years} лет
                    </p>}
                    <div className="flex flex-wrap gap-2">
                        {doctor.categories.map((category, index) => (
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
                            <Image
                                src={doctor.main_photo_url ?? doctorCard}
                                width={104}
                                height={104}
                                alt={doctor.full_name}
                                className="rounded-full"
                            />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-sm text-[#4B81EC] hover:underline cursor-pointer">
                                {doctor.review_count} отзывов
                            </p>
                            <div className="flex space-x-0.5">
                                {renderStars(stars)}
                            </div>
                            {hasDiscount && (
                                <DiscountBanner className="hidden md:flex flex-wrap max-w-40">
                                    Скидка <span className="text-green-600 font-semibold">{doctor.procedure_discount}%</span> на процедуру
                                </DiscountBanner>
                            )}
                        </div>
                    </div>
                    {hasDiscount && (
                        <DiscountBanner className="md:hidden">
                            Скидка <span className="text-green-600 font-semibold">{doctor.procedure_discount}%</span> на процедуру
                        </DiscountBanner>
                    )}

                    {/* Middle Column - Main Info */}
                    <div className="flex-1 space-y-5">
                        <h4 className="h4-20-28-600 my-5 hidden md:block">{doctor.full_name}</h4>
                        <div className="hidden md:block">
                            {doctor.experience_years && <p className="p-14-18-400 mb-2">
                                Стаж {doctor.experience_years} лет
                            </p>}
                            <div className="flex flex-wrap gap-2">
                                {doctor.categories.map((category, index) => (
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
                                <h3 className="text-base font-medium text-gray-800 mb-3">{doctor.procedure_name}:</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Стоимость процедуры</span>
                                    <div className="text-sm">
                                        <span className="text-[#16A34A] font-semibold">
                                            {doctor.final_price?.toFixed(0) || doctor.procedure_price?.toFixed(0)} тг
                                        </span>
                                        {hasDiscount && doctor.procedure_price && (
                                            <span className="line-through ml-1 text-[#94A3B8]">
                                                {doctor.procedure_price.toFixed(0)} тг
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <div className="flex items-center gap-2.5">
                                <MapPin className="w-5 h-5 text-[#16A34A]"/>
                                <span className="text-base text-[#4B81EC] hover:underline cursor-pointer">
                                    {doctor.franchise_title}
                                </span>
                            </div>
                            <p className="text-sm text-[#94A3B8]">{doctor.today_clinic_address}</p>
                        </div>

                        <div className="flex flex-wrap gap-2.5 flex-col md:flex-row">
                            <Button
                                variant="outline"
                                onClick={handleMapButtonClick}
                            >
                                <MapPin className="w-5 h-5 text-[#16A34A]"/>
                                <span className="text-base font-semibold text-[#16A34A]">На карте</span>
                            </Button>

                            {/* Диалог с картой */}
                            <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                                <DialogContent className="max-w-6xl w-[90vw] h-[80vh] p-0" onClick={e => e.stopPropagation()}>
                                    <div className="relative h-full">
                                        <DoctorClinicMapContent
                                            schedule={scheduleForMap}
                                            doctorName={doctor.full_name}
                                        />
                                        <DialogClose className="absolute top-4 right-4 z-[500]" onClick={e => e.stopPropagation()}>
                                            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200">
                                                <X className="w-5 h-5 text-gray-600" />
                                            </button>
                                        </DialogClose>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Button variant="outline">
                                <Heart className="w-5 h-5 text-[#16A34A]"/>
                                <span className="text-base font-semibold text-[#16A34A]">В избранное</span>
                            </Button>
                        </div>
                    </div>

                    {/* Right Column - Appointment */}
                    <div className="lg:w-[453px] space-y-5" onClick={e => e.stopPropagation()}>
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
        </>
    );
};

export default ProcedureDoctorCard;
