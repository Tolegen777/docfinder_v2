import React, { useState } from 'react';
import { Heart, MapPin, Calendar, X } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    SheetClose
} from "@/components/shadcn/sheet";
import clinicImg from '@/shared/assets/images/clinic.png';
import dynamic from 'next/dynamic';

// Dynamically import the MapComponent to prevent SSR issues
const MapComponent = dynamic(() => import('../MapPreview/MapComponent'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
        <MapPin className="w-8 h-8 text-gray-400" />
    </div>
});

interface ClinicCardProps {
    name?: string;
    address?: string;
    rating?: {
        stars: number;
        reviewCount: number;
    };
    discount?: {
        percentage: number;
        text: string;
    };
    schedule?: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };
    specialists?: number;
    price?: number;
    timeUntilClose?: number;
    phoneNumber?: string;
    isHideSchedule?: boolean;
}

const ClinicCard: React.FC<ClinicCardProps> = ({
                                                   name = "Эмирмед на Манаса 55",
                                                   address = "Улица Манаса, 55, 1-этаж, 9 филиалов, Бостандыкский район, Алматы, 050057/ A15H7T2",
                                                   rating = {
                                                       stars: 4,
                                                       reviewCount: 467
                                                   },
                                                   discount = {
                                                       percentage: 20,
                                                       text: "на первый прием"
                                                   },
                                                   schedule = {
                                                       monday: "09:00-18:00",
                                                       tuesday: "09:00-18:00",
                                                       wednesday: "09:00-18:00",
                                                       thursday: "09:00-18:00",
                                                       friday: "09:00-18:00",
                                                       saturday: "Выходной",
                                                       sunday: "Выходной"
                                                   },
                                                   specialists = 14,
                                                   price = 25000,
                                                   timeUntilClose = 45,
                                                   phoneNumber = "+7 701 234...",
                                                   isHideSchedule = false
                                               }) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const renderStars = (count: number) => {
        return Array(5).fill(0).map((_, index) => (
            <svg
                key={index}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className={`w-5 h-5 ${index < count ? 'text-orange-400 fill-orange-400' : 'text-orange-400 fill-white'}`}
            >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
            </svg>
        ));
    };

    // Breadcrumb rendering for desktop view
    const renderBreadcrumb = () => (
        <div className="hidden md:flex items-center gap-2 text-sm mb-4">
            <span className="text-gray-500">Услуги</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">Диагностика</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">МРТ</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-700">МРТ головного мозга с контрастом</span>
        </div>
    );

    return (
        <Card className="w-full max-w-full p-4 md:p-6 bg-white relative">
            <div className="relative z-10">
                {/* Breadcrumb - Desktop only */}
                {renderBreadcrumb()}

                {/* Main content */}
                <div className="flex flex-col md:flex-row md:gap-6">
                    {/* Left column - Image and info */}
                    <div className="md:flex-none">
                        {/* Mobile: Clinic name and heart */}
                        <div className="flex justify-between items-center mb-4 md:hidden">
                            <h2 className="text-xl font-semibold">{name}</h2>
                            <Heart className="w-6 h-6 text-green-600 stroke-green-600 fill-none" />
                        </div>

                        {/* Clinic image */}
                        <div className="relative w-full max-w-[160px] h-[160px] mx-auto md:mx-0 mb-4">
                            <Image
                                src={clinicImg}
                                width={160}
                                height={160}
                                alt={name}
                                className="rounded-full"
                            />
                        </div>

                        {/* Mobile: Rating and reviews */}
                        <div className="flex flex-col items-center md:items-start mb-4">
                            <div className="flex space-x-1 mb-1">
                                {renderStars(rating.stars)}
                            </div>
                            <p className="text-sm text-blue-500 hover:underline">
                                {rating.reviewCount} отзывов
                            </p>
                        </div>
                    </div>

                    {/* Middle column - Main info */}
                    <div className="flex-1">
                        {/* Desktop: Clinic name and heart */}
                        <div className="hidden md:flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">{name}</h2>
                            <Heart className="w-6 h-6 text-green-600 stroke-green-600 fill-none" />
                        </div>

                        {/* MRI Service Info - Desktop Only */}
                        <div className="hidden md:block mb-4">
                            <p className="text-gray-800">
                                МРТ головного мозга с контрастом: <span className="text-green-600 font-medium">от {price.toLocaleString()} тенге</span>
                            </p>
                        </div>

                        {/* Discount - Full width on mobile */}
                        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center mb-4">
                            <p>
                                Скидка <span className="text-green-600 font-semibold">{discount.percentage}%</span> {discount.text}
                            </p>
                        </div>

                        {/* Phone button - Full width on mobile */}
                        <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
                            <div className="flex justify-between items-center">
                                <span>{phoneNumber}</span>
                                <span className="text-blue-500">Показать телефоны</span>
                            </div>
                        </div>

                        {/* Specialists */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                                        {/* You can add actual specialist images here */}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-blue-500">{specialists} специалистов</p>
                        </div>

                        {/* Mobile: Closing time notice */}
                        <div className="bg-red-50 text-red-500 rounded-lg p-2 mb-4">
                            <p>Закроется через {timeUntilClose} мин</p>
                        </div>

                        {/* Mobile: Simplified schedule */}
                        <div className="md:hidden mb-4">
                            <p className="mb-1">Пн-Пт {schedule.monday}</p>
                            <p>Сб-Вс {schedule.saturday}</p>
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                            <div>
                                <Link href="#" className="text-blue-500 hover:underline mb-1 block">
                                    Эмирмед на Манаса
                                </Link>
                                <p className="text-sm text-gray-500">{address}</p>
                            </div>
                        </div>

                        {/* Map button - Full width on mobile */}
                        <Button
                            variant="outline"
                            className="w-full md:w-auto border-green-600 text-green-600 hover:bg-green-50 mb-4 relative z-10"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Map button action here
                            }}
                        >
                            <MapPin className="w-5 h-5 mr-2" />
                            На карте
                        </Button>

                        {/* Show Schedule Button - Mobile only */}
                        <div className="relative z-10">
                            <Button
                                variant="outline"
                                className="w-full md:hidden border-green-600 text-green-600 hover:bg-green-50"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsSheetOpen(true);
                                }}
                            >
                                <Calendar className="w-5 h-5 mr-2" />
                                Показать расписание
                            </Button>
                        </div>

                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetContent side="bottom" className="px-6 py-6 rounded-t-xl max-h-[80vh] overflow-y-auto">
                                <SheetHeader className="mb-4">
                                    <SheetTitle>Расписание работы</SheetTitle>
                                    <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Close</span>
                                    </SheetClose>
                                </SheetHeader>

                                <div className="space-y-4">
                                    {/* Closing time notice */}
                                    <div className="bg-red-50 text-red-500 rounded-lg p-2">
                                        <p>Закроется через {timeUntilClose} мин</p>
                                    </div>

                                    {/* Full Schedule in Sheet */}
                                    <div className="space-y-3">
                                        {Object.entries({
                                            "Понедельник": schedule.monday,
                                            "Вторник": schedule.tuesday,
                                            "Среда": schedule.wednesday,
                                            "Четверг": schedule.thursday,
                                            "Пятница": schedule.friday,
                                            "Суббота": schedule.saturday,
                                            "Воскресенье": schedule.sunday
                                        }).map(([day, hours], index) => (
                                            <div key={day} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                                                <span className={`text-sm ${index < 5 ? 'text-green-600' : 'text-gray-600'}`}>{day}</span>
                                                <span className="text-sm font-medium">{hours}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Right column - Desktop only: Map preview and schedule */}
                    {!isHideSchedule && (
                        <div className="hidden md:block md:w-[350px]">
                            {/* Map preview */}
                            <div className="bg-gray-100 rounded-lg h-[200px] mb-4 overflow-hidden">
                                <MapComponent isPreview={true} />
                            </div>

                            {/* Closing time notice */}
                            <div className="bg-red-50 text-red-500 rounded-lg p-2 mb-4">
                                <p>Закроется через {timeUntilClose} мин</p>
                            </div>

                            {/* Weekly schedule */}
                            <div className="space-y-2">
                                {Object.entries({
                                    "Понедельник": schedule.monday,
                                    "Вторник": schedule.tuesday,
                                    "Среда": schedule.wednesday,
                                    "Четверг": schedule.thursday,
                                    "Пятница": schedule.friday,
                                    "Суббота": schedule.saturday,
                                    "Воскресенье": schedule.sunday
                                }).map(([day, hours], index) => (
                                    <div key={day} className="flex justify-between">
                                        <span className={`text-sm ${index < 5 ? 'text-green-600' : 'text-gray-600'}`}>{day}</span>
                                        <span className="text-sm font-medium">{hours}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Add Link wrapper around entire card for navigation */}
                <div
                    onClick={() => window.location.href = '/clinic'}
                    className="absolute inset-0 z-0 cursor-pointer"
                    aria-hidden="true"
                ></div>
            </div>
        </Card>
    );
};

export default ClinicCard;
