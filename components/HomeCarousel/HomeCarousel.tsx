'use client'
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/shadcn/carousel";
import doctorImg from '@/shared/assets/images/doctor.png'
import type { EmblaCarouselType } from 'embla-carousel';

// Компонент слайда с врачами
const DoctorsSlide = () => {
    return (
        <div className="relative w-full h-[500px] bg-green-500 rounded-lg overflow-hidden">
            <div className="absolute inset-0">
                <div className="container mx-auto px-4 h-full flex flex-col justify-center">
                    <div className="max-w-2xl">
                        <h1 className="text-white text-4xl font-bold mb-4">
                            Врачи которым вы доверяете
                        </h1>
                        <h2 className="text-white text-2xl mb-4">
                            Средний стаж от 7 лет
                        </h2>
                        <p className="text-white text-lg mb-8">
                            Наша команда – это высококвалифицированные специалисты с проверенным
                            опытом. Мы гордимся тем, что наши врачи имеют средний стаж работы более
                            7 лет, что гарантирует вам лучшее медицинское обслуживание.
                        </p>

                        <div className="space-y-4">
                            <div className="flex">
                                <div className="relative flex-1 max-w-2xl">
                                    <input
                                        type="text"
                                        placeholder="Врач, услуга, болезнь, клиника"
                                        className="w-full px-4 py-3 rounded-l-md border-0 focus:outline-none focus:ring-2 focus:ring-green-600 bg-green-50"
                                    />
                                    <Button
                                        className="absolute right-0 top-0 h-full px-8 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-l-none"
                                    >
                                        Найти
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="pediatrician" className="border-white data-[state=checked]:bg-white data-[state=checked]:text-green-500" />
                                    <label htmlFor="pediatrician" className="text-white cursor-pointer">
                                        Детский врач
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="homeVisit" className="border-white data-[state=checked]:bg-white data-[state=checked]:text-green-500" />
                                    <label htmlFor="homeVisit" className="text-white cursor-pointer">
                                        На дом
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="online" className="border-white data-[state=checked]:bg-white data-[state=checked]:text-green-500" />
                                    <label htmlFor="online" className="text-white cursor-pointer">
                                        Прием онлайн
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background image */}
                <div className="absolute right-0 bottom-0 h-full w-1/3">
                    <div className="relative h-full">
                        <Image
                            src={doctorImg} // Замените на реальный путь к изображению
                            alt="Doctor"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Пример других типов слайдов (можно добавить свои)
const ExampleSlide = () => (
    <div className="relative w-full h-[500px] bg-blue-500 rounded-lg p-8">
        <h2 className="text-white text-3xl">Другой тип слайда</h2>
    </div>
);

const SLIDES = [
    { id: 0, component: <DoctorsSlide /> },
    { id: 1, component: <ExampleSlide /> },
];

const HomeCarousel = () => {
    const [api, setApi] = useState<EmblaCarouselType>();
    const [activeIndex, setActiveIndex] = useState(0);

    const onSelect = React.useCallback((api: EmblaCarouselType) => {
        setActiveIndex(api.selectedScrollSnap());
    }, []);

    React.useEffect(() => {
        if (!api) return;

        api.on('select', onSelect);
        // Cleanup
        return () => {
            api.off('select', onSelect);
        };
    }, [api, onSelect]);

    return (
        <div className="container mx-auto px-4 py-8">
            <Carousel
                setApi={setApi}
                className="relative"
            >
                <CarouselContent>
                    {SLIDES.map((slide) => (
                        <CarouselItem key={slide.id}>
                            {slide.component}
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Кастомные кнопки навигации */}
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />

                {/* Индикаторы */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {SLIDES.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => api?.scrollTo(index)}
                            className={`h-2 rounded-full transition-all ${
                                index === activeIndex
                                    ? "bg-white w-8"
                                    : "bg-white/50 w-2"
                            }`}
                        />
                    ))}
                </div>
            </Carousel>
        </div>
    );
};

export default HomeCarousel;
