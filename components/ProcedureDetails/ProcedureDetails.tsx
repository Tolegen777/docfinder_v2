'use client'

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { ProcedureBreadcrumbs } from "@/components/ProcedureDetails/ProcedureBreadcrumbs";
import { AddProcedureBanner } from "@/components/ProcedureDetails/AddProcedureBanner";
import { ProcedureDescription } from "@/components/ProcedureDetails/ProcedureDescription";
import { Skeleton } from '@/components/shadcn/skeleton';
import {ProcedureDetailsAPI} from "@/shared/api/procedureDetailsApi";

export const ProcedureDetails = () => {
    const params = useParams();
    const procedureSlug = params?.slug as string;

    const { data, isLoading, error } = useQuery({
        queryKey: ['procedure', procedureSlug],
        queryFn: () => ProcedureDetailsAPI.getProcedureDetails(procedureSlug),
        enabled: !!procedureSlug,
    });

    if (isLoading) {
        return (
            <div>
                <Skeleton className="h-8 w-64 mb-4" />
                <Skeleton className="h-64 w-full mb-6" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Произошла ошибка при загрузке данных</h2>
                <p className="text-gray-600">Пожалуйста, попробуйте позже или выберите другую процедуру</p>
            </div>
        );
    }

    return (
        <div>
            <ProcedureBreadcrumbs procedureName={data.medical_procedure_title} />
            <AddProcedureBanner />
            <ProcedureDescription descriptions={data.descriptions} />
        </div>
    );
};
