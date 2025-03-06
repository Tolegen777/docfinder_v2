// stores/clinicsStore.ts
import { create } from 'zustand';
import { ClinicsAPI, Clinic } from '@/shared/api/clinicsApi';
import { AmenitiesAPI, Amenity } from '@/shared/api/amenitiesApi';

// Mock data
const mockSchedule = {
    monday: "09:00-18:00",
    tuesday: "09:00-18:00",
    wednesday: "09:00-18:00",
    thursday: "09:00-18:00",
    friday: "09:00-18:00",
    saturday: "Выходной",
    sunday: "Выходной"
};

// Расширенный тип клиники с данными для карточки
interface EnrichedClinic extends Clinic {
    cardProps: {
        id: number;
        name: string;
        address: string;
        rating: {
            stars: number;
            reviewCount: number;
        };
        schedule: {
            monday: string;
            tuesday: string;
            wednesday: string;
            thursday: string;
            friday: string;
            saturday: string;
            sunday: string;
        };
        timeUntilClose: string;
        discount: {
            percentage: number;
            text: string;
        };
        specialists: number;
        price: number;
        phoneNumber: string;
    };
}

interface ClinicsState {
    clinics: EnrichedClinic[];
    filteredClinics: EnrichedClinic[];
    amenities: Amenity[];
    loading: boolean;
    error: string | null;
    totalCount: number;

    // Filter state
    filters: {
        specialities: number[];
        amenities: number[];
        openNow: boolean; // (нет в API)
        '24hours': boolean; // (нет в API)
    };

    // Actions
    fetchClinics: (cityId: number) => Promise<void>;
    fetchAmenities: (cityId: number) => Promise<void>;
    setFilter: (key: string, value: any) => void;
    toggleSpeciality: (id: number) => void;
    toggleAmenity: (id: number) => void;
    toggleOpenNow: () => void;
    toggle24Hours: () => void;
    applyFilters: (cityId: number) => Promise<void>;
}

// Импортируем функцию для маппинга данных API в формат для компонента
import { mapClinicToCardProps } from '@/shared/api/clinicsApi';

export const useClinicsStore = create<ClinicsState>((set, get) => ({
    clinics: [],
    filteredClinics: [],
    amenities: [],
    loading: false,
    error: null,
    totalCount: 0,

    // Default filter state
    filters: {
        specialities: [],
        amenities: [],
        openNow: false,
        '24hours': false,
},

fetchClinics: async (cityId: number) => {
    try {
        set({ loading: true, error: null });
        const response = await ClinicsAPI.getClinics(cityId);

        // Сохраняем оригинальные данные из API
        const originalClinics = response.results;

        // Преобразуем данные для UI компонентов, сохраняя оригинальные данные для фильтрации
        const mappedClinics = originalClinics.map(clinic => ({
            ...clinic,
            // Добавляем преобразованные данные для ClinicCard
            cardProps: mapClinicToCardProps(clinic)
        }));

        set({
            clinics: mappedClinics,
            filteredClinics: mappedClinics,
            totalCount: response.count,
            loading: false
        });
    } catch (error) {
        console.error('Error fetching clinics:', error);
        set({
            error: 'Failed to fetch clinics',
            loading: false
        });
    }
},

    fetchAmenities: async (cityId: number) => {
    try {
        const amenities = await AmenitiesAPI.getAmenities(cityId);
        set({ amenities });
    } catch (error) {
        console.error('Error fetching amenities:', error);
        // Don't set error state here to not disrupt the UI if amenities fail to load
    }
},

    setFilter: (key: string, value: any) => {
    set(state => ({
        filters: {
            ...state.filters,
            [key]: value,
        }
    }));
},

    toggleSpeciality: (id: number) => {
    set(state => {
        const specialities = state.filters.specialities.includes(id)
            ? state.filters.specialities.filter(specId => specId !== id)
            : [...state.filters.specialities, id];

        return {
            filters: {
                ...state.filters,
                specialities,
            }
        };
    });
},

    toggleAmenity: (id: number) => {
    set(state => {
        const amenities = state.filters.amenities.includes(id)
            ? state.filters.amenities.filter(amenityId => amenityId !== id)
            : [...state.filters.amenities, id];

        return {
            filters: {
                ...state.filters,
                amenities,
            }
        };
    });
},

    toggleOpenNow: () => {
    set(state => ({
        filters: {
            ...state.filters,
            openNow: !state.filters.openNow,
        }
    }));
},

    toggle24Hours: () => {
    set(state => ({
        filters: {
            ...state.filters,
            "24hours": !state.filters["24hours"],
        }
    }));
},

    applyFilters: async (cityId: number) => {
    try {
        set({ loading: true, error: null });

        const { filters } = get();
        const response = await ClinicsAPI.getClinics(cityId, {
            specialities: filters.specialities,
            amenities: filters.amenities,
        });

        // Сохраняем оригинальные данные из API
        const originalClinics = response.results;

        // Преобразуем данные для UI компонентов
        let mappedClinics = originalClinics.map(clinic => ({
            ...clinic,
            // Добавляем преобразованные данные для ClinicCard
            cardProps: mapClinicToCardProps(clinic)
        }));

        // Apply client-side filters that don't exist on the backend (мок)
        if (filters.openNow) {
            // Фильтруем клиники, которые сейчас открыты (имеют time_until_closing)
            mappedClinics = mappedClinics.filter(clinic =>
                clinic.time_until_closing && clinic.time_until_closing.includes("до закрытия")
            );
        }

        if (filters["24hours"]) {
            // Фильтруем клиники, которые работают круглосуточно
            // Это все еще моковый фильтр, так как в API нет прямого указания на круглосуточную работу
            // Но можно попробовать определить по расписанию
            mappedClinics = mappedClinics.filter(clinic => {
                const has24hSchedule = clinic.working_hours.some(hour =>
                    hour.open_time === "00:00" && hour.close_time === "23:59"
                );
                // Если не нашли 24-часовое расписание, используем моковый подход
                return has24hSchedule || clinic.id % 3 === 0;
            });
        }

        set({
            filteredClinics: mappedClinics,
            totalCount: response.count,
            loading: false
        });
    } catch (error) {
        console.error('Error applying filters:', error);
        set({
            error: 'Failed to apply filters',
            loading: false
        });
    }
},
}));
