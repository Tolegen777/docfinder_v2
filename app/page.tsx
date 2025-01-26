// import {HomeCarousel} from "@/components/HomeCarousel/HomeCarousel2";
import HomeCarousel from "../components/HomeCarousel/HomeCarousel";
import {SpecialtiesSection} from "@/components/SpecialtiesSection/SpecialtiesSection";
import DiscountBanner from "../components/DiscountBanner/DiscountBanner";
import {DoctorsList} from "../components/DoctorsList/DoctorsList";
import AppointmentCard from "../components/DoctorsList/AppointmentCard/AppointmentCard";
import NotFoundSection from "../components/DoctorsList/NotFoundSection/NotFoundSection";

export default function Home() {
    return (
        <div>
            <HomeCarousel/>
            <SpecialtiesSection/>
            <DiscountBanner />
            <DoctorsList />
            <AppointmentCard/>
            <NotFoundSection/>
        </div>
    );
}
