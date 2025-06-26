'use client';

import React, { useState } from 'react';
import { useParams } from "next/navigation";
import { useQuery } from '@tanstack/react-query';
import { ProcedureDoctorsAPI } from '@/shared/api/procedureDoctorsApi';
import {UniversalDoctorsList} from "@/shared/ui/UniversalDoctorsList/UniversalDoctorsList";
import {PAGE_SIZE} from "@/shared/constants/common";

export const ProcedureDoctorsList = () => {
    const params = useParams();
    const procedureSlug = params?.slug as string;

    const [currentPage, setCurrentPage] = useState(1);

    const {data, isLoading} = useQuery({
        queryKey: ['procedureDoctors',  currentPage],
        queryFn: () => ProcedureDoctorsAPI.getProcedureDoctors({
            procedureSlug,
            page: currentPage,
            pageSize: PAGE_SIZE
        }),
        enabled: !!procedureSlug?.length
    });

    return (
        <UniversalDoctorsList
            data={data}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            isLoading={isLoading}
        />
    );
};
