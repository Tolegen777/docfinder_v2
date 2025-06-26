// app/specialities/[slug]/page.tsx
import React from 'react';
import {SpecialityDetailPage} from "@/components/SpecialityDetails/SpecialityDetailPage";
import {MaxWidthLayout} from "@/shared/ui/MaxWidthLayout";

export const metadata = {
    title: 'Врачи-специалисты | DocFinder.kz',
    description: 'Найдите врача нужной специальности в DocFinder.kz',
};

export default function SpecialityPage() {
    return <MaxWidthLayout>
        <SpecialityDetailPage/>
    </MaxWidthLayout>;
}
