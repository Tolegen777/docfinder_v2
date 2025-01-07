import React from 'react';
import {Search} from 'lucide-react';
import {Button} from '@/components/shadcn/button';
import {AnalysisSection} from "@/components/AnalysisSection/AnalysisSection";
import {useServicesStore} from "@/stores/useServicesStore";
import {ServiceNav} from "@/components/ServicesSection/ServiceNav";
import {DiagnosticsNav} from "@/components/ServicesSection/DiagnosticsNav";
import {AlphabeticalServices} from "@/components/ServicesSection/AlphabeticalServices";
import {CategoryServices} from "@/components/ServicesSection/CategoryServices";

const SearchBar = () => (
    <div className="relative">
        <input
            type="text"
            placeholder="Поиск по услугам"
            className="w-full px-4 py-2 rounded-md border border-gray-200 bg-green-50 focus:outline-none focus:border-green-500"
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
    </div>
);


export const ServicesSection = () => {

    const { activeCategory, activeSubCategory } = useServicesStore();

    // Пример данных для МРТ
    const mrtServices = [
        {
            title: 'МРТ головы',
            items: [
                { name: 'МРТ головного мозга', href: '#' },
                { name: 'МРТ сосудов головного мозга', href: '#' },
                { name: 'МРТ пазух носа', href: '#' },
                { name: 'МРТ гипофиза', href: '#' },
                { name: 'МРТ орбит глаз', href: '#' },
            ]
        },
        {
            title: 'МРТ позвоночника',
            items: [
                { name: 'МРТ всего тела', href: '#' },
                { name: 'МРТ крестцового отдела позвоночника', href: '#' },
                { name: 'МРТ спинного мозга', href: '#' },
                { name: 'МРТ шейного отдела позвоночника', href: '#' },
            ]
        },
        {
            title: 'МРТ суставов',
            items: [
                { name: 'МРТ коленного сустава', href: '#' },
                { name: 'МРТ локтевого сустава', href: '#' },
                { name: 'МРТ плечевого сустава', href: '#' },
            ]
        },
        {
            title: 'МРТ органов малого таза',
            items: [
                { name: 'МРТ матки', href: '#' },
                { name: 'МРТ мочевого пузыря', href: '#' },
                { name: 'МРТ простаты', href: '#' },
            ]
        },
        {
            title: 'МРТ с контрастом',
            items: [
                { name: 'МРТ головного мозга с контрастом', href: '#' },
                { name: 'МРТ позвоночника с контрастом', href: '#' },
                { name: 'МРТ суставов с контрастом', href: '#' },
            ]
        },
    ];

    const renderContent = () => {
        switch (activeCategory) {
            case 'analysis':
                return <AnalysisSection />;
            case 'diagnostics':
                return activeSubCategory === 'mrt' ? (
                    <CategoryServices services={mrtServices} category="mrt" />
                ) : (
                    // Другой контент для диагностики
                    <div>Другой контент диагностики</div>
                );
            default:
                return (
                    <AlphabeticalServices />
                );
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ServiceNav />
            {activeCategory === 'diagnostics' && <DiagnosticsNav />}

            {/* Поиск и кнопка записи */}
            <div className="flex gap-4 items-center my-6">
                <div className="flex-1 max-w-xl">
                    <SearchBar />
                </div>
                <Button className="bg-green-500 hover:bg-green-600 text-white whitespace-nowrap">
                    Записаться онлайн
                </Button>
            </div>

            {/* Контент */}
            {renderContent()}
        </div>
    );
};
