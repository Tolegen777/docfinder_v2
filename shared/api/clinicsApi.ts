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

    // Поля которые все еще отсутствуют в API (мок)
    discount?: {
        percentage: number;
        text: string;
    };
    specialists?: number;
    price?: number;
    phoneNumber?: string;
}

export interface ClinicsResponse {
    count: number;
    next: string;
    previous: any;
    results: Clinic[];
}

export const ClinicsAPI = {
    getClinics: (
        cityId: number,
        page: number = 1,
        pageSize: number = 10,
        filters?: {
            specialities?: number[],
            amenities?: number[]
        }
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

        return apiGet<ClinicsResponse>(url, params);
    }
} as const;

// Функция для преобразования данных API в формат, понятный для ClinicCard
export const mapClinicToCardProps = (clinic: Clinic) => {
    // Преобразуем расписание из API в формат, который ожидает ClinicCard
    const schedule = {
        monday: "Выходной",
        tuesday: "Выходной",
        wednesday: "Выходной",
        thursday: "Выходной",
        friday: "Выходной",
        saturday: "Выходной",
        sunday: "Выходной"
    };

    // Преобразуем weekday из API в ключи нашего расписания
    const weekdayMap: Record<string, keyof typeof schedule> = {
        "Monday": "monday",
        "Tuesday": "tuesday",
        "Wednesday": "wednesday",
        "Thursday": "thursday",
        "Friday": "friday",
        "Saturday": "saturday",
        "Sunday": "sunday",
        // Добавляем русские названия на случай, если API возвращает их
        "Понедельник": "monday",
        "Вторник": "tuesday",
        "Среда": "wednesday",
        "Четверг": "thursday",
        "Пятница": "friday",
        "Суббота": "saturday",
        "Воскресенье": "sunday",
    };

    // Заполняем расписание реальными данными
    clinic.working_hours.forEach(hour => {
        const day = weekdayMap[hour.weekday];
        if (day) {
            schedule[day] = `${hour.open_time}-${hour.close_time}`;
        }
    });

    // Преобразуем rating_info в формат, который ожидает ClinicCard
    const rating = {
        stars: Math.round(clinic.rating_info.average_rating), // Округляем до целого числа для отображения звезд
        reviewCount: clinic.rating_info.total_reviews
    };

    // Используем time_until_closing как есть, без преобразования
    const timeUntilClose = clinic.time_until_closing;

    // Возвращаем объект с данными, который можно передать в ClinicCard
    return {
        id: clinic.id,
        name: clinic.title,
        address: clinic.address,
        rating,
        schedule,
        timeUntilClose,

        // Моковые данные, которых нет в API
        discount: {
            percentage: Math.floor(Math.random() * 20) + 10, // 10-30%
            text: "на первый прием"
        },
        specialists: Math.floor(Math.random() * 20) + 5, // 5-25
        price: Math.floor(Math.random() * 30000) + 10000, // 10000-40000
        phoneNumber: "+7 701 234..."
    };
};
