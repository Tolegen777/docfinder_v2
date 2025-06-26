'use client';

import React, {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {DoctorsAPI} from '@/shared/api/doctorsApi';
import {useCityStore} from "@/shared/stores/cityStore";
import {UniversalDoctorsList} from "@/shared/ui/UniversalDoctorsList/UniversalDoctorsList";
import {PAGE_SIZE} from '@/shared/constants/common'

export const DoctorsList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const {currentCity} = useCityStore()

    const {data, isLoading} = useQuery({
        queryKey: ['doctors', currentCity?.id, currentPage],
        queryFn: () => DoctorsAPI.getDoctors(currentCity?.id as number, currentPage, PAGE_SIZE),
        enabled: !!currentCity?.id
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
