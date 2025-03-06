import React from 'react';
import SpecialistsSelection from "../SpecialistsSelection/SpecialistsSelection";
import ClinicsPage from "../ClinicsFilterPage/ClinicsFilterPage";

export const HomeClinicsContent = () => {
    return (
        <div>
            <SpecialistsSelection/>
            <ClinicsPage />
        </div>
    );
};
