import {ClinicHeader} from "@/components/ClinicDetails/ClinicHeader/ClinicHeader";
import {AboutSection} from "@/components/ClinicDetails/AboutSection/AboutSection";
import {MapWithContainer} from "@/components/ClinicDetails/MapWithContainer/MapWithContainer";
import {ReviewsList} from "@/components/Review/ReviewsList/ReviewsList";

export default function Clinic() {
    return (
        <div>
            <ClinicHeader/>
            <AboutSection/>
            <MapWithContainer/>
            <ReviewsList/>
        </div>
    );
}
