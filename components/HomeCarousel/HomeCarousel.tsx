'use client'
import React, { useState } from "react";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/shadcn/carousel";
import { SearchInput } from '@/components/Search/SearchInput';
import doctorImg from '@/shared/assets/images/home_doctors.png'
import type { EmblaCarouselType } from 'embla-carousel';

// Компонент слайда с врачами
const DoctorsSlide = () => {
    return (
        <div className="w-full bg-primary rounded-lg overflow-hidden">
            {/* Основной контейнер с Grid */}
            <div className="h-full grid grid-cols-1 lg:grid-cols-2">

                {/* Левая часть - текстовый контент */}
                <div className="flex flex-col justify-center px-6 md:px-8 lg:px-12 xl:px-16 py-8 lg:py-12">
                    <div className="max-w-lg">
                        <h2 className="text-white h3-28-36-600 md:h2-40-56-600 mb-4 lg:mb-6 font-semibold">
                            Врачи которым вы доверяете
                        </h2>

                        <h4 className="text-white h4-20-28-600 md:h3-28-36-600 mb-4 lg:mb-6 font-semibold">
                            Средний стаж от 7 лет
                        </h4>

                        <p className="text-white p-16-24-400 mb-6 lg:mb-8 opacity-90 leading-relaxed font-normal">
                            Наша команда – это высококвалифицированные специалисты с проверенным
                            опытом. Мы гордимся тем, что наши врачи имеют средний стаж работы более
                            7 лет, что гарантирует вам лучшее медицинское обслуживание.
                        </p>

                        <div className="space-y-4">
                            <SearchInput
                                variant="hero"
                                placeholder="Врач, услуга, клиника"
                                className="w-full max-w-md"
                            />
                        </div>
                    </div>
                </div>

                {/* Правая часть - изображение */}
                <div className="relative flex items-end justify-center lg:justify-end overflow-hidden">
                    {/* Контейнер для изображения с правильными пропорциями */}
                    <div className="relative md:mr-10 w-full max-w-lg lg:max-w-none lg:w-full h-full min-h-[280px] md:min-h-[400px] lg:min-h-full">
                        <Image
                            src={doctorImg}
                            alt="Doctor"
                            fill
                            className="object-contain object-bottom lg:object-right-bottom"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const SLIDES = [
    { id: 0, component: <DoctorsSlide /> },
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
        <div className="relative mt-5 md:mt-10">
            <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                    {SLIDES.map((slide) => (
                        <CarouselItem key={slide.id}>
                            {slide.component}
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {/* Индикаторы - показываем только если слайдов больше одного */}
            {SLIDES.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                    {SLIDES.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => api?.scrollTo(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === activeIndex
                                    ? "bg-white w-8"
                                    : "bg-white/50 w-2 hover:bg-white/70"
                            }`}
                            aria-label={`Перейти к слайду ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
