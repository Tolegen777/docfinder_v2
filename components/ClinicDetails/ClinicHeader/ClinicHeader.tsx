'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, ChevronLeft, ChevronRight, Train, Bus } from 'lucide-react';
import clininc1Img from '../../../shared/assets/images/img.png';
import clininc2Img from '../../../shared/assets/images/img.png';
import {MaxWidthLayout} from "@/shared/ui/MaxWidthLayout";

const images = [clininc1Img, clininc2Img];

export const ClinicHeader = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <MaxWidthLayout className="py-4">
            {/* Мобильная версия */}
            <div className="md:hidden space-y-4">
                {/* Карусель */}
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl">
                    <div className="relative w-full h-full">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className={`absolute w-full h-full transition-opacity duration-500 
                          ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <Image
                                    src={img}
                                    alt={`Эмирмед ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Карта с информацией */}
                <div className="bg-white rounded-xl overflow-hidden">
                    <div className="relative w-full aspect-video">
                        <Image
                            src="/api/placeholder/600/300"
                            alt="Карта"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-1 shrink-0 text-emerald-600" />
                            <p className="text-sm">улица Абдуллы Розыбакиева, 37В, Алматы</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <Train className="w-4 h-4 mt-1 shrink-0 text-emerald-600" />
                            <p className="text-sm">Метро: Сарыарка - 5 мин пешком</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <Bus className="w-4 h-4 mt-1 shrink-0 text-emerald-600" />
                            <p className="text-sm">Остановка: Оптовка - 5 мин пешком</p>
                        </div>
                        <div className="space-y-1 pt-2">
                            {['Пн', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'].map((day, index) => (
                                <div key={day} className="flex justify-between text-sm">
                                    <span className="text-gray-600">{day}</span>
                                    <span>{index < 5 ? '09:00-18:00' : 'Выходной'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Десктопная версия */}
            <div className="hidden md:flex gap-6">
                {/* Карусель */}
                <div className="relative w-[660px] h-[400px] overflow-hidden rounded-xl">
                    <div className="relative w-full h-full">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className={`absolute w-full h-full transition-opacity duration-500 
                          ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <Image
                                    src={img}
                                    alt={`Эмирмед ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Кнопки навигации */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2
                     p-2 rounded-full bg-white/80 hover:bg-white
                     transition-colors shadow-md"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2
                     p-2 rounded-full bg-white/80 hover:bg-white
                     transition-colors shadow-md"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Карта с информацией */}
                <div className="w-[400px] h-[400px] bg-white rounded-xl overflow-hidden flex flex-col">
                    <div className="relative w-full h-[200px]">
                        <Image
                            src="/api/placeholder/400/200"
                            alt="Карта"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1 p-4 space-y-3">
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-1 shrink-0 text-emerald-600" />
                            <p className="text-sm">улица Абдуллы Розыбакиева, 37В, Алматы</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <Train className="w-4 h-4 mt-1 shrink-0 text-emerald-600" />
                            <p className="text-sm">Метро: Сарыарка - 5 мин пешком</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <Bus className="w-4 h-4 mt-1 shrink-0 text-emerald-600" />
                            <p className="text-sm">Остановка: Оптовка - 5 мин пешком</p>
                        </div>
                        <div className="space-y-1 pt-2">
                            {['Пн', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'].map((day, index) => (
                                <div key={day} className="flex justify-between text-sm">
                                    <span className="text-gray-600">{day}</span>
                                    <span>{index < 5 ? '09:00-18:00' : 'Выходной'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MaxWidthLayout>
    );
};
