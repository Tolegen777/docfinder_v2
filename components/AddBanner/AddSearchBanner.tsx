import React from 'react';
import Image from "next/image";
import addSearch from '@/shared/assets/images/add_search.png'
import addSearchMobile from '@/shared/assets/images/add_search_mobile.png'
import {MaxWidthLayout} from "@/shared/ui/MaxWidthLayout";

export const AddSearchBanner = () => {
    return (
        <MaxWidthLayout>
            {/* Основной контейнер */}
            <div className="relative mb-6">
                <div className="hidden md:block w-full h-[250px] relative">
                    <Image src={addSearch} alt="" className="" fill/>
                </div>
                <div className="block md:hidden w-full h-[466px] relative">
                    <Image src={addSearchMobile} alt="" className="" fill/>
                </div>
            </div>
        </MaxWidthLayout>
    );
};
