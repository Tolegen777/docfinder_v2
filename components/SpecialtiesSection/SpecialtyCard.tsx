// components/SpecialtiesSection/SpecialtyCard.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import { getSpecialtyIcon } from "@/shared/constants/specialtyIcons";

interface SpecialtyCardProps {
    slug: string;
    name: string;
    active?: boolean;
    doctorCount?: number;
}

export const SpecialtyCard = ({
                                  slug,
                                  name,
                                  active = false,
                                  doctorCount,
                              }: SpecialtyCardProps) => {
    const icon = getSpecialtyIcon(slug);

    return (
        <Link
            href={`/specialities/${slug}`}
            scroll={false}
            className={cn(
                "flex flex-col items-center justify-center p-6 rounded-2xl transition-colors border border-gray-300",
                active ? "bg-primary text-white border-primary" : "bg-white hover:bg-gray-50"
            )}
        >
            <Image
                src={icon}
                alt={name}
                className={cn(
                    "size-12 mb-2",
                    active ? "text-white [&>path]:fill-white" : "text-primary"
                )}
            />
            <span className="p-16-24-400">{name}</span>
            {doctorCount !== undefined && (
                <span className="text-sm text-gray-500">
                    {doctorCount} врачей
                </span>
            )}
        </Link>
    );
};
