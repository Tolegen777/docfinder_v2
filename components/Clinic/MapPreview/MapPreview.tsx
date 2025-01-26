import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '../../shadcn/dialog';
import { X } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

const MapPreview = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-emerald-600 font-medium">20 клиник</span>
                    <span className="text-gray-900">в Алматы</span>
                </div>

                {/* Map Container */}
                <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden">
                    {!isOpen && (
                        <div className="absolute inset-0">
                            <MapComponent isPreview={true} />
                        </div>
                    )}

                    {/* Map Interaction Layer */}
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                               bg-white px-4 py-2 rounded-lg shadow-md
                               hover:bg-gray-50 transition-colors duration-200
                               text-gray-900 text-sm font-medium z-[400]">
                                Посмотреть на карте
                            </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl w-[90vw] h-[80vh] p-0">
                            <div className="relative h-full">
                                <MapComponent />
                                <DialogClose className="absolute top-4 right-4 z-[500]">
                                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50
                                   transition-colors duration-200">
                                        <X className="w-5 h-5 text-gray-600" />
                                    </button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default MapPreview;
