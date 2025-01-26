'use client'
import React from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { LayoutGrid, LayoutList, User2, Stethoscope, Building2, Activity, Factory } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {ServicesSection} from "../ServicesSection/ServicesSection";
import {HomeClinicsContent} from "../Clinic/HomeClinicsContent/HomeClinicsContent";

const NavItem = ({
                     icon: Icon,
                     text,
                     active = false,
                     href
                 }: {
    icon: React.ElementType;
    text: string;
    active?: boolean;
    href: string;
}) => (
    <Link
        href={href}
        scroll={false}
        className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-full transition-colors",
            active
                ? "bg-green-100 text-green-600"
                : "bg-white hover:bg-gray-50"
        )}
    >
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{text}</span>
    </Link>
);

// ViewToggle component remains the same
const ViewToggle = ({
                        view,
                        onViewChange
                    }: {
    view: 'grid' | 'list';
    onViewChange: (view: 'grid' | 'list') => void;
}) => (
    <div className="flex items-center gap-4 border-b pb-4">
        <button
            onClick={() => onViewChange('list')}
            className={cn(
                "flex items-center gap-2",
                view === 'list' ? "text-green-600" : "text-gray-600"
            )}
        >
            <LayoutList className="w-5 h-5" />
            <span>Списком</span>
        </button>
        <button
            onClick={() => onViewChange('grid')}
            className={cn(
                "flex items-center gap-2",
                view === 'grid' ? "text-green-600" : "text-gray-600"
            )}
        >
            <LayoutGrid className="w-5 h-5" />
            <span>Плиткой</span>
        </button>
    </div>
);

const SpecialtyCard = ({
                           icon: Icon,
                           name,
                           active = false,
                           href
                       }: {
    icon: React.ElementType;
    name: string;
    active?: boolean;
    href: string;
}) => (
    <Link
        href={href}
        scroll={false}
        className={cn(
            "flex flex-col items-center justify-center p-6 rounded-2xl transition-colors",
            active ? "bg-green-500 text-white" : "bg-white hover:bg-gray-50"
        )}
    >
        <Icon className={cn(
            "w-8 h-8 mb-2",
            active ? "text-white" : "text-green-500"
        )} />
        <span className="text-sm font-medium">{name}</span>
    </Link>
);

const specialties = [
    { id: 'gynecologist', name: 'Гинеколог', icon: User2 },
    { id: 'dermatologist', name: 'Дерматолог', icon: User2 },
    { id: 'ent', name: 'Лор', icon: User2 },
    { id: 'neurologist', name: 'Невролог', icon: User2 },
    { id: 'urologist', name: 'Уролог', icon: User2 },
    { id: 'psychiatrist', name: 'Психиатр', icon: User2 },
    { id: 'psychotherapist', name: 'Психотерапевт', icon: User2 },
    { id: 'gastroenterologist', name: 'Гастроэнтолог', icon: User2 },
    { id: 'therapist', name: 'Терапевт', icon: User2 },
    { id: 'proctologist', name: 'Проктолог', icon: User2 },
    { id: 'trichologist', name: 'Трихолог', icon: User2 },
    { id: 'ophthalmologist', name: 'Окулист', icon: User2 },
    { id: 'endocrinologist', name: 'Эндокринолог', icon: User2 },
    { id: 'traumatologist', name: 'Травматолог', icon: User2 },
    { id: 'psychologist', name: 'Психолог', icon: User2 },
    { id: 'surgeon', name: 'Хирург', icon: User2 },
    { id: 'cardiologist', name: 'Кардиолог', icon: User2 },
    { id: 'mammologist', name: 'Маммолог', icon: User2 },
];

const PlaceholderContent = ({ text }: { text: string }) => (
    <div className="flex items-center justify-center h-96">
        <h2 className="text-2xl text-gray-500">{text}</h2>
    </div>
);

export const SpecialtiesSection = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [view, setView] = React.useState<'grid' | 'list'>('grid');

    // Get current tab and specialty from URL
    const currentTab = searchParams?.get('tab') || 'specialists';
    const currentSpecialty = searchParams?.get('specialty') || specialties[0].id;

    const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams ?? {});
        params.set(name, value);
        return params.toString();
    };

    const renderContent = () => {
        switch (currentTab) {
            case 'specialists':
                return (
                    <>
                        <ViewToggle view={view} onViewChange={setView} />

                        <div className="mt-8 mb-6">
                            <h2 className="text-2xl font-semibold">
                                Популярные специальности{' '}
                                <span className="text-green-500">для взрослых</span>
                            </h2>
                        </div>

                        <div className={cn(
                            "grid gap-4",
                            view === 'grid' ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-6" : "grid-cols-1"
                        )}>
                            {specialties.map((specialty) => (
                                <SpecialtyCard
                                    key={specialty.id}
                                    icon={specialty.icon}
                                    name={specialty.name}
                                    active={specialty.id === currentSpecialty}
                                    href={`${pathname}?${createQueryString('specialty', specialty.id)}`}
                                />
                            ))}
                        </div>
                    </>
                );
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
        <div className="container mx-auto px-4 py-8">
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
                <NavItem
                    icon={Activity}
                    text="Симптомы"
                    active={currentTab === 'symptoms'}
                    href={`${pathname}?${createQueryString('tab', 'symptoms')}`}
                />
                <NavItem
                    icon={Factory}
                    text="Заболевания"
                    active={currentTab === 'diseases'}
                    href={`${pathname}?${createQueryString('tab', 'diseases')}`}
                />
            </div>

            {/* Content */}
            {renderContent()}
        </div>
    );
};
