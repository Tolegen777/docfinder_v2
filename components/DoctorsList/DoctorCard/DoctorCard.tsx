'use client'
import React from 'react';
import { Star, Eye, MapPin, Heart, Home, Headphones, Car, ChevronDown } from 'lucide-react';
import { Card } from '../../shadcn/card';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../../shadcn/sheet"

interface DoctorCardProps {
    name: string;
    specialties: string[];
    experience: string;
    category: string;
    rating: {
        percentage: number;
        reviewCount: number;
        stars: number;
    };
    discount: {
        percentage: number;
        text: string;
    };
    clinic: {
        name: string;
        address: string;
    };
    prices: {
        clinic: number;
        online: number;
        house: number;
    };
}

const DoctorCard = ({
                        name = "Бауыржанов Бауыржан Бауыржанович",
                        specialties = ["Онколог", "Онкодерматолог", "Онкодерматологдиетолог"],
                        experience = "20 лет",
                        category = "Высшая категория",
                        rating = {
                            percentage: 82,
                            reviewCount: 467,
                            stars: 4
                        },
                        discount = {
                            percentage: 20,
                            text: "на первый прием"
                        },
                        clinic = {
                            name: "Эмирмед на Манаса",
                            address: "ул.Ауэзова, 37 (угол Кабанбай Батыра), БЦ \"32 Карата\", 3 этаж, Алмалинский район, Алматы"
                        },
                        prices = {
                            clinic: 1000,
                            online: 1000,
                            house: 1000
                        }
                    }: Partial<DoctorCardProps>) => {
    const renderStars = (count: number) => {
        return Array(5).fill(0).map((_, index) => (
            <Star
                key={index}
                className={`w-5 h-5 ${index < count ? 'fill-[#FB923C] stroke-[#FB923C]' : 'stroke-[#FB923C] fill-white'}`}
            />
        ));
    };

    const ScheduleContent = () => (
        <>
            <div className="flex border-b border-[#CBD5E1]">
                <button className="px-5 py-2.5 text-[#16A34A] font-semibold border-b-2 border-[#16A34A]">
                    Сегодня 21.02
                </button>
                <button className="px-5 py-2.5 text-[#212121]">
                    Завтра 22.02
                </button>
                <button className="px-5 py-2.5 text-[#94A3B8]">
                    Пятница 22.02
                </button>
            </div>

            <div className="grid grid-cols-4 gap-5">
                {["12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45"].map((time) => (
                    <button
                        key={time}
                        className="px-5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg hover:border-[#16A34A] transition-colors bg-white"
                    >
                        {time}
                    </button>
                ))}
            </div>

            <button className="w-full flex items-center justify-center gap-2.5 px-5 py-2.5 border border-[#16A34A] rounded-lg bg-white hover:bg-[#F0FDF4] transition-colors">
                <Eye className="w-5 h-5 text-[#16A34A]" />
                <span className="text-base font-semibold text-[#16A34A]">Показать еще</span>
            </button>
        </>
    );

    const MobileSchedule = () => (
        <Sheet>
            <SheetTrigger asChild>
                <button className="w-full flex items-center justify-center gap-2.5 px-5 py-2.5 border border-[#16A34A] rounded-lg bg-white">
                    <span className="text-base font-semibold text-[#16A34A]">Выберите дату</span>
                    <ChevronDown className="w-5 h-5 text-[#16A34A]" />
                </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-[20px]">
                <SheetHeader>
                    <SheetTitle className="text-xl font-semibold text-[#212121]">
                        Выберите время приёма для записи онлайн
                    </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-5 overflow-auto">
                    <ScheduleContent />
                </div>
            </SheetContent>
        </Sheet>
    );

    return (
        <Card className="w-full max-w-[1181px] p-6 md:p-7 bg-white">
            <div className="flex flex-col lg:flex-row gap-5">
                {/* Left Column - Photo and Rating */}
                <div className="flex flex-col items-center space-y-2.5">
                    <div className="relative">
                        <img
                            src="/api/placeholder/150/150"
                            alt={name}
                            className="w-[104px] h-[104px] lg:w-[150px] lg:h-[150px] rounded-full border-2 border-[#16A34A]"
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex space-x-0.5">
                            {renderStars(rating.stars)}
                        </div>
                        <p className="text-sm font-bold text-[#94A3B8] text-center max-w-[160px]">
                            {rating.percentage}% пациентов рекомендует врача
                        </p>
                        <p className="text-sm text-[#4B81EC] hover:underline cursor-pointer">
                            {rating.reviewCount} отзывов
                        </p>
                    </div>
                    <div className="w-full px-5 py-2.5 border border-[#CBD5E1] rounded-lg text-center">
                        <p className="text-sm">
                            Скидка <span className="text-[#16A34A] font-semibold">{discount.percentage}%</span> {discount.text}
                        </p>
                    </div>
                </div>

                {/* Middle Column - Main Info */}
                <div className="flex-1 space-y-5">
                    <div className="space-y-2.5">
                        <div className="flex flex-wrap gap-2.5 text-sm">
                            {specialties.map((specialty, index) => (
                                <React.Fragment key={specialty}>
                  <span className={specialty === "Онкодерматологдиетолог" ? "text-[#16A34A]" : "text-[#94A3B8]"}>
                    {specialty}
                  </span>
                                    {index < specialties.length - 1 && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] self-center"/>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        <h2 className="text-xl md:text-2xl lg:text-[28px] font-semibold leading-tight text-[#212121]">
                            {name}
                        </h2>
                        <p className="text-sm text-[#94A3B8]">{specialties[2]}</p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
            <span className="px-5 py-2.5 border border-[#CBD5E1] rounded-lg text-sm bg-white">
              Стаж {experience}
            </span>
                        <span className="px-5 py-2.5 border border-[#CBD5E1] rounded-lg text-sm bg-white">
              {category}
            </span>
                    </div>

                    <div className="space-y-2.5">
                        {[
                            { icon: Home, text: "В клинике", price: prices.clinic },
                            { icon: Headphones, text: "Онлайн консультация", price: prices.online },
                            { icon: Car, text: "Выезд на дом", price: prices.house },
                        ].map(({ icon: Icon, text, price }) => (
                            <div key={text} className="flex items-center gap-2.5 px-5 py-2.5 bg-[#F0FDF4] rounded-lg">
                                <Icon className="w-5 h-5 text-[#16A34A]" />
                                <span className="text-sm flex-1">{text}</span>
                                <div className="text-sm">
                                    <span>От </span>
                                    <span className="text-[#16A34A]">{price}</span>
                                    <span className="line-through ml-1 text-[#94A3B8]">2000</span>
                                    <span> тг</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5">
                            <MapPin className="w-5 h-5 text-[#16A34A]" />
                            <span className="text-base text-[#4B81EC] hover:underline cursor-pointer">{clinic.name}</span>
                        </div>
                        <p className="text-sm text-[#94A3B8]">{clinic.address}</p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                        <button className="flex items-center gap-2.5 px-5 py-2.5 border border-[#16A34A] rounded-lg bg-white hover:bg-[#F0FDF4] transition-colors">
                            <Eye className="w-5 h-5 text-[#16A34A]" />
                            <span className="text-base font-semibold text-[#16A34A]">Показать номер</span>
                        </button>
                        <button className="flex items-center gap-2.5 px-5 py-2.5 border border-[#16A34A] rounded-lg bg-white hover:bg-[#F0FDF4] transition-colors">
                            <MapPin className="w-5 h-5 text-[#16A34A]" />
                            <span className="text-base font-semibold text-[#16A34A]">На карте</span>
                        </button>
                        <button className="p-2.5 border border-[#16A34A] rounded-lg bg-white hover:bg-[#F0FDF4] transition-colors">
                            <Heart className="w-5 h-5 text-[#16A34A]" />
                        </button>
                    </div>
                </div>

                {/* Right Column - Appointment */}
                <div className="lg:w-[453px] space-y-5">
                    <h3 className="text-xl md:text-2xl lg:text-[28px] font-semibold leading-tight text-[#212121]">
                        Выберите время приёма для записи онлайн
                    </h3>

                    {/* Desktop Schedule */}
                    <div className="hidden lg:flex lg:flex-col gap-5">
                        <ScheduleContent />
                    </div>

                    {/* Mobile Schedule */}
                    <div className="lg:hidden">
                        <MobileSchedule />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default DoctorCard;
