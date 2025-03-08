import React from 'react';
import { Button } from "@/shared/ui/shadcn/button";
import { Card } from "@/shared/ui/shadcn/card";

const NotFoundSection = () => {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <Card className="relative overflow-hidden md:h-64 bg-[#EBF2FF] rounded-2xl p-6 md:p-8">
                {/* Desktop Layout */}
                <div className="hidden md:block">
                    <div className="max-w-lg space-y-5">
                        <div className="space-y-2.5">
                            <h2 className="text-4xl font-semibold text-[#121923]">
                                Не нашли то, что нужно?
                            </h2>
                            <p className="text-lg text-[#121923]">
                                Звоните нам, мы бесплатно подберём врача и запишем вас на приём
                            </p>
                        </div>
                        <Button className="bg-[#16A34A] hover:bg-[#15803d] text-white">
                            Заказать звонок
                        </Button>
                    </div>

                    {/* Desktop images */}
                    <div className="absolute right-0 top-0 h-full w-1/2">
                        <div className="relative h-full">
                            {/* Placeholder for main image */}
                            <img
                                src="/api/placeholder/400/320"
                                alt="Hand with magnifying glass"
                                className="absolute right-0 -top-8"
                            />
                            {/* Placeholder for small image */}
                            <img
                                src="/api/placeholder/156/163"
                                alt="Emoji"
                                className="absolute left-12 top-16"
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden space-y-5">
                    <div className="space-y-2.5 text-center">
                        <h2 className="text-2xl font-semibold text-[#121923]">
                            Не нашли то, что нужно?
                        </h2>
                        <p className="text-lg text-[#121923]">
                            Звоните нам, мы бесплатно подберём врача и запишем вас на приём
                        </p>
                    </div>

                    <Button className="w-full bg-[#16A34A] hover:bg-[#15803d] text-white">
                        Заказать звонок
                    </Button>

                    {/* Mobile images */}
                    <div className="relative mt-8 h-72">
                        {/* Placeholder for main image */}
                        <img
                            src="/api/placeholder/311/223"
                            alt="Hand with magnifying glass"
                            className="absolute right-0 top-16"
                        />
                        {/* Placeholder for small image */}
                        <img
                            src="/api/placeholder/91/95"
                            alt="Emoji"
                            className="absolute left-6 top-20"
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default NotFoundSection;
