import { Metadata } from 'next';
import React from "react";

export const metadata: Metadata = {
    title: 'Поиск - DocFinder',
    description: 'Поиск врачей, процедур и клиник в вашем городе',
};

export default function SearchLayout({
                                         children,
                                     }: {
    children: React.ReactNode;
}) {
    return <div>{children}</div>;
}
