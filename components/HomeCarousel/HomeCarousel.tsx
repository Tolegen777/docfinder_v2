'use client'
import React, { useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/shadcn/carousel";
import type { EmblaCarouselType } from 'embla-carousel';
import {DoctorsHero} from "@/components/HomeCarousel/DoctorsHero";

const SLIDES = [
    { id: 0, component: <DoctorsHero /> },
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
