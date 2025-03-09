import {ReviewsList} from "@/components/ClinicDetails/Review/ReviewsList/ReviewsList";
import ClinicDetailsBlock from "@/components/ClinicDetails/ClinicDetailBlock/ClinicDetailsBlock";

export default function Clinic() {
    return (
        <div>
            <ClinicDetailsBlock/>
            <ReviewsList/>
        </div>
    );
}
