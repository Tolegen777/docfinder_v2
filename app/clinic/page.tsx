import {ClinicHeader} from "@/components/ClinicDetails/ClinicHeader/ClinicHeader";
import {MapWithContainer} from "@/components/ClinicDetails/MapWithContainer/MapWithContainer";
import {ReviewsList} from "@/components/Review/ReviewsList/ReviewsList";

export default function Clinic() {
    return (
        <div>
            <ClinicHeader/>
            <MapWithContainer/>
            <ReviewsList/>
        </div>
    );
}
