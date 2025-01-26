import React from 'react';
import Image from 'next/image';
import doctorImg from '../../shared/assets/images/doctor.png';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../shadcn/carousel";
import { Input } from "../shadcn/input";
import { Button } from "../shadcn/button";
import { Checkbox } from "../shadcn/checkbox";

export const HomeCarousel = () => {
    return (
        <Carousel className="w-full max-w-3xl mx-auto">
            <CarouselContent>
                {/* First Slide */}
                <CarouselItem>
                    <div className="bg-green-500 rounded-lg p-6 relative">
                        <div className="md:grid md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <h2 className="text-white text-2xl font-medium mb-2">
                                    Врачи которым вы доверяете
                                </h2>
                                <p className="text-white text-sm mb-4">
                                    Средний стаж от 7 лет
                                </p>

                                <div className="space-y-4">
                                    <Input
                                        placeholder="Врач, услуга, болезнь, клиника"
                                        className="w-full bg-white"
                                    />

                                    <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
                                        Найти
                                    </Button>

                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="pediatrician" className="bg-white"/>
                                            <label htmlFor="pediatrician" className="text-white">
                                                Детский врач
                                            </label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="house-call" className="bg-white"/>
                                            <label htmlFor="house-call" className="text-white">
                                                На дом
                                            </label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="online" className="bg-white"/>
                                            <label htmlFor="online" className="text-white">
                                                Прием онлайн
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:block relative h-full">
                                <Image
                                    src={doctorImg}
                                    alt="Doctor"
                                    className="absolute bottom-0 right-0"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </CarouselItem>

                {/* Second Slide */}
                <CarouselItem>
                    <div className="bg-green-500 rounded-lg p-6 h-full flex items-center justify-center">
                        <h2 className="text-white text-2xl">Находится в разработке</h2>
                    </div>
                </CarouselItem>
            </CarouselContent>

            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />

            <div className="flex justify-center mt-4 gap-2">
                <div className="w-2 h-2 rounded-full bg-white" />
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <div className="w-2 h-2 rounded-full bg-gray-300" />
            </div>
        </Carousel>
    );
};
