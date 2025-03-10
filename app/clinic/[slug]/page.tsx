import {ReviewsList} from "@/components/ClinicDetails/Review/ReviewsList/ReviewsList";
import ClinicDetailsBlock from "@/components/ClinicDetails/ClinicDetailBlock/ClinicDetailsBlock";
import {ClinicDoctorsList} from "@/components/ClinicDetails/ClinicDoctorsList/ClinicDoctorsList";

export default function Clinic() {
    return (
        <div>
            <ClinicDetailsBlock/>
            <ClinicDoctorsList/>
            <ReviewsList/>
        </div>
    );
}
