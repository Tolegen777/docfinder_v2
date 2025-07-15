'use client'
import React, { useState, useEffect } from 'react';
import Image, {StaticImageData} from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ClinicCarouselProps {
    images: string[] | StaticImageData[]; // Можно уточнить тип, если используется определенный формат изображений
    autoSlideInterval?: number; // Интервал автоматического переключения в мс
}

export const ClinicCarousel: React.FC<ClinicCarouselProps> = ({
                                                                  images,
                                                                  autoSlideInterval = 5000
                                                              }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Функция для автоматического переключения слайдов
    useEffect(() => {
        if (images && images?.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, autoSlideInterval);

        return () => clearInterval(timer);
    }, [images?.length, autoSlideInterval]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    if (images.length === 0) {
        // Заглушка, если нет изображений
        return (
            <div className="relative w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-gray-500">Изображений нет</span>
            </div>
        );
    }

    console.log(images, 'bro')

    return (
        <div className="relative w-full h-full overflow-hidden rounded-xl">
            <div className="relative w-full h-full">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute w-full h-full transition-opacity duration-500 
                  ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <Image
                            src={img}
                            alt={`Изображение клиники ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Индикаторы слайдов (показываем только если > 1 изображения) */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center py-4 overflow-x-auto no-scrollbar mx-10">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 mx-1 flex-shrink-0 rounded-full ${currentSlide === index ? 'bg-primary' : 'bg-gray-300'}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            )}

            {/* Кнопки навигации (показываем только если > 1 изображения) */}
            {images.length > 1 && (
                <>
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
                </>
            )}
        </div>
    );
};
