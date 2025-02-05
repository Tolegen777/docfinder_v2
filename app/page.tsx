'use client'
import {HomeCarousel} from "@/components/HomeCarousel/HomeCarousel";
import {SpecialtiesSection} from "@/components/SpecialtiesSection/SpecialtiesSection";
import {AddDiscountBanner} from "@/components/AddBanner/AddDiscountBanner";
import {DoctorsList} from "@/components/DoctorsList/DoctorsList";
import {MaxWidthLayout} from "@/shared/ui/MaxWidthLayout";
import {AddSearchBanner} from "@/components/AddBanner/AddSearchBanner";

export default function Home() {
    return (
        <div>
            <MaxWidthLayout>
                <HomeCarousel/>
            </MaxWidthLayout>
            <SpecialtiesSection/>
            <AddDiscountBanner />
            <DoctorsList />
            <AddSearchBanner/>
        </div>
    );
}
