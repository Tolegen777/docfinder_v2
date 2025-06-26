'use client';

import React, { useState } from 'react';
import { Star, Eye, MapPin, Heart, ChevronDown, Pen, X } from 'lucide-react';
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
import { MedicalCategory, Schedule, Procedure, Consultation } from '@/shared/api/doctorsApi';
import {useRouter} from "next/navigation";
import OnlineAppointmentButton from "@/shared/ui/AppointmentButton/OnlineAppointmentButton";
import {TimeSlot} from "@/shared/api/doctorsApi";
import { NewAppointmentModal } from "@/shared/ui/AppointmentButton/NewAppointmentModal";

// Динамически импортируем DoctorClinicMapContent для предотвращения проблем с SSR
const DoctorClinicMapContent = dynamic(() => import('./DoctorClinicMapContent'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
        <MapPin className="w-8 h-8 text-gray-400" />
    </div>
});

interface DoctorCardProps {
    id: number;
    full_name: string;
    slug: string;
    medical_categories: MedicalCategory[];
    experience_years: number | null;
    works_since: string;
    for_child: boolean;
    review_count: number;
    average_rating: any;
    clinic_today: string;
    clinic_today_address: string;
    schedule_today: Schedule[];
    schedule_tomorrow: Schedule[];
    schedule_day_after_tomorrow: Schedule[];
    procedures?: Procedure[];
    consultations?: Consultation[];
    isPreventNavigation?: boolean;
    main_photo_url?: string;
    fromPage?: string
}

