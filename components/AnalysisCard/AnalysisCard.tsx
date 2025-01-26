import React from 'react';
import Link from 'next/link';
import { Calendar, BeakerIcon, Building2, MapPin } from 'lucide-react';

const InfoBlock = ({
                       icon: Icon,
                       title,
                       value,
                       isLink = false
                   }: {
    icon: React.ElementType;
    title: string;
    value: string;
    isLink?: boolean;
}) => (
    <div className="bg-green-50/50 p-4 rounded-lg">
        <div className="flex items-start gap-2">
            <Icon className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
                <div className="text-sm text-gray-600 mb-1">{title}</div>
                {isLink ? (
                    <Link href="#" className="text-blue-500 hover:text-blue-600">
                        {value}
                    </Link>
                ) : (
                    <div className="text-gray-900">{value}</div>
                )}
            </div>
        </div>
    </div>
);

type Props = {
    title: string;
    description: string;
    executionTime: string;
    location: string;
    material: string;
    labCount: number;
    price: number;
    expressPrice: number;
}

const AnalysisCard = ({
                          title,
                          description,
                          executionTime,
                          location,
                          material,
                          labCount,
                          price,
                          expressPrice
                      }: Props) => {
    return (
        <div className="border border-green-500 rounded-2xl p-6">
            {/* Заголовок */}
            <h3 className="text-2xl text-green-500 font-medium mb-4">{title}</h3>

            {/* Описание */}
            <p className="text-gray-600 mb-6">{description}</p>

            {/* Информационные блоки */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <InfoBlock
                    icon={Calendar}
                    title="Срок выполнения"
                    value={executionTime}
                />
                <InfoBlock
                    icon={MapPin}
                    title="Где можно сдать"
                    value={location}
                />
                <InfoBlock
                    icon={BeakerIcon}
                    title="Материал забора"
                    value={material}
                />
                <InfoBlock
                    icon={Building2}
                    title="Место сдачи"
                    value={`${labCount} лабораторий`}
                    isLink
                />
            </div>

            {/* Цены */}
            <div className="flex gap-4">
                <div className="px-6 py-3 bg-white border border-gray-200 rounded-lg">
                    от {price.toLocaleString()} тг
                </div>
                {expressPrice && (
                    <div className="px-6 py-3 bg-white border border-gray-200 rounded-lg">
                        Экспресс от {expressPrice.toLocaleString()} тг
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalysisCard;
