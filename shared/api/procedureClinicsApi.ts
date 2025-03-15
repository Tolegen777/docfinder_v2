// shared/api/procedureClinicsApi.ts
import { apiGet } from '@/shared/api';

export interface ProcedureClinicRatingInfo {
    average_rating?: number;    // Средний рейтинг клиники
    review_count?: number;      // Количество отзывов
}

export interface WorkingHour {
    day_of_week: number;        // День недели (1-7, где 1 - понедельник)
    opening_time: string;       // Время открытия (например, "09:00")
    closing_time: string;       // Время закрытия (например, "18:00")
    is_day_off: boolean;        // Выходной день или нет
}

export interface MapsLinks {
    yandex: string;             // Ссылка на Яндекс Карты
    google: string;             // Ссылка на Google Maps
    "2gis": string;             // Ссылка на 2GIS
}

export interface ProcedureClinic {
    id: number;                 // ID клиники
    title: string;              // Название клиники
    slug: string;               // Slug для URL
    franchise_title: string;    // Название франшизы
    address: string;            // Полный адрес клиники
    longitude: string;          // Долгота для карты
    latitude: string;           // Широта для карты
    yandex_maps_url: string;    // Ссылка на Яндекс Карты
    google_maps_url: string;    // Ссылка на Google Maps
    two_gis_url: string;        // Ссылка на 2GIS
    maps_links?: MapsLinks;     // Объект со всеми ссылками на карты
    working_hours: WorkingHour[]; // Расписание работы
    time_until_closing: string; // Время до закрытия
    rating_info: ProcedureClinicRatingInfo; // Информация о рейтинге
    doctor_count: number;       // Количество докторов
    min_procedure_price: number; // Минимальная цена процедуры
    discount_percentage?: number; // Процент скидки
    discount_text?: string;     // Текст скидки
    phones?: string[];          // Список телефонов
}

export interface ProcedureClinicsResponse {
    count: number;
    next: string;
    previous: any;
    results: ProcedureClinic[];
}

export const ProcedureClinicsAPI = {
    getProcedureClinics: (procedureSlug: string, page: number = 1, pageSize: number = 10) =>
        apiGet<ProcedureClinicsResponse>(
            `/patients_endpoints/procedures/${procedureSlug}/clinics_list?page=${page}&page_size=${pageSize}`
        ),
} as const;
