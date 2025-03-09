import React from 'react';
import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/shadcn/card";

const AppointmentCard = () => {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <Card className="relative overflow-hidden md:h-64 bg-gradient-to-r from-[#338BC2] to-[#E1C5CF] md:bg-gradient-to-r bg-gradient-to-b rounded-2xl p-6 md:p-8">
                {/* Desktop Layout */}
                <div className="hidden md:block">
                    <div className="absolute left-14 top-12 w-24 h-24 border-8 border-white/20 rounded-full" />
                    <div className="absolute right-16 top-20 w-44 h-44 border-[14px] border-white/20 rounded-full" />

                    <div className="ml-96 space-y-5">
                        <div className="space-y-2.5">
                            <h2 className="text-4xl font-semibold text-white">
                                Гарантируем качество приёма
                            </h2>
                            <p className="text-lg text-white">
                                Если вам не понравился прием, то мы запишем вас к другому врачу бесплатно.
                            </p>
                        </div>
                        <Button variant="outline" className="bg-white text-green-600 border-green-600 hover:bg-green-50">
                            Записаться онлайн
                        </Button>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden space-y-5">
                    <div className="space-y-2.5 text-center">
                        <h2 className="text-2xl font-semibold text-white">
                            Дешевле чем в клинике
                        </h2>
                        <p className="text-lg text-white">
                            Дарим скидку до ХХ% на первый прием к любому врачу при обращении через нас
                        </p>
                    </div>

                    <Button variant="outline" className="w-full bg-white text-green-600 border-green-600 hover:bg-green-50">
                        Записаться онлайн
                    </Button>

                    <div className="absolute left-0 top-64 w-20 h-20 border-6 border-white/20 rounded-full" />
                    <div className="absolute right-0 top-80 w-32 h-32 border-8 border-white/20 rounded-full" />
                </div>
            </Card>
        </div>
    );
};

export default AppointmentCard;
