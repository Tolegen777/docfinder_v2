'use client'
import React from 'react';
import {usePathname, useSearchParams} from 'next/navigation';
import {Activity, Building2, Factory, Stethoscope, User2} from 'lucide-react';
import {ServicesSection} from "../ServicesSection/ServicesSection";
import {HomeClinicsContent} from "@/components/ClinicList/HomeClinicsContent/HomeClinicsContent";
import {MaxWidthLayout} from "@/shared/ui/MaxWidthLayout";
import {NavItem} from "@/components/SpecialtiesSection/NavItem";
import {HomeSpecialties} from "@/components/SpecialtiesSection/HomeSpecialties";

const PlaceholderContent = ({ text }: { text: string }) => (
    <div className="flex items-center justify-center h-96">
        <h2 className="text-2xl text-gray-500">{text}</h2>
    </div>
);

export const SpecialtiesSection = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get current tab and specialty from URL
    const currentTab = searchParams?.get('tab') || 'specialists';

    const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams ?? {});
        params.set(name, value);
        return params.toString();
    };

    const renderContent = () => {
        switch (currentTab) {
            case 'specialists':
                return <HomeSpecialties />;
            case 'services':
                return <ServicesSection />;
            case 'clinics':
                return <HomeClinicsContent />;
            case 'symptoms':
                return <PlaceholderContent text="Страница симптомов в разработке" />;
            case 'diseases':
                return <PlaceholderContent text="Страница заболеваний в разработке" />;
            default:
                return null;
        }
    };

    return (
        <MaxWidthLayout className="py-10">
            {/* Navigation */}
            <div className="flex gap-4 overflow-x-auto pb-4 mb-8 no-scrollbar">
                <NavItem
                    icon={User2}
                    text="Специалисты"
                    active={currentTab === 'specialists'}
                    href={`${pathname}?${createQueryString('tab', 'specialists')}`}
                />
                <NavItem
                    icon={Stethoscope}
                    text="Услуги"
                    active={currentTab === 'services'}
                    href={`${pathname}?${createQueryString('tab', 'services')}`}
                />
                <NavItem
                    icon={Building2}
                    text="Клиники"
                    active={currentTab === 'clinics'}
                    href={`${pathname}?${createQueryString('tab', 'clinics')}`}
                />
                {/*<NavItem*/}
                {/*    icon={Activity}*/}
                {/*    text="Симптомы"*/}
                {/*    active={currentTab === 'symptoms'}*/}
                {/*    href={`${pathname}?${createQueryString('tab', 'symptoms')}`}*/}
                {/*/>*/}
                {/*<NavItem*/}
                {/*    icon={Factory}*/}
                {/*    text="Заболевания"*/}
                {/*    active={currentTab === 'diseases'}*/}
                {/*    href={`${pathname}?${createQueryString('tab', 'diseases')}`}*/}
                {/*/>*/}
            </div>

            {/* Content */}
            {renderContent()}
        </MaxWidthLayout>
    );
};


