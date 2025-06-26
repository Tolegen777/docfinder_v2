'use client';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {Icon, LatLngExpression} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WeeklySchedule, ScheduleUtils } from '@/shared/api/doctorsApi';

interface DoctorClinicMapContentProps {
    weeklySchedule: WeeklySchedule[];
    doctorName: string;
    coords?: {
        latitude: number;
        longitude: number;
    };
    mapsLinks?: {
        google_maps: string;
        yandex_maps: string;
        "2gis": string;
        openstreetmap: string;
    };
}

const DoctorClinicMapContent: React.FC<DoctorClinicMapContentProps> = ({
                                                                           weeklySchedule,
                                                                           doctorName,
                                                                           coords,
                                                                           mapsLinks
                                                                       }) => {
    // Получаем уникальные клиники из расписания
    const uniqueClinics = weeklySchedule.reduce((acc, clinic) => {
        if (!acc.find(c => c.clinic_id === clinic.clinic_id)) {
            acc.push(clinic);
        }
        return acc;
    }, [] as WeeklySchedule[]);

    // Проверяем, есть ли клиники для отображения на карте
    if (uniqueClinics.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50">
                <p className="text-gray-500">Информация о местоположении клиник недоступна</p>
            </div>
        );
    }

    // Определяем центр карты
    const center: [number, number] = coords
        ? [coords.latitude, coords.longitude]
        : [43.238949, 76.889709]; // Координаты Алматы по умолчанию

    // Пользовательский маркер
    const clinicIcon = new Icon({
        iconUrl: '/clinic-marker.svg', // Путь к иконке маркера
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    // Запасной маркер, если основной не найден
    const defaultIcon = new Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });

    // Получаем доступные даты для отображения времени работы
    const getClinicAvailableTimes = (clinic: WeeklySchedule) => {
        const allTimes: string[] = [];
        clinic.schedules.forEach(schedule => {
            schedule.working_hours_list.forEach(hour => {
                allTimes.push(hour.time_slot_start_time.substring(0, 5));
            });
        });
        return [...new Set(allTimes)].sort();
    };

    return (
        <MapContainer
            center={center as LatLngExpression}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {uniqueClinics.map((clinic, index) => {
                const availableTimes = getClinicAvailableTimes(clinic);

                return (
                    <Marker
                        key={clinic.clinic_id}
                        position={center as LatLngExpression} // В реальном приложении нужно взять координаты из API
                        icon={defaultIcon}
                    >
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-medium text-base">{clinic.clinic_title}</h3>
                                <p className="text-sm mt-2">
                                    <strong>Врач:</strong> {doctorName}
                                </p>
                                {availableTimes.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm font-medium">Доступное время приема:</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {availableTimes.slice(0, 5).map((time, i) => (
                                                <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                                                    {time}
                                                </span>
                                            ))}
                                            {availableTimes.length > 5 && (
                                                <span className="text-xs text-gray-500">+{availableTimes.length - 5} еще</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {mapsLinks && (
                                    <div className="mt-3 flex gap-2">
                                        {mapsLinks.yandex_maps && (
                                            <a
                                                href={mapsLinks.yandex_maps}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"
                                            >
                                                Яндекс Карты
                                            </a>
                                        )}
                                        {mapsLinks.google_maps && (
                                            <a
                                                href={mapsLinks.google_maps}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100"
                                            >
                                                Google Maps
                                            </a>
                                        )}
                                        {mapsLinks["2gis"] && (
                                            <a
                                                href={mapsLinks["2gis"]}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100"
                                            >
                                                2ГИС
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default DoctorClinicMapContent;
