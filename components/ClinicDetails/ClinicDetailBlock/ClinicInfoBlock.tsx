'use client'
import React from 'react';
import { MapPin } from 'lucide-react';
import { WeeklySchedule } from "@/components/ClinicDetails/ClinicDetailBlock/WeeklySchedule";
import { TimeStatus } from "@/shared/ui/TimeStatus/TimeStatus";

interface MapsLinks {
    yandex?: string;
    google?: string;
    "2gis"?: string;
}

interface WorkHour {
    day: string;
    time: string;
}

interface ClinicInfoBlockProps {
    address: string;
    metro?: string;
    busStop?: string;
    workHours: WorkHour[];
    mapsLinks?: MapsLinks;
    timeUntilClosing?: string;
    showFullSchedule?: boolean;
}

export const ClinicInfoBlock: React.FC<ClinicInfoBlockProps> = ({
                                                                    address,
                                                                    metro,
                                                                    busStop,
                                                                    workHours,
                                                                    mapsLinks,
                                                                    timeUntilClosing,
                                                                    showFullSchedule = true
                                                                }) => {
    // Проверяем наличие ссылок на карты
    const hasMapLinks = mapsLinks && (mapsLinks.yandex || mapsLinks.google || mapsLinks["2gis"]);

    return (
        <div className="bg-white rounded-xl overflow-hidden p-4 space-y-3 h-full">
            <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 shrink-0 text-emerald-600" />
                <p className="text-sm">{address}</p>
            </div>

            {timeUntilClosing && (
                <TimeStatus timeUntilClosing={timeUntilClosing}/>
            )}

            {/* Используем существующий компонент если есть рабочие часы */}
            {showFullSchedule && workHours && workHours.length > 0 && (
                <WeeklySchedule workHours={workHours} />
            )}

            {/* Добавим ссылки на карты, если они предоставлены */}
            {hasMapLinks && (
                <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm font-medium mb-2">Открыть на карте:</p>
                    <div className="flex flex-wrap gap-2">
                        {mapsLinks?.yandex && (
                            <a
                                href={mapsLinks.yandex}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                                Яндекс
                            </a>
                        )}
                        {mapsLinks?.google && (
                            <a
                                href={mapsLinks.google}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                                Google
                            </a>
                        )}
                        {mapsLinks?.["2gis"] && (
                            <a
                                href={mapsLinks["2gis"]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                                2GIS
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
