'use client'
import React from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Динамический импорт компонентов карты
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

// Координаты клиники Эмирмед
const CLINIC_POSITION = [43.238949, 76.889709];

const ClinicMap = () => {
    // Создаем кастомную иконку для маркера
    React.useEffect(() => {
        // Удаляем стандартные стили маркера
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0id2hpdGUiIHN0cm9rZT0iIzEwQjk4MSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNCIgZmlsbD0iIzEwQjk4MSIvPjwvc3ZnPg==',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -12],
        });
    }, []);

    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <MapContainer
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            center={CLINIC_POSITION}
            zoom={17}
            className="w-full h-full"
            zoomControl={false}
            attributionControl={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/*// @ts-expect-error*/}
            <Marker position={CLINIC_POSITION}>
                <Popup>
                    Эмирмед
                    <br />
                    улица Абдуллы Розыбакиева, 37В
                </Popup>
            </Marker>
        </MapContainer>
    );
};

// Контейнер для карты с фиксированной высотой
const MapWithContainer = () => (
    <div className="w-full h-[200px] rounded-xl overflow-hidden">
        <ClinicMap />
    </div>
);

export default MapWithContainer;
