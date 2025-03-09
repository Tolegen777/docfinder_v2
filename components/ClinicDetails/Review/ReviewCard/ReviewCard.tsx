import React from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {ConfirmationMessage} from "@/components/ClinicDetails/Review/ReviewCard/ConfirmationMessage";

interface ReviewCardProps {
    id: number;
    authorName: string;
    text: string;
    rating: number;
    createdAt: string;
    // Моковые данные, если их нет в API
    isVerified?: boolean;
    clinicName?: string;
    clinicLink?: string;
}

// Функция для получения инициалов из имени
const getInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`;
    }
    return name.substring(0, 2).toUpperCase();
};

// Функция для получения текста рейтинга
const getRatingText = (rating: number): string => {
    if (rating === 5) return 'Отлично';
    if (rating === 4) return 'Хорошо';
    if (rating === 3) return 'Средний';
    if (rating === 2) return 'Плохо';
    return 'Очень плохо';
};

export const ReviewCard = ({
                               id,
                               authorName,
                               text,
                               rating,
                               createdAt,
                               isVerified = true, // По умолчанию считаем верифицированным
                               clinicName = 'Эмирмед на Манаса 55', // Моковые данные
                               clinicLink = '/clinic/emirmed-55' // Моковые данные
                           }: ReviewCardProps) => {
    const initials = getInitials(authorName);
    const ratingText = getRatingText(rating);
    const formattedDate = format(new Date(createdAt), 'd MMMM yyyy', { locale: ru });

    return (
        <div className="w-full bg-white rounded-xl p-4 space-y-4 border">
            <div className="flex items-start gap-3">
                {/* Аватар с инициалами */}
                <div className="w-20 h-20 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0 border border-primary">
                    <span className="text-primary font-semibold text-[28px] leading-6">{initials}</span>
                </div>

                <div className="flex-1 min-w-0">
                    {/* Имя, рейтинг и дата */}
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xl font-semibold">{authorName}</h3>
                        <span className="text-sm text-gray-500">{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        {/* Звезды рейтинга */}
                        <div className="flex">
                            {[...Array(5)].map((_, index) => (
                                <svg
                                    key={index}
                                    className={`w-4 h-4 ${
                                        index < rating ? 'text-primary' : 'text-gray-200'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-base font-normal text-gray-600">{ratingText}</span>
                        {isVerified && (
                            <ConfirmationMessage classname="hidden md:flex"/>
                        )}
                    </div>

                    {/* Статус верификации */}
                    {isVerified && (
                        <ConfirmationMessage classname="flex md:hidden"/>
                    )}
                    {/* Текст отзыва */}
                    <p className="text-gray-600 text-base font-normal my-5">{text}</p>

                    {/* Ссылка на клинику */}
                    <div>
                        <h4 className="text-base font-normal text-gray-600 mb-1">Клиника</h4>
                        <Link
                            href={clinicLink}
                            className="text-base font-normal text-blue-600 hover:underline"
                        >
                            {clinicName}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
