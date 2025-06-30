import {HomeCarousel} from "@/components/HomeCarousel/HomeCarousel";
import {SpecialtiesSection} from "@/components/SpecialtiesSection/SpecialtiesSection";
import {AddDiscountBanner} from "@/components/AddBanner/AddDiscountBanner";
import {DoctorsList} from "@/components/DoctorsList/DoctorsList";
import {MaxWidthLayout} from "@/shared/ui/MaxWidthLayout";
import {AddSearchBanner} from "@/components/AddBanner/AddSearchBanner";
import React, {Suspense} from "react";

export default function Home() {
    return (
        <div>
            <MaxWidthLayout>
                <HomeCarousel/>
            </MaxWidthLayout>
            <Suspense fallback={<div className="h-screen animate-pulse bg-gray-100" />}>
                <SpecialtiesSection/>
            </Suspense>
            {/*<AddDiscountBanner />*/}
            <MaxWidthLayout>
                <div className="mt-2 mb-6">
                    <h2 className="h3-28-36-600 text-center md:text-left">
                        Врачи
                    </h2>
                </div>
                <DoctorsList />
            </MaxWidthLayout>
            {/*<AddSearchBanner/>*/}
        </div>
    );
}
