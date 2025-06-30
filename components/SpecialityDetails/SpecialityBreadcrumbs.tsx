'use client'

import React from 'react';
import Link from 'next/link';
import { MaxWidthLayout } from "@/shared/ui/MaxWidthLayout";

interface ProcedureBreadcrumbsProps {
    specialityName: string;
}

export const SpecialityBreadcrumbs: React.FC<ProcedureBreadcrumbsProps> = ({
                                                                              specialityName,
                                                                          }) => {
    return (
        <MaxWidthLayout className="my-4">
            <div className="flex text-sm text-gray-500 mb-2 items-center flex-wrap">
                <Link href="/" className="hover:text-emerald-600 transition-colors">
                    Главная
                </Link>
                {specialityName && (
                    <>
                        <span className="mx-2">•</span>
                        <span className="text-emerald-600">
                            {specialityName}
                        </span>
                    </>
                )}
            </div>
        </MaxWidthLayout>
    );
};