const DoctorCard: React.FC<DoctorCardProps> = ({
                                                   full_name,
                                                   id,
                                                   slug,
                                                   medical_categories,
                                                   experience_years,
                                                   review_count,
                                                   average_rating,
                                                   clinic_today,
                                                   clinic_today_address,
                                                   schedule_today,
                                                   schedule_tomorrow,
                                                   schedule_day_after_tomorrow,
                                                   procedures = [],
                                                   consultations = [],
                                                   isPreventNavigation,
                                                   main_photo_url,
                                                   fromPage
                                               }) => {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow' | 'day_after'>('today');
    const [showAllTimes, setShowAllTimes] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);

    // Новые состояния для модалки записи через слот
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [preselectedTimeSlot, setPreselectedTimeSlot] = useState<TimeSlot | null>(null);
    const [preselectedDate, setPreselectedDate] = useState<'today' | 'tomorrow' | 'day_after'>('today');

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

    // Обработчик клика по временному слоту
    const handleTimeSlotClick = (hour: any, dateType: 'today' | 'tomorrow' | 'day_after') => {
        const timeSlot: TimeSlot = {
            id: hour.id,
            start_time: hour.start_time,
            end_time: hour.end_time
        };

        setPreselectedTimeSlot(timeSlot);
        setPreselectedDate(dateType);
        setIsAppointmentModalOpen(true);
    };

    // Получаем названия специальностей из medical_categories
    const specialties = medical_categories.map(cat => cat.medical_category_title).join(', ');

    // Сортируем консультации по цене (от меньшей к большей)
    const sortedConsultations = consultations?.slice() || [];
    sortedConsultations.sort((a, b) =>
        (a?.current_price?.final_price || 0) - (b?.current_price?.final_price || 0)
    );

    // Рейтинг из API или 0, если null
    const stars = average_rating || 0;

    // Определяем, есть ли консультации для отображения
    const hasConsultations = sortedConsultations.length > 0;
    // Состояние для отображения всех консультаций
    const [showAllConsultations, setShowAllConsultations] = useState(false);

    const timeSlots: TimeSlot[] = schedule_today.length > 0
        ? schedule_today[0].working_hours.map(hour => ({
            id: hour.id,
            start_time: hour.start_time,
            end_time: hour.end_time
        }))
        : [];

    // Находим максимальную скидку среди всех консультаций для отображения на баннере
    const findMaxDiscount = () => {
        if (!consultations?.length) return 0;
        return Math.max(...consultations.map(c => c?.current_price?.discount || 0));
    };

    const maxDiscount = findMaxDiscount();

    // Обработчик клика по кнопке "На карте"
    const handleMapButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsMapOpen(true);
    };

    // Получаем расписание на сегодня для отображения на карте
    const scheduleForMap = schedule_today;

    const renderStars = (count: number) => {
        return Array(5).fill(0).map((_, index) => (
            <Star
                key={index}
                className={`w-5 h-5 ${index < count ? 'fill-[#FB923C] stroke-[#FB923C]' : 'stroke-[#FB923C] fill-white'}`}
            />
        ));
    };

    const renderWorkingHours = (schedule: Schedule[]) => {
        if (!schedule.length) return <p className="text-gray-500">Нет доступного времени</p>;

        const allHours = schedule[0]?.working_hours || [];
        const displayHours = showAllTimes ? allHours : allHours.slice(0, 12);

        return (
            <div className="space-y-5">
                <div className="grid grid-cols-4 gap-5">
                    {displayHours.map(({ id, start_time, end_time }) => (
                        <button
                            key={id}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleTimeSlotClick({ id, start_time, end_time }, selectedDate);
                            }}
                            className="px-5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg hover:border-[#16A34A] hover:bg-[#F0FDF4] transition-colors bg-white cursor-pointer"
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

            <OnlineAppointmentButton
                doctorId={id}
                doctorName={full_name}
                doctorPhoto={main_photo_url}
                procedureId={consultations?.length > 0 ? consultations[0].medical_procedure_id : undefined}
                procedureName={consultations?.length > 0 ? consultations[0].title : undefined}
                schedule_today={schedule_today}
                schedule_tomorrow={schedule_tomorrow}
                schedule_day_after_tomorrow={schedule_day_after_tomorrow}
                procedures={procedures}
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
                buttonText="Записаться онлайн"
            />
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
                    if (fromPage === 'speciality') {
                        router.push(`/doctor/${slug}`)
                    } else {
                        router.push(`doctor/${slug}`)
                    }
                }
            }}>
                <h4 className="h4-20-28-600 my-5 md:hidden">{full_name}</h4>
                <div className="md:hidden mb-4">
                    {experience_years && <p className="p-14-18-400 mb-2">
                        Стаж {experience_years} лет
                    </p>}
                    <div className="flex flex-wrap gap-2">
                        {medical_categories.map((category) => (
                            <span
                                key={category.medical_category_id}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"
                            >
                                {category.medical_category_title}
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
                                {review_count} отзывов
                            </p>
                            <div className="flex space-x-0.5">
                                {renderStars(Math.round(stars))}
                            </div>
                            {maxDiscount > 0 && (
                                <DiscountBanner className="hidden md:flex flex-wrap max-w-40">
                                    Скидка <span className="text-green-600 font-semibold">{maxDiscount}%</span> на первый прием
                                </DiscountBanner>
                            )}
                        </div>
                    </div>
                    {maxDiscount > 0 && (
                        <DiscountBanner className="md:hidden">
                            Скидка <span className="text-green-600 font-semibold">{maxDiscount}%</span> на первый прием
                        </DiscountBanner>
                    )}

                    {/* Middle Column - Main Info */}
                    <div className="flex-1 space-y-5">
                        <h4 className="h4-20-28-600 my-5 hidden md:block">{full_name}</h4>
                        <div className="hidden md:block">
                            {experience_years && <p className="p-14-18-400 mb-2">
                                Стаж {experience_years} лет
                            </p>}
                            <div className="flex flex-wrap gap-2">
                                {medical_categories.map((category) => (
                                    <span
                                        key={category.medical_category_id}
                                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"
                                    >
                                        {category.medical_category_title}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2.5 md:max-w-[370px]">
                            {hasConsultations ? (
                                <div className="bg-[#F0FDF4] rounded-lg p-4">
                                    <h3 className="text-base font-medium text-gray-800 mb-3">Доступные консультации:</h3>
                                    <div className="space-y-2.5">
                                        {sortedConsultations.slice(0, showAllConsultations ? sortedConsultations.length : 3).map((consultation) => (
                                            <div
                                                key={consultation.medical_procedure_id}
                                                className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-b-0 last:pb-0"
                                            >
                                                <span className="text-sm flex-1">{consultation.title}</span>
                                                <div className="text-sm">
                                                    <span className="text-[#16A34A]">{consultation?.current_price?.final_price?.toFixed(0)} тг</span>
                                                    {consultation?.current_price?.discount > 0 && (
                                                        <span className="line-through ml-1 text-[#94A3B8]">{consultation.current_price.default_price?.toFixed(0)} тг</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {sortedConsultations.length > 3 && (
                                            <button
                                                className="flex items-center text-[#16A34A] text-sm mt-2 hover:underline"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setShowAllConsultations(!showAllConsultations)
                                                }}
                                            >
                                                {showAllConsultations ? (
                                                    <span>Скрыть</span>
                                                ) : (
                                                    <span>Показать все {sortedConsultations.length} консультаций</span>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#F0FDF4] rounded-lg p-4">
                                    <p className="text-sm text-gray-500">Информация о консультациях недоступна</p>
                                </div>
                            )}
                        </div>

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
                                            doctorName={full_name}
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

            {/* Модалка записи через клик по слоту */}
            <NewAppointmentModal
                isOpen={isAppointmentModalOpen}
                onClose={() => {
                    setIsAppointmentModalOpen(false);
                    setPreselectedTimeSlot(null);
                    setPreselectedDate('today');
                }}
                doctorId={id}
                doctorName={full_name}
                doctorPhoto={main_photo_url}
                procedureId={consultations?.length > 0 ? consultations[0].medical_procedure_id : undefined}
                procedureName={consultations?.length > 0 ? consultations[0].title : undefined}
                schedule_today={schedule_today}
                schedule_tomorrow={schedule_tomorrow}
                schedule_day_after_tomorrow={schedule_day_after_tomorrow}
                availableProcedures={procedures}
                // Передаем предзаполненные данные
                preselectedTimeSlot={preselectedTimeSlot}
                preselectedDate={preselectedDate}
            />
        </>
    );
};

export default DoctorCard;
