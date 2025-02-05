import React from 'react';
import { Percent } from 'lucide-react';
import { Button } from '../shadcn/button';

const DiscountBanner = () => {
    return (
        <div className="container mx-auto px-4">
            {/* Основной контейнер */}
            <div className="relative mb-6">
                {/* Верхняя строка с количеством врачей */}
                <div className="text-sm mb-2">
                    Запись на приём к лучшим врачам Алматы: {' '}
                    <span className="text-green-500">100 545 врачей</span>
                </div>

                {/* Баннер со скидкой */}
                <div className="bg-green-500 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="font-medium text-lg md:text-xl">Дешевле чем в клинике</h3>
                            <p className="text-sm md:text-base opacity-90">
                                Дешевле онлайн до 15% за первый прием к любому специалисту через наш сервис
                            </p>
                        </div>

                        {/* Иконка процента */}
                        <div className="hidden md:flex items-center">
                            <div className="relative">
                                <Percent
                                    size={48}
                                    className="text-white opacity-90"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Кнопка "Подробнее" */}
                    <Button
                        variant="secondary"
                        className="mt-4 bg-white text-green-600 hover:bg-gray-100"
                    >
                        Подробнее
                    </Button>
                </div>

                {/* Декоративные элементы */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10">
                    <div className="flex gap-4">
                        {[1, 2, 3].map((_, index) => (
                            <Percent
                                key={index}
                                size={64}
                                className="text-white transform rotate-12"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscountBanner;
