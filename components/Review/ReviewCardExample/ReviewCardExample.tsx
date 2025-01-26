import React from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';

interface ReviewCardProps {
    authorName: string;
    initials: string;
    rating: number;
    ratingText: string;
    isVerified: boolean;
    content: string;
    clinicName: string;
    clinicLink: string;
}

export const ReviewCard = ({
                        authorName,
                        initials,
                        rating,
                        ratingText,
                        isVerified,
                        content,
                        clinicName,
                        clinicLink
                    }: ReviewCardProps) => {
    return (
        <div className="w-full bg-white rounded-xl p-4 space-y-4">
            <div className="flex items-start gap-3">
                {/* Аватар с инициалами */}
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <span className="text-emerald-600 font-medium">{initials}</span>
                </div>

                <div className="flex-1 min-w-0">
                    {/* Имя и рейтинг */}
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-medium">{authorName}</h3>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        {/* Звезды рейтинга */}
                        <div className="flex">
                            {[...Array(5)].map((_, index) => (
                                <svg
                                    key={index}
                                    className={`w-4 h-4 ${
                                        index < rating ? 'text-yellow-400' : 'text-gray-200'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">{ratingText}</span>
                    </div>

                    {/* Статус верификации */}
                    {isVerified && (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 rounded-full mb-3">
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm">Прием в клинике подтвержден</span>
                        </div>
                    )}

                    {/* Текст отзыва */}
                    <p className="text-gray-600 text-sm mb-3">{content}</p>

                    {/* Ссылка на клинику */}
                    <div>
                        <h4 className="text-sm text-gray-600 mb-1">Клиника</h4>
                        <Link
                            href={clinicLink}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            {clinicName}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Пример использования
const ReviewCardExample = () => {
    return (
        <div className="max-w-2xl">
            <ReviewCard
                authorName="Сергей Тимуров"
                initials="СТ"
                rating={3}
                ratingText="Среднее"
                isVerified={true}
                content="Я обратился, чтобы сделать МРТ головного мозга. Выбрал эту клинику по близости к дому. На прием меня приняли вовремя. Специалист диагностики проконсультировал меня. По итогу обследования диск мне выдали на руки, описание прислали на почту в течение 2 часов."
                clinicName="Эмирмед на Манаса 55"
                clinicLink="/clinic/emirmed-55"
            />
        </div>
    );
};

export default ReviewCardExample;
