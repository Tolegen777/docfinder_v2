import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L, {LatLngExpression} from 'leaflet';
import { useEffect, useState, useMemo } from "react";
import { useClinicsStore } from '@/shared/stores/clinicsStore';

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
    customCoordinates?: [number, number]; // Добавлено для прямого указания координат
}

const MapClinicComponent = ({
                                isPreview = false,
                                selectedClinicId,
                                customCoordinates
                            }: MapComponentProps) => {
    const { filteredClinics } = useClinicsStore();
    const [customIcon, setCustomIcon] = useState(null);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [centerCoords, setCenterCoords] = useState(
        customCoordinates || ALMATY_CENTER
    );

    // Преобразуем данные клиник для карты только когда filteredClinics изменяется
    const clinicMarkers = useMemo(() => {
        // Если у нас есть кастомные координаты, создаем маркер с этими координатами
        if (customCoordinates) {
            return [{
                id: selectedClinicId || 999999, // уникальный ID
                name: 'Местоположение клиники',
                address: '',
                position: customCoordinates
            }];
        }

        return filteredClinics
            .filter(clinic => clinic.latitude && clinic.longitude) // Убеждаемся, что у клиники есть координаты
            .map(clinic => ({
                id: clinic.id,
                name: clinic.title,
                address: clinic.address,
                position: [
                    parseFloat(clinic.latitude),
                    parseFloat(clinic.longitude)
                ] as [number, number]
            }));
    }, [filteredClinics, customCoordinates, selectedClinicId]);

    // Определяем центр карты на основе клиник
    useEffect(() => {
        if (customCoordinates) {
            setCenterCoords(customCoordinates);
            return;
        }

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
    }, [clinicMarkers, selectedClinicId, customCoordinates]); // Зависимости включают только мемоизированные данные и selectedClinicId

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

            // @ts-ignore - иконки Leaflet и TypeScript не всегда хорошо ладят
            setCustomIcon(icon);
            // @ts-ignore
            setSelectedIcon(selectedMarkerIcon);
        } catch (error) {
            console.error("Error initializing map icons:", error);
        }
    }, []); // Пустой массив зависимостей - выполняется только при монтировании

    // Если в браузере, но иконки не готовы, показываем заглушку
    if (typeof window !== 'undefined' && (!customIcon || !selectedIcon)) {
        return <div className="w-full h-full bg-gray-100 animate-pulse rounded-xl" />;
    }

    // Если на сервере, возвращаем заглушку
    if (typeof window === 'undefined') {
        return <div className="w-full h-full bg-gray-100 rounded-xl" />;
    }

    // Если нет координат, используем моковые данные
    const markersToRender = clinicMarkers.length > 0 ? clinicMarkers : [
        {
            id: 1,
            name: 'Эмирмед на Манаса 59',
            address: 'улица Абдуллы Розыбакиева, 37В, Алматы',
            position: ALMATY_CENTER as [number, number]
        }
    ];

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
            {markersToRender.map((clinic) => (
                <Marker
                    key={clinic.id}
                    position={clinic?.position}
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
