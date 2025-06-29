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
import { DiscountBanner } from "@/shared/ui/UniversalDoctorsList/DiscountBanner";
import { Button } from "@/components/shadcn/button";
import dynamic from "next/dynamic";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { MedicalCategory, WeeklySchedule, Procedure, Consultation, ScheduleUtils, TimeSlot } from '@/shared/api/doctorsApi';
import { useRouter } from "next/navigation";
import OnlineAppointmentButton from "@/shared/ui/AppointmentButton/OnlineAppointmentButton";
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
    specialities: string[];
    experience_years: number | null;
    review_count: number;
    average_rating: number;
    clinic_today_title?: string;
    clinic_today_address?: string;
    clinic_today_coords?: any;
    clinic_today_maps_links?: any;
    weekly_schedule: WeeklySchedule[];
    procedures: Procedure[];
    consultation: Consultation;
    isPreventNavigation?: boolean;
    main_photo_url?: string;
    fromPage?: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
                                                   full_name,
                                                   id,
                                                   slug,
                                                   medical_categories,
                                                   specialities,
                                                   experience_years,
                                                   review_count,
                                                   average_rating,
                                                   clinic_today_title,
                                                   clinic_today_address,
                                                   clinic_today_coords,
                                                   clinic_today_maps_links,
                                                   weekly_schedule,
                                                   procedures = [],
                                                   consultation,
                                                   isPreventNavigation,
                                                   main_photo_url,
                                                   fromPage
                                               }) => {
    const router = useRouter();

    // Получаем доступные даты (только первые 3 для UI)
    const availableDates = ScheduleUtils.getAvailableDates(weekly_schedule).slice(0, 3);
    const todayDate = ScheduleUtils.getTodayDate();

    const [selectedDate, setSelectedDate] = useState<string>(
        availableDates.length > 0 ? availableDates[0] : todayDate
    );
    const [showAllTimes, setShowAllTimes] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);

    // Новые состояния для модалки записи через слот
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [preselectedTimeSlot, setPreselectedTimeSlot] = useState<TimeSlot | null>(null);

    // Обработчик клика по временному слоту
    const handleTimeSlotClick = (timeSlot: TimeSlot) => {
        setPreselectedTimeSlot(timeSlot);
        setIsAppointmentModalOpen(true);
    };

    // Получаем названия специальностей
    const displaySpecialities = specialities?.length > 0 ? specialities :
        medical_categories?.map(cat => cat?.medical_category_title);

    // Рейтинг из API или 0, если null
    const stars = average_rating || 0;

    // Получаем процедуры с ценами для отображения (только консультация)
    const displayConsultation = consultation ? [consultation] : [];

    // Находим скидку для баннера из консультации
    const findMaxDiscount = () => {
        if (!consultation) return 0;
        return consultation.doctor_procedure_discount || 0;
    };

    const maxDiscount = findMaxDiscount();

    // Обработчик клика по кнопке "На карте"
    const handleMapButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsMapOpen(true);
    };

    const renderStars = (count: number) => {
        return Array(5).fill(0).map((_, index) => (
            <Star
                key={index}
                className={`w-5 h-5 ${index < count ? 'fill-[#FB923C] stroke-[#FB923C]' : 'stroke-[#FB923C] fill-white'}`}
            />
        ));
    };

    const renderWorkingHours = () => {
        const schedule = ScheduleUtils.getScheduleForDate(weekly_schedule, selectedDate);
        if (!schedule) return <p className="text-gray-500">Нет доступного времени</p>;

        const timeSlots = ScheduleUtils.convertToTimeSlots(schedule.working_hours_list);
        const displayHours = showAllTimes ? timeSlots : timeSlots.slice(0, 12);

        return (
            <div className="space-y-5">
                <div className="grid grid-cols-4 gap-5">
                    {displayHours.map((slot) => (
                        <button
                            key={slot.id}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleTimeSlotClick(slot);
                            }}
                            className="px-5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg hover:border-[#16A34A] hover:bg-[#F0FDF4] transition-colors bg-white cursor-pointer"
                        >
                            {format(new Date(`2000-01-01T${slot.start_time}`), 'HH:mm')}
                        </button>
                    ))}
                </div>

                {timeSlots.length > 12 && (
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

    const formatScheduleDate = (date: string) => {
        return format(new Date(date), 'd MMM', { locale: ru });
    };

    const ScheduleContent = () => (
        <>
            <div className="flex border-b border-[#CBD5E1] overflow-x-auto">
                {availableDates.map((date) => (
                    <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`px-5 py-2.5 whitespace-nowrap ${
                            selectedDate === date
                                ? 'text-[#16A34A] font-semibold border-b-2 border-[#16A34A]'
                                : 'text-[#212121]'
                        }`}
                    >
                        {formatScheduleDate(date)}
                    </button>
                ))}
            </div>

            {renderWorkingHours()}

            <OnlineAppointmentButton
                doctorId={id}
                doctorName={full_name}
                doctorPhoto={main_photo_url}
                weeklySchedule={weekly_schedule}
                procedures={procedures}
                consultation={consultation}
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
                        router.push(`/doctor/${slug}`)
                }
            }}>
                <h4 className="h4-20-28-600 my-5 md:hidden">{full_name}</h4>
                <div className="md:hidden mb-4">
                    {experience_years && <p className="p-14-18-400 mb-2">
                        Стаж {experience_years} лет
                    </p>}
                    <div className="flex flex-wrap gap-2">
                        {displaySpecialities.map((speciality, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"
                            >
                                {speciality}
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
                                {displaySpecialities.map((speciality, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700"
                                    >
                                        {speciality}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2.5 md:max-w-[370px]">
                            {displayConsultation.length > 0 ? (
                                <div className="bg-[#F0FDF4] rounded-lg p-4">
                                    <h3 className="text-base font-medium text-gray-800 mb-3">Консультация:</h3>
                                    <div className="space-y-2.5">
                                        {displayConsultation.map((consult, index) => (
                                            <div
                                                key={consult.medical_procedure_id || index}
                                                className="flex justify-between items-center"
                                            >
                                                <span className="text-sm flex-1">{consult.medical_procedure_title}</span>
                                                <div className="text-sm">
                                                    <span className="text-[#16A34A]">{consult?.doctor_procedure_final_price?.toFixed(0)} тг</span>
                                                    {consult?.doctor_procedure_discount > 0 && (
                                                        <span className="line-through ml-1 text-[#94A3B8]">{consult.doctor_procedure_default_price?.toFixed(0)} тг</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#F0FDF4] rounded-lg p-4">
                                    <p className="text-sm text-gray-500">Информация о консультации недоступна</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2.5">
                            <div className="flex items-center gap-2.5">
                                <MapPin className="w-5 h-5 text-[#16A34A]"/>
                                <span className="text-base text-[#4B81EC] hover:underline cursor-pointer">
                                    {clinic_today_title}
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
                                            weeklySchedule={weekly_schedule}
                                            doctorName={full_name}
                                            coords={clinic_today_coords}
                                            mapsLinks={clinic_today_maps_links}
                                        />
                                        <DialogClose className="absolute top-4 right-4 z-[500]" onClick={e => e.stopPropagation()}>
                                            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200">
                                                <X className="w-5 h-5 text-gray-600" />
                                            </button>
                                        </DialogClose>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            {/*<Button variant="outline">*/}
                            {/*    <Heart className="w-5 h-5 text-[#16A34A]"/>*/}
                            {/*    <span className="text-base font-semibold text-[#16A34A]">В избранное</span>*/}
                            {/*</Button>*/}
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
            {isAppointmentModalOpen && <NewAppointmentModal
                isOpen={isAppointmentModalOpen}
                onClose={() => {
                    setIsAppointmentModalOpen(false);
                    setPreselectedTimeSlot(null);
                }}
                doctorId={id}
                doctorName={full_name}
                doctorPhoto={main_photo_url}
                weeklySchedule={weekly_schedule}
                procedures={procedures}
                consultation={consultation}
                preselectedTimeSlot={preselectedTimeSlot}
                preselectedDate={selectedDate}
            />}
        </>
    );
};

export default DoctorCard;
