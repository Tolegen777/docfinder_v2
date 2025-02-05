import React from 'react';
import { Star, MapPin, Heart, Calendar } from 'lucide-react';
import Image from "next/image";
import { Breadcrumb } from "@/shared/ui/Breadcrumb";
import { DiscountBanner } from "@/components/DoctorsList/DoctorCard/DiscountBanner";
import {Card} from "@/components/shadcn/card";
import {Button} from "@/components/shadcn/button";
import Link from "next/link";
import clinicImg from '@/shared/assets/images/clinic.png'

const ClinicCard = ({
                        name = "Эмирмед на Манаса 55",
                        address = "Улица Манаса, 55, 1-этаж, 9 филиалов, Бостандыкский район, Алматы, 050057/ A15H7T2",
                        rating = {
                            stars: 4,
                            reviewCount: 3467
                        },
                        discount = {
                            percentage: 20,
                            text: "на первый прием"
                        },
                        schedule = {
                            monday: "09:00-18:00",
                            tuesday: "09:00-18:00",
                            wednesday: "09:00-18:00",
                            thursday: "09:00-18:00",
                            friday: "09:00-18:00",
                            saturday: "Выходной",
                            sunday: "Выходной"
                        },
                        specialists = 14,
                        price = 25000,
                        timeUntilClose = 45
                    }) => {
    const renderStars = (count) => {
        return Array(5).fill(0).map((_, index) => (
            <Star
                key={index}
                className={`w-5 h-5 ${index < count ? 'fill-[#FB923C] stroke-[#FB923C]' : 'stroke-[#FB923C] fill-white'}`}
            />
        ));
    };

    return (
        <Card className="w-full max-w-[1181px] p-4 md:p-5 bg-white cursor-pointer">
            <Link href={'/clinic'}>
            <div className="mb-2 -mt-2">
                <Breadcrumb />
            </div>

            <div className="flex flex-col lg:flex-row gap-5">
                <div className="flex flex-col items-start gap-4">
                    <div className="relative w-32 h-32">
                        <Image
                            src={clinicImg}
                            width={128}
                            height={128}
                            alt={name}
                            className="rounded-lg"
                        />
                    </div>

                    <div className="flex flex-col items-start gap-2">
                        <div className="flex space-x-0.5">
                            {renderStars(rating.stars)}
                        </div>
                        <p className="text-sm text-[#4B81EC] hover:underline cursor-pointer">
                            {rating.reviewCount} отзывов
                        </p>
                        <DiscountBanner>
                            Скидка <span className="text-green-600 font-semibold">{discount.percentage}%</span> {discount.text}
                        </DiscountBanner>
                    </div>
                </div>

                <div className="flex-1 space-y-5">
                    <div>
                        <h4 className="text-2xl font-semibold text-[#212121] mb-2">{name}</h4>
                        <div className="flex items-center gap-2.5 mb-2">
                            <MapPin className="w-5 h-5 text-[#16A34A]" />
                            <p className="text-sm text-[#94A3B8]">{address}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                            ))}
                        </div>
                        <p className="text-sm text-[#94A3B8]">{specialists} специалистов</p>
                    </div>

                    <div className="p-4 bg-[#F0FDF4] rounded-lg">
                        <p className="text-sm">
                            МРТ головного мозга с контрастом: <span className="text-[#16A34A]">от {price} тенге</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                        <Button variant="outline" className="gap-2">
                            <Calendar className="w-5 h-5 text-[#16A34A]" />
                            <span className="text-base font-semibold text-[#16A34A]">Расписание</span>
                        </Button>
                        <Button variant="outline" className="gap-2">
                            <Heart className="w-5 h-5 text-[#16A34A]" />
                            <span className="text-base font-semibold text-[#16A34A]">В избранное</span>
                        </Button>
                    </div>
                </div>

                <div className="lg:w-[300px] space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg">
                        <p className="text-red-500">Закроется через {timeUntilClose} мин</p>
                    </div>

                    <div className="space-y-2">
                        {Object.entries({
                            "Понедельник": schedule.monday,
                            "Вторник": schedule.tuesday,
                            "Среда": schedule.wednesday,
                            "Четверг": schedule.thursday,
                            "Пятница": schedule.friday,
                            "Суббота": schedule.saturday,
                            "Воскресенье": schedule.sunday
                        }).map(([day, hours]) => (
                            <div key={day} className="flex justify-between">
                                <span className="text-sm text-gray-600">{day}</span>
                                <span className="text-sm font-medium">{hours}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </Link>
        </Card>
    );
};

export default ClinicCard;
