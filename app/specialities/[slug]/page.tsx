// app/specialities/[slug]/page.tsx
import React from 'react';
import SpecialityDetailPage from "@/components/SpecialityDetails/SpecialityDetailPage";

export const metadata = {
    title: 'Врачи-специалисты | DocFinder.kz',
    description: 'Найдите врача нужной специальности в DocFinder.kz',
};

export default function SpecialityPage() {
    return <SpecialityDetailPage />;
}
