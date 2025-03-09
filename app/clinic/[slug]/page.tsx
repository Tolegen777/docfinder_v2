import {MapWithContainer} from "@/components/ClinicDetails/MapWithContainer/MapWithContainer";
import {ReviewsList} from "@/components/Review/ReviewsList/ReviewsList";
import ClinicDetailsPage from "@/components/ClinicDetails/ClinicHeader/ClinicDetailsPage";

export default function Clinic() {
    return (
        <div>
            <ClinicDetailsPage/>
            <MapWithContainer/>
            <ReviewsList/>
        </div>
    );
}
