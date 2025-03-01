import React from 'react';
import SpecialistsSelection from "../SpecialistsSelection/SpecialistsSelection";
import MapPreview from "../MapPreview/MapPreview";
import ClinicCard from "../ClinicCard/ClinicCard";
import ClinicsPage from "../ClinicsFilterPage/ClinicsFilterPage";

export const HomeClinicsContent = () => {
    return (
        <div>
            <SpecialistsSelection/>
            <MapPreview />
            <ClinicsPage />
        </div>
    );
};
