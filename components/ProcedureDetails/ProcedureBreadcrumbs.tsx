'use client'

import React from 'react';
import Link from 'next/link';
import { MaxWidthLayout } from "@/shared/ui/MaxWidthLayout";

interface ProcedureBreadcrumbsProps {
    procedureName: string;
}

export const ProcedureBreadcrumbs: React.FC<ProcedureBreadcrumbsProps> = ({
                                                                              procedureName,
                                                                          }) => {
    return (
        <MaxWidthLayout>
            <div className="flex text-sm text-gray-500 mb-2 items-center flex-wrap">
                <Link href="/" className="hover:text-emerald-600 transition-colors">
                    Главная
                </Link>
                {procedureName && (
                    <>
                        <span className="mx-2">•</span>
                        <span className="text-emerald-600">
                            {procedureName}
                        </span>
                    </>
                )}
            </div>
        </MaxWidthLayout>
    );
};
