import React from 'react';
import SpecialistsSelection from "../SpecialistsSelection/SpecialistsSelection";
import {ClinicsListPage} from "../ClinicsFilterPage/ClinicsListPage";

export const HomeClinicsContent = () => {
    return (
        <div>
            <SpecialistsSelection/>
            <ClinicsListPage />
        </div>
    );
};
