// components/SpecialtiesSection/AlphabeticalServices.tsx
import Link from "next/link";
import React from "react";
import { SpecialtyGroup } from "@/shared/api/specialtiesApi";

interface AlphabeticalServicesProps {
    specialtyGroups: SpecialtyGroup[];
}

export const AlphabeticalServices = ({ specialtyGroups }: AlphabeticalServicesProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-8">
            {specialtyGroups.map(({ letter, specialities }) => (
                <div key={letter} className="space-y-4">
                    <h3 className="h4-20-24-600">{letter}</h3>
                    <div className="space-y-2">
                        {specialities.map((specialty) => (
                            <Link
                                key={specialty.id}
                                href={`/specialities/${specialty.slug}`}
                                className="flex gap-2 group p-14-18-400"
                            >
                                <span className="text-blue-500 group-hover:text-blue-600 transition-colors duration-200">
                                    {specialty.title}
                                </span>
                                {specialty.doctor_count > 0 && (
                                    <span className="text-gray-500">
                                        {specialty.doctor_count}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
