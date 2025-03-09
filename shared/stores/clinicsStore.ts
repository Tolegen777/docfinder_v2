// stores/clinicsStore.ts
import { create } from 'zustand';
import { ClinicsAPI, Clinic } from '@/shared/api/clinicsApi';
import { AmenitiesAPI, Amenity } from '@/shared/api/amenitiesApi';
import { SpecialtiesAPI, Specialty } from '@/shared/api/specialtiesApi';

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
    specialties: Specialty[];
    loading: boolean;
    error: string | null;
    totalCount: number;
    currentPage: number;
    pageSize: number;

    // Filter state
    filters: {
        specialities: number[];
        amenities: number[];
        openNow: boolean; // (нет в API)
        '24hours': boolean; // (нет в API)
    };

    // Actions
    fetchClinics: (cityId: number, page?: number) => Promise<void>;
    fetchAmenities: (cityId: number) => Promise<void>;
    fetchSpecialties: (cityId: number) => Promise<void>;
    setFilter: (key: string, value: any) => void;
    toggleSpeciality: (id: number) => void;
    toggleAmenity: (id: number) => void;
    toggleOpenNow: () => void;
    toggle24Hours: () => void;
    applyFilters: (cityId: number, page?: number) => Promise<void>;
    setPage: (page: number) => void;
}

// Импортируем функцию для маппинга данных API в формат для компонента
import { mapClinicToCardProps } from '@/shared/api/clinicsApi';

export const useClinicsStore = create<ClinicsState>((set, get) => ({
    clinics: [],
    filteredClinics: [],
    amenities: [],
    specialties: [],
    loading: false,
    error: null,
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,

    // Default filter state
    filters: {
        specialities: [],
        amenities: [],
        openNow: false,
        '24hours': false,
    },

    fetchClinics: async (cityId: number, page = 1) => {
        try {
            set({ loading: true, error: null });
            // Обновляем URL для поддержки пагинации
            const response = await ClinicsAPI.getClinics(cityId, page, get().pageSize);

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
                currentPage: page,
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

    fetchSpecialties: async (cityId: number) => {
        try {
            const specialtiesGroups = await SpecialtiesAPI.getSpecialties(cityId);
            // Flatten specialty groups to get a simple array of specialties
            const specialties = specialtiesGroups.flatMap(group => group.specialities);
            set({ specialties });
        } catch (error) {
            console.error('Error fetching specialties:', error);
            // Don't set error state here to not disrupt the UI if specialties fail to load
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

    applyFilters: async (cityId: number, page = 1) => {
        try {
            set({ loading: true, error: null });

            const { filters, pageSize } = get();
            const response = await ClinicsAPI.getClinics(
                cityId,
                page,
                pageSize,
                {
                    specialities: filters.specialities,
                    amenities: filters.amenities,
                }
            );

            // Сохраняем оригинальные данные из API
            const originalClinics = response.results;

            // Преобразуем данные для UI компонентов
            let mappedClinics = originalClinics.map(clinic => ({
                ...clinic,
                // Добавляем преобразованные данные для ClinicCard
                cardProps: mapClinicToCardProps(clinic)
            }));

            // Apply client-side filters that don't exist on the backend (мок)

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
                currentPage: page,
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

    setPage: (page: number) => {
        set({ currentPage: page });
    }
}));
