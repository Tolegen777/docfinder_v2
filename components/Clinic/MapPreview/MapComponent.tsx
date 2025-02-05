import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {useEffect, useState} from "react";

// Динамически импортируем компоненты карты
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

// Координаты центра Алматы
const ALMATY_CENTER = [43.238949, 76.889709];

// Моковые данные клиник
const clinics = [
    { id: 1, name: 'Клиника 1', position: [43.238949, 76.889709] },
    { id: 2, name: 'Клиника 2', position: [43.235949, 76.892709] },
    { id: 3, name: 'Клиника 3', position: [43.240949, 76.885709] },
    { id: 4, name: 'Клиника 4', position: [43.233949, 76.888709] },
    { id: 5, name: 'Клиника 5', position: [43.236949, 76.891709] },
];

const MapComponent = ({ isPreview = false }) => {
    const [customIcon, setCustomIcon] = useState(null);

    useEffect(() => {
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="w-6 h-6 bg-white rounded-full border-2 border-emerald-600 flex items-center justify-center">
               <div class="w-2 h-2 bg-emerald-600 rounded-full"></div>
             </div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setCustomIcon(icon);
    }, []);

    if (typeof window === 'undefined' || !customIcon) return null;

    return (
        <MapContainer
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            center={ALMATY_CENTER}
            zoom={isPreview ? 12 : 13}
            className={isPreview ? 'h-full w-full' : 'h-[80vh] w-full'}
            zoomControl={!isPreview}
            dragging={!isPreview}
            scrollWheelZoom={!isPreview}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {clinics.map((clinic) => (
                <Marker
                    key={clinic.id}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    position={clinic.position}
                    icon={customIcon}
                >
                    <Popup>{clinic.name}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
