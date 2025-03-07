'use client';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {Icon, LatLngExpression} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Schedule } from '@/shared/api/doctorsApi';

interface DoctorClinicMapContentProps {
    schedule: Schedule[];
    doctorName: string;
}

const DoctorClinicMapContent: React.FC<DoctorClinicMapContentProps> = ({
                                                                           schedule,
                                                                           doctorName
                                                                       }) => {
    // Проверяем, есть ли клиники со всей необходимой информацией для отображения на карте
    const validClinics = schedule.filter(clinic =>
        clinic.clinic_address &&
        clinic.maps_links &&
        clinic.clinic_title
    );

    if (validClinics.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50">
                <p className="text-gray-500">Информация о местоположении клиник недоступна</p>
            </div>
        );
    }

    // Заготовка для расчета центра карты
    // Здесь можно было бы использовать координаты из API, но их нет
    // Поэтому используем фиксированные координаты для Алматы как заглушку
    const center = [43.238949, 76.889709];

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

            {validClinics.map((clinic, index) => (
                <Marker
                    key={`${clinic.clinic_id || index}`}
                    position={center as LatLngExpression} // В реальном приложении нужно взять координаты из API
                    icon={defaultIcon}
                >
                    <Popup>
                        <div className="p-2">
                            <h3 className="font-medium text-base">{clinic.clinic_title}</h3>
                            <p className="text-sm text-gray-600">{clinic.clinic_address}</p>
                            <p className="text-sm mt-2">
                                <strong>Врач:</strong> {doctorName}
                            </p>
                            {clinic.working_hours?.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-sm font-medium">Доступное время приема:</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {clinic.working_hours.slice(0, 5).map((hour, i) => (
                                            <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                        {hour.start_time.substring(0, 5)}
                      </span>
                                        ))}
                                        {clinic.working_hours.length > 5 && (
                                            <span className="text-xs text-gray-500">+{clinic.working_hours.length - 5} еще</span>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="mt-3 flex gap-2">
                                {clinic.maps_links?.yandex && (
                                    <a
                                        href={clinic.maps_links.yandex}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"
                                    >
                                        Яндекс Карты
                                    </a>
                                )}
                                {clinic.maps_links?.google && (
                                    <a
                                        href={clinic.maps_links.google}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100"
                                    >
                                        Google Maps
                                    </a>
                                )}
                                {clinic.maps_links?.["2gis"] && (
                                    <a
                                        href={clinic.maps_links["2gis"]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100"
                                    >
                                        2ГИС
                                    </a>
                                )}
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default DoctorClinicMapContent;
