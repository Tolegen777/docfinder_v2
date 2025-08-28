import ClinicDetailsBlock from "@/components/ClinicDetails/ClinicDetailBlock/ClinicDetailsBlock";
import {ClinicDoctorsList} from "@/components/ClinicDetails/ClinicDoctorsList/ClinicDoctorsList";
// import {ReviewsList} from "@/shared/ui/Reviews/ReviewsList";

export default function Clinic() {
    return (
        <div>
            <ClinicDetailsBlock/>
            <ClinicDoctorsList/>
            {/*<ReviewsList type="clinic" showClinicLink={false} />*/}
        </div>
    );
}
