// shared/api/clinicsApi.ts
import { apiGet } from '@/shared/api';

export interface Speciality {
    id: number;
    title: string;
    slug: string;
}

export interface WorkingHour {
    id: number;
    weekday: string;
    open_time: string;
    close_time: string;
}

export interface RatingInfo {
    average_rating: number;
    total_reviews: number;
}

export interface Clinic {
    id: number;
    title: string;
    slug: string;
    franchise_title: string;
    address: string;
    longitude: string;
    latitude: string;
    yandex_maps_url: string;
    google_maps_url: string;
    two_gis_url: string;
    specialities: Speciality[];
    working_hours: WorkingHour[];
    time_until_closing: string; // Формат: "8 ч. 50 мин. до закрытия"
    rating_info: RatingInfo;
    doctor_count?: number;
    main_photo_url?: string;
}

export interface ClinicsResponse {
    count: number;
    next: string;
    previous: any;
    results: Clinic[];
}

export interface LocationCoords {
    lat: number;
    lng: number;
}

export const ClinicsAPI = {
    getClinics: (
        cityId: number,
        page: number = 1,
        pageSize: number = 10,
        filters?: {
            specialities?: number[],
            amenities?: number[],
            is_open_now?: boolean,
            nearbyOnly?: boolean,
        },
        coords?: LocationCoords | null
    ) => {
        const url = `/patients_endpoints/clinics/city_id:${cityId}/all-clinics/`;

        // Создаем объект с query параметрами, которые не пустые
        const params: Record<string, any> = {
            page,
            page_size: pageSize
        };

        if (filters?.specialities && filters.specialities.length > 0) {
            params.specialities = filters.specialities;
        }

        if (filters?.amenities && filters.amenities.length > 0) {
            params.amenities = filters.amenities;
        }

        // Add is_open_now filter if provided
        if (filters?.is_open_now !== undefined) {
            params.is_open_now = filters.is_open_now;
        }

        // Add location parameters if nearby filter is enabled and coordinates are available
        if (filters?.nearbyOnly && coords) {
            params.latitude = coords.lat;
            params.longitude = coords.lng;
        }

        return apiGet<ClinicsResponse>(url, params);
    }
} as const;

// Функция для преобразования данных API в формат, понятный для ClinicCard
export const mapClinicToCardProps = (clinic: Clinic) => {
    // Преобразуем расписание из API в формат, который ожидает ClinicCard
    const schedule = {
        monday: "Нет данных",
        tuesday: "Нет данных",
        wednesday: "Нет данных",
        thursday: "Нет данных",
        friday: "Нет данных",
        saturday: "Нет данных",
        sunday: "Нет данных"
    };

    // Преобразуем weekday из API в ключи нашего расписания
    const weekdayMap: Record<string, keyof typeof schedule> = {
        "MONDAY": "monday",
        "TUESDAY": "tuesday",
        "WEDNESDAY": "wednesday",
        "THURSDAY": "thursday",
        "FRIDAY": "friday",
        "SATURDAY": "saturday",
        "SUNDAY": "sunday",
    };

    // Заполняем расписание реальными данными
    clinic.working_hours.forEach(hour => {
        const day = weekdayMap[hour.weekday];
        if (day) {
            schedule[day] = `${hour.open_time?.substring(0, 5)}-${hour.close_time?.substring(0, 5)}`;
        }
    });

    // Преобразуем rating_info в формат, который ожидает ClinicCard
    const rating = {
        stars: Math.round(clinic.rating_info.average_rating || 0), // Округляем до целого числа для отображения звезд
        reviewCount: clinic.rating_info.total_reviews || 0
    };

    // Возвращаем объект с данными, который можно передать в ClinicCard, используя только реальные данные
    return {
        id: clinic.id,
        name: clinic.title,
        address: clinic.address,
        timeUntilClose: clinic.time_until_closing || "Нет данных о времени закрытия",
        rating,
        schedule,
        specialists: clinic.specialities?.length || 0,
    };
};
