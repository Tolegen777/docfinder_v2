'use client'
import React from 'react';
import AnalysisCard from "@/components/AnalysisCard/AnalysisCard";
import {AnalysisFilters} from "@/components/AnalysisSection/AnalysisFilters";
import {CategorySidebar} from "@/components/AnalysisSection/CategorySidebar";

// Интерфейсы
interface IAnalysis {
    id: string;
    title: string;
    description: string;
    executionTime: string;
    location: string;
    material: string;
    testingLocation: string;
    labCount: number;
    price: number;
    expressPrice?: number;
}

export const AnalysisSection = () => {
    // Пример данных анализов
    const analyses: IAnalysis[] = [
        {
            id: '1',
            title: 'Эозинофильный катионный белок (ECP)',
            description: 'Эозинофильный катионный белок (ECP) – это высокотоксичный основной белок цитоплазматических гранул эозинофилов, которые костный мозг высвобождает в кровь. Циркулируя, они распространяются по тканям организма, где существуют некоторое время.',
            executionTime: '8-10 дней',
            location: 'В клинике, На дому',
            material: 'Кровь',
            testingLocation: '14 лабораторий',
            labCount: 14,
            price: 25000,
            expressPrice: 25000,
        },
        // Добавьте больше анализов...
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Фильтры */}
            <AnalysisFilters />

            {/* Основной контент */}
            <div className="flex gap-8 mt-8">
                {/* Боковое меню */}
                <div className="w-72 flex-shrink-0">
                    <CategorySidebar />
                </div>

                {/* Список анализов */}
                <div className="flex-1 space-y-4">
                    {analyses.map((analysis) => (
                        <AnalysisCard key={analysis.id} {...analysis} />
                    ))}
                </div>
            </div>
        </div>
    );
};
