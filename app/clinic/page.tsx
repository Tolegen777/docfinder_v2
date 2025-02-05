// import ClinicDetails from "../../components/ClinicDetails/ClinicDetails";
import ClinicHeader from "../../components/ClinicDetails/ClinicHeader/ClinicHeader";
import ClinicContent from "../../components/ClinicDetails/AboutSection/AboutSection";
import MapWithContainer from "../../components/ClinicDetails/MapWithContainer/MapWithContainer";
// import ReviewCardExample from "../../components/Review/ReviewCardExample/ReviewCardExample";
import ReviewsList from "../../components/Review/ReviewsList/ReviewsList";

export default function Home() {
    return (
        <div>
            {/*<ClinicDetails/>*/}
            <ClinicHeader/>
            <ClinicContent/>
            <MapWithContainer/>
            <ReviewsList/>
        </div>
    );
}
