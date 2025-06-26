import {Skeleton} from "@/components/shadcn/skeleton";
import React from "react";

export const DoctorCardSkeleton = () => (
    <div className="w-full max-w-[1181px] p-4 md:p-5 bg-white rounded-lg border">
        <div className="flex flex-col lg:flex-row gap-5">
            {/* Left Column - Photo and Rating */}
            <div className="flex flex-row md:flex-col items-center space-y-2.5">
                <Skeleton className="w-[104px] h-[104px] rounded-full" />
                <div className="flex flex-col items-center gap-2">
                    <Skeleton className="w-[140px] h-4" />
                    <Skeleton className="w-[100px] h-4" />
                    <div className="flex space-x-0.5">
                        {Array(5).fill(0).map((_, i) => (
                            <Skeleton key={i} className="w-5 h-5 rounded-full" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Middle Column - Main Info */}
            <div className="flex-1 space-y-5">
                <Skeleton className="w-[60%] h-7 mb-2" />
                <Skeleton className="w-[80%] h-5" />
                <Skeleton className="w-[300px] h-10 rounded-lg" />

                <div className="space-y-2.5 md:max-w-[370px]">
                    {Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} className="w-full h-[60px] rounded-lg" />
                    ))}
                </div>

                <div className="space-y-2.5">
                    <Skeleton className="w-[200px] h-5" />
                    <Skeleton className="w-[300px] h-4" />
                </div>

                <div className="flex flex-wrap gap-2.5 flex-col md:flex-row">
                    <Skeleton className="w-[140px] h-10 rounded-lg" />
                    <Skeleton className="w-[140px] h-10 rounded-lg" />
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:w-[453px] space-y-5">
                <Skeleton className="w-[90%] h-8" />
                <div className="space-y-4">
                    <div className="flex border-b border-[#CBD5E1] pb-2">
                        {Array(3).fill(0).map((_, i) => (
                            <Skeleton key={i} className="w-[80px] h-6 mx-2" />
                        ))}
                    </div>
                    <div className="grid grid-cols-4 gap-5">
                        {Array(12).fill(0).map((_, i) => (
                            <Skeleton key={i} className="w-full h-[40px] rounded-lg" />
                        ))}
                    </div>
                    <Skeleton className="w-full h-[50px] rounded-lg" />
                </div>
            </div>
        </div>
    </div>
);
