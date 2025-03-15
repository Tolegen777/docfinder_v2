import React from 'react';
import Image from "next/image";
import addProcedure from '@/shared/assets/images/add_procedure_banner.png'
import addProcedureMobile from '@/shared/assets/images/add_procedure_mobile_banner.png'
import {MaxWidthLayout} from "@/shared/ui/MaxWidthLayout";

export const AddProcedureBanner = () => {
    return (
        <MaxWidthLayout>
            {/* Основной контейнер */}
            <div className="relative mb-6">
                <div className="hidden md:block w-full h-[250px] relative">
                    <Image src={addProcedure} alt="" className="" fill/>
                </div>
                <div className="block md:hidden w-full h-[466px] relative">
                    <Image src={addProcedureMobile} alt="" className="" fill/>
                </div>
            </div>
        </MaxWidthLayout>
    );
};
