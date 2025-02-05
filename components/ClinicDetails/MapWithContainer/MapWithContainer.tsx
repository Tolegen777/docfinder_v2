'use client'
import React from 'react';
import {MaxWidthLayout} from "@/shared/ui/MaxWidthLayout";
import dynamic from "next/dynamic";

const ClinicMap = dynamic(() => import('./ClinicMap'), {
    ssr: false,
    loading: () => <div className="w-full h-[400px] bg-gray-100 animate-pulse" />
});

// Контейнер для карты с фиксированной высотой
const MapWithContainer = () => (
    <MaxWidthLayout className="w-full h-[400px] rounded-xl overflow-hidden">
        <ClinicMap />
    </MaxWidthLayout>
);

export default MapWithContainer;
