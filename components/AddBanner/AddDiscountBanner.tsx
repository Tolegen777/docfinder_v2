import React from 'react';
import Image from "next/image";
import addPercent from '@/shared/assets/images/add_percent.png'
import addPercentMobile from '@/shared/assets/images/add_percent_mobile.png'
import {MaxWidthLayout} from "@/shared/ui/MaxWidthLayout";

export const AddDiscountBanner = () => {
    return (
        <MaxWidthLayout>
            {/* Основной контейнер */}
            <div className="relative mb-6">
                {/* Верхняя строка с количеством врачей */}
                <div
                    className="h3-28-36-600 md:h2-38-54-600 mb-5 flex flex-col md:flex-row items-center gap-2 text-center md:text-left">
                    Запись на приём к лучшим врачам Алматы: {' '}
                    {/*<div className="bg-green-light-1 p-2 rounded-md">*/}
                    {/*    <span className="text-primary">100 545 врачей</span>*/}
                    {/*</div>*/}
                </div>

                <div className="hidden md:block w-full h-[250px] relative">
                    <Image src={addPercent} alt="" className="" fill/>
                </div>
                <div className="block md:hidden w-full h-[466px] relative">
                    <Image src={addPercentMobile} alt="" className="" fill/>
                </div>
            </div>
        </MaxWidthLayout>
    );
};
