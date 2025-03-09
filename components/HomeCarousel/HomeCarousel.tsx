'use client'
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/shadcn/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/shadcn/carousel";
import doctorImg from '@/shared/assets/images/doctor.png'
import type { EmblaCarouselType } from 'embla-carousel';
import {CheckboxGroup} from "@/components/HomeCarousel/CheckboxOption";

// Компонент слайда с врачами
const DoctorsSlide = () => {
    return (
        <div className="w-full h-[660px] md:h-[500px] bg-primary rounded-lg flex flex-col md:flex-row justify-between px-4 md:px-20">
                <div className="flex flex-col justify-center items-center md:items-start pt-5 md:pt-0">
                        <h2 className="text-white h3-28-36-600 md:h2-40-56-600 mb-4 text-center md:text-start">
                            Врачи которым вы доверяете
                        </h2>
                        <h4 className="text-white h4-20-28-600 md:h3-28-36-600 mb-4">
                            Средний стаж от 7 лет
                        </h4>
                        <p className="hidden md:inline text-white p-16-24-400 mb-8">
                            Наша команда – это высококвалифицированные специалисты с проверенным
                            опытом. Мы гордимся тем, что наши врачи имеют средний стаж работы более
                            7 лет, что гарантирует вам лучшее медицинское обслуживание.
                        </p>

                        <div className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-2">
                                    <input
                                        type="text"
                                        placeholder="Врач, услуга, болезнь, клиника"
                                        className="w-full px-4 py-3 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-green-600 bg-green-50"
                                    />
                                    <Button
                                        className="h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                                    >
                                        Найти
                                    </Button>
                            </div>

                            <CheckboxGroup/>
                        </div>
                </div>

                {/* Background image */}
            <div
                className="w-full md:w-[1000px] h-[400px] md:h-[100%] relative flex md:items-end justify-center">
                <Image
                    src={doctorImg}
                    alt="Doctor"
                    // width={400}
                    // height={500}
                    className="w-[350px] md:w-[500px] h-[400px] md:h-[470px] object-cover m:object-contain"
                    priority
                />
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

export const HomeCarousel = () => {
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
            <Carousel
                setApi={setApi}
                className="relative mt-5 md:mt-10">
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
    );
};
