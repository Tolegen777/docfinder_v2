import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
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
}

const MapProcedureComponent = ({ isPreview = false, selectedClinicId }: MapComponentProps) => {
    const { filteredClinics } = useClinicsStore();
    const [customIcon, setCustomIcon] = useState(null);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [centerCoords, setCenterCoords] = useState(ALMATY_CENTER);

    // Преобразуем данные клиник для карты только когда filteredClinics изменяется
    const clinicMarkers = useMemo(() => {
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
    }, [filteredClinics]);

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
    }, [clinicMarkers, selectedClinicId]); // Зависимости включают только мемоизированные данные и selectedClinicId

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
    }, []); // Пустой массив зависимостей - выполняется только при монтировании

    if (typeof window === 'undefined' || !customIcon || !selectedIcon) return null;

    // Если нет координат, используем моковые данные
    const markersToRender = clinicMarkers.length > 0 ? clinicMarkers : [
        { id: 1, name: 'Центр Алматы', address: 'Алматы', position: ALMATY_CENTER as [number, number] }
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

export default MapProcedureComponent;
