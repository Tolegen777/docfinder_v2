import {HomeCarousel} from "@/components/HomeCarousel/HomeCarousel";
import {SpecialtiesSection} from "@/components/SpecialtiesSection/SpecialtiesSection";
import {AddDiscountBanner} from "@/components/AddBanner/AddDiscountBanner";
import {DoctorsList} from "@/components/DoctorsList/DoctorsList";
import {MaxWidthLayout} from "@/shared/ui/MaxWidthLayout";
import {AddSearchBanner} from "@/components/AddBanner/AddSearchBanner";
import {Suspense} from "react";

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
                <DoctorsList />
            </MaxWidthLayout>
            {/*<AddSearchBanner/>*/}
        </div>
    );
}
