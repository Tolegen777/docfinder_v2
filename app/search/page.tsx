'use client';

import React, { Suspense } from 'react';
import {SearchPageContent} from "@/components/Search";

export default function SearchPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Загрузка...</p>
                    </div>
                </div>
            }
        >
            <SearchPageContent />
        </Suspense>
    );
}
