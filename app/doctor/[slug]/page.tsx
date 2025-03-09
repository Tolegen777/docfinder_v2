import {ReviewsList} from "@/components/DoctorDetail/Review/ReviewsList/ReviewsList";
import DoctorDetailPage from "@/components/DoctorDetail/DoctorDetailPage";

export default function Doctor() {
    return (
        <div>
            <DoctorDetailPage />
            <ReviewsList />
        </div>
    );
}
