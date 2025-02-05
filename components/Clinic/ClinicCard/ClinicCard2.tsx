import React from 'react';
import Image from 'next/image';
import { MapPin, Heart, Clock, Pen } from 'lucide-react';

const ClinicCard = () => {
    const rating = 4;
    const totalReviews = 467;

    return (
        <div className="w-full max-w-2xl bg-white rounded-xl p-4 shadow-sm">
            {/* Мобильная версия */}
            <div className="md:hidden space-y-4">
                <h2 className="text-xl font-medium">Эмирмед на Манаса 55</h2>

                <div className="flex items-start gap-3">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                        <Image
                            src="/api/placeholder/80/80"
                            alt="Эмирмед"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                            <span className="text-sm text-gray-600">{totalReviews} отзывов</span>
                        </div>

                        <div className="inline-block px-3 py-1 bg-emerald-50 rounded-full">
                            <p className="text-sm">
                                <span className="text-emerald-600 font-medium">Скидка 20%</span>
                                <span className="text-gray-600"> на первый прием</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-red-500 text-sm font-medium flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Закроется через 45 мин
                </div>

                <div className="space-y-1">
                    <div className="flex items-center text-sm">
                        <span className="text-gray-600">Пн-Пт</span>
                        <span className="mx-2 text-gray-400">·</span>
                        <span>09:00-18:00</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <span className="text-gray-600">Сб-Вс</span>
                        <span className="mx-2 text-gray-400">·</span>
                        <span>Выходной</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm text-blue-600">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                            <p>Эмирмед на Манаса</p>
                            <p className="text-gray-600">
                                Улица Манаса, 55, 1-этаж, 9 филиалов, Бостандыкский район, Алматы, 050057/A15H7T2
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-2 space-y-2">
                    <button className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                        <Pen className="w-4 h-4" />
                        Записаться онлайн
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                        <button className="py-2.5 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                            <MapPin className="w-4 h-4" />
                            На карте
                        </button>
                        <button className="py-2.5 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center">
                            <Heart className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Десктопная версия */}
            <div className="hidden md:flex gap-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0">
                    <Image
                        src="/api/placeholder/96/96"
                        alt="Эмирмед"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-medium">Эмирмед на Манаса 55</h2>
                        <div className="space-y-1 text-right">
                            <p className="text-gray-900">+7 701 234 43 23</p>
                            <p className="text-gray-900">+7 701 234 43 23</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                        <span className="text-sm text-blue-600 hover:underline cursor-pointer">
              {totalReviews} отзывов
            </span>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-blue-600 mb-3">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                            <p className="hover:underline cursor-pointer">Эмирмед на Манаса</p>
                            <p className="text-gray-600">
                                Улица Манаса, 55, 1-этаж, 9 филиалов, Бостандыкский район, Алматы, 050057/A15H7T2
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                        <span className="text-sm text-gray-600">Пн-Пт</span>
                        <span className="mx-1 text-gray-400">·</span>
                        <span className="text-sm">09:00-18:00</span>
                        <span className="text-red-500 text-sm font-medium ml-3 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Закроется через 45 мин
            </span>
                    </div>

                    <div className="flex items-center gap-1 mb-4">
                        <span className="text-sm text-gray-600">Сб-Вс</span>
                        <span className="mx-1 text-gray-400">·</span>
                        <span className="text-sm">Выходной</span>
                    </div>

                    <div className="inline-block px-3 py-1 bg-emerald-50 rounded-full mb-4">
                        <p className="text-sm">
                            <span className="text-emerald-600 font-medium">Скидка 20%</span>
                            <span className="text-gray-600"> на первый прием</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-2">
                            <Pen className="w-4 h-4" />
                            Записаться онлайн
                        </button>
                        <button className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            На карте
                        </button>
                        <button className="p-2 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">
                            <Heart className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClinicCard;
