import React from 'react';
import {SpecialistsSelection} from "../SpecialistsSelection/SpecialistsSelection";
import {ClinicsListPage} from "@/components/ClinicList/ClinicsListPage/ClinicsListPage";

export const HomeClinicsContent = () => {
    return (
        <div>
            <SpecialistsSelection/>
            <ClinicsListPage />
        </div>
    );
};
