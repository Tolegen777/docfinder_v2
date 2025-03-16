import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import { useEffect, useState } from "react";
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

// Координаты центра Алматы
const ALMATY_CENTER = [43.238949, 76.889709];

interface MapComponentProps {
    isPreview?: boolean;
    selectedClinicId?: number;
    customCoordinates?: [number, number]; // Для прямого указания координат
    clinicName?: string; // Добавляем название клиники для отображения в попапе
    clinicAddress?: string; // Добавляем адрес клиники для отображения в попапе
}

interface ClinicMarker {
    id: number;
    name: string;
    address: string;
    position: [number, number];
}

const MapClinicComponent = ({
                                isPreview = false,
                                selectedClinicId,
                                customCoordinates,
                                clinicName = 'Клиника',
                                clinicAddress = ''
                            }: MapComponentProps) => {
    const queryClient = useQueryClient();
    const [customIcon, setCustomIcon] = useState<any>(null);
    const [selectedIcon, setSelectedIcon] = useState<any>(null);
    const [centerCoords, setCenterCoords] = useState<[number, number]>(
        customCoordinates || ALMATY_CENTER as [number, number]
    );
    const [clinicMarkers, setClinicMarkers] = useState<ClinicMarker[]>([]);

    // Получаем клиники из кэша React Query или формируем свои маркеры
    useEffect(() => {
        // Если есть кастомные координаты, используем их (страница деталей клиники)
        if (customCoordinates) {
            setClinicMarkers([{
                id: selectedClinicId || 999999,
                name: clinicName,
                address: clinicAddress,
                position: customCoordinates
            }]);
            setCenterCoords(customCoordinates);
            return;
        }

        // Иначе пытаемся получить клиники из кэша React Query (список клиник)
        const cachedData = queryClient.getQueriesData({
            queryKey: clinicKeys.lists()
        });

        if (cachedData && cachedData.length > 0) {
            const [, data] = cachedData[0];
            const clinics = (data as any)?.clinics || [];

            const markers = clinics
                .filter((clinic: any) => clinic.latitude && clinic.longitude)
                .map((clinic: any) => ({
                    id: clinic.id,
                    name: clinic.title,
                    address: clinic.address,
                    position: [
                        parseFloat(clinic.latitude),
                        parseFloat(clinic.longitude)
                    ] as [number, number]
                }));

            setClinicMarkers(markers);

            // Определяем центр карты
            if (markers.length > 0) {
                if (selectedClinicId) {
                    const selectedClinic = markers.find(c => c.id === selectedClinicId);
                    if (selectedClinic) {
                        setCenterCoords(selectedClinic.position);
                        return;
                    }
                }
                setCenterCoords(markers[0].position);
            }
        } else {
            // Если клиник нет в кэше и нет кастомных координат, используем фолбэк
            setClinicMarkers([{
                id: 1,
                name: 'Центр Алматы',
                address: 'Алматы',
                position: ALMATY_CENTER as [number, number]
            }]);
        }
    }, [queryClient, customCoordinates, selectedClinicId, clinicName, clinicAddress]);

    // Инициализируем иконки маркеров только один раз
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Убедимся, что Leaflet доступен
        try {
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

            setCustomIcon(icon);
            setSelectedIcon(selectedMarkerIcon);
        } catch (error) {
            console.error("Error initializing map icons:", error);
        }
    }, []);

    // Если в браузере, но иконки не готовы, показываем заглушку
    if (typeof window !== 'undefined' && (!customIcon || !selectedIcon)) {
        return <div className="w-full h-full bg-gray-100 animate-pulse rounded-xl" />;
    }

    // Если на сервере, возвращаем заглушку
    if (typeof window === 'undefined') {
        return <div className="w-full h-full bg-gray-100 rounded-xl" />;
    }

    const mapOptions = {
        zoom: isPreview ? 15 : 13,
        className: isPreview ? 'h-full w-full' : 'h-[80vh] w-full',
        zoomControl: !isPreview,
        dragging: !isPreview,
        scrollWheelZoom: !isPreview,
        attributionControl: !isPreview,
    };

    return (
        <MapContainer
            center={centerCoords as LatLngExpression}
            zoom={mapOptions.zoom}
            className={mapOptions.className}
            zoomControl={mapOptions.zoomControl}
            dragging={mapOptions.dragging}
            scrollWheelZoom={mapOptions.scrollWheelZoom}
            attributionControl={mapOptions.attributionControl}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {clinicMarkers.map((clinic) => (
                <Marker
                    key={clinic.id}
                    position={clinic.position}
                    icon={clinic.id === selectedClinicId ? selectedIcon : customIcon}
                >
                    {!isPreview && (
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-medium text-emerald-700">{clinic.name}</h3>
                                <p className="text-sm text-gray-600">{clinic.address || ''}</p>
                            </div>
                        </Popup>
                    )}
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapClinicComponent;
