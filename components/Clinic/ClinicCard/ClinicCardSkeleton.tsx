import {Skeleton} from "@/components/shadcn/skeleton";
import React from "react";

export const ClinicCardSkeleton = () => (
    <div className="w-full p-4 md:p-6 bg-white rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-40">
                <Skeleton className="h-40 w-40 rounded-full mb-4" />
                <div className="space-y-2">
                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Skeleton key={i} className="h-5 w-5" />
                        ))}
                    </div>
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
            <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24 mt-2" />
                </div>
                <Skeleton className="h-10 w-full" />
                <div className="flex items-start gap-2">
                    <Skeleton className="h-5 w-5 flex-shrink-0" />
                    <div className="space-y-2 w-full">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="hidden md:block md:w-[350px] space-y-4">
                <Skeleton className="h-[200px] w-full rounded-lg" />
                <Skeleton className="h-10 w-full" />
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                        <div key={i} className="flex justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
