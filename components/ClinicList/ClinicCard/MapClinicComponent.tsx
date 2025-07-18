import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState, useMemo } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { clinicKeys } from '@/shared/api/queries/clinicQueries';

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

// Координаты центра Шымкента
const SHYMKENT_CENTER = [42.300000, 69.600000];

interface MapComponentProps {
    isPreview?: boolean;
    selectedClinicId?: number;
    customMarkers?: Array<{
        id: number;
        name: string;
        address: string;
        position: [number, number];
    }>;
}

const MapClinicComponent = ({ isPreview = false, selectedClinicId, customMarkers }: MapComponentProps) => {
    // Use React Query's cache to get the current clinics
    const queryClient = useQueryClient();
    const cachedData = queryClient.getQueriesData({
        queryKey: clinicKeys.lists()
    });

    const [customIcon, setCustomIcon] = useState(null);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [centerCoords, setCenterCoords] = useState(SHYMKENT_CENTER);

    // Extract clinics from the cache or use customMarkers if provided
    const clinicMarkers = useMemo(() => {
        // If customMarkers are provided, use them instead of cache
        if (customMarkers && customMarkers.length > 0) {
            return customMarkers;
        }

        // Otherwise use the existing cache logic
        if (cachedData && cachedData.length > 0) {
            const [, data] = cachedData[0];
            const clinics = (data as any)?.clinics || [];

            return clinics
                .filter(clinic => clinic.latitude && clinic.longitude) // Убеждаемся, что у клиники есть координаты
                .map(clinic => ({
                    id: clinic.id,
                    name: clinic.title || clinic.cardProps?.name,
                    address: clinic.address || clinic.cardProps?.address,
                    position: [
                        parseFloat(clinic.latitude),
                        parseFloat(clinic.longitude)
                    ] as [number, number]
                }));
        }
        return [];
    }, [cachedData, customMarkers]);

    // Определяем центр карты на основе клиник
    useEffect(() => {
        if (clinicMarkers.length > 0) {
            // Если выбрана конкретная клиника, центрируем на ней
            if (selectedClinicId) {
                const selectedClinic = clinicMarkers.find(c => c.id === selectedClinicId);
                if (selectedClinic) {
                    setCenterCoords(selectedClinic.position);
                    return;
                }
            }

            // Иначе центрируем на всех клиниках
            // Для простоты используем первую клинику как центр
            setCenterCoords(clinicMarkers[0].position);
        }
    }, []);

    // Инициализируем иконки маркеров только один раз
    useEffect(() => {
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="w-6 h-6 bg-white rounded-full border-2 border-emerald-600 flex items-center justify-center">
               <div class="w-2 h-2 bg-emerald-600 rounded-full"></div>
             </div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        });

        const selectedMarkerIcon = L.divIcon({
            className: 'selected-marker',
            html: `<div class="w-8 h-8 bg-white rounded-full border-2 border-emerald-600 flex items-center justify-center">
               <div class="w-3 h-3 bg-emerald-600 rounded-full"></div>
             </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setCustomIcon(icon);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setSelectedIcon(selectedMarkerIcon);
    }, []);

    if (typeof window === 'undefined' || !customIcon || !selectedIcon) return null;

    // Если нет координат, используем моковые данные для Шымкента
    const markersToRender = clinicMarkers.length > 0 ? clinicMarkers : [
        { id: 1, name: 'Центр Шымкента', address: 'Шымкент', position: SHYMKENT_CENTER as [number, number] }
    ];

    // @ts-ignore
    return (
        <MapContainer
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            center={centerCoords}
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
            {markersToRender.map((clinic) => (
                <Marker
                    key={clinic.id}
                    position={clinic?.position}
                    icon={clinic.id === selectedClinicId ? selectedIcon : customIcon}
                >
                    <Popup>
                        <div className="p-1">
                            <h3 className="font-medium text-emerald-700">{clinic.name}</h3>
                            <p className="text-sm text-gray-600">{clinic.address || ''}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapClinicComponent;
