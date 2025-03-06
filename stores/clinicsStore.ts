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

interface ClinicsState {
    clinics: Clinic[];
    filteredClinics: Clinic[];
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

// Helper to enrich API data with mock data for UI
const enrichClinicsWithMockData = (clinics: Clinic[]): Clinic[] => {
    return clinics.map(clinic => ({
        ...clinic,
        rating: {
            stars: Math.floor(Math.random() * 3) + 3, // Random 3-5 stars
            reviewCount: Math.floor(Math.random() * 500) + 100, // Random 100-600 reviews
        },
        discount: {
            percentage: Math.floor(Math.random() * 20) + 10, // Random 10-30% discount
            text: "на первый прием",
        },
        schedule: mockSchedule,
        specialists: Math.floor(Math.random() * 20) + 5, // Random 5-25 specialists
        price: Math.floor(Math.random() * 30000) + 10000, // Random 10000-40000 price
        timeUntilClose: Math.floor(Math.random() * 180) + 30, // Random 30-210 minutes until close
        phoneNumber: "+7 701 234...", // Mock phone number
    }));
};

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

        // Enrich with mock data for UI
        const enrichedClinics = enrichClinicsWithMockData(response.results);

        set({
            clinics: enrichedClinics,
            filteredClinics: enrichedClinics,
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

        let filteredResults = enrichClinicsWithMockData(response.results);

        // Apply client-side filters that don't exist on the backend (мок)
        if (filters.openNow) {
            // Mock implementation for "open now" filter
            filteredResults = filteredResults.filter(clinic =>
                clinic.timeUntilClose && clinic.timeUntilClose > 0
            );
        }

        if (filters["24hours"]) {
            // Mock implementation for "24 hours" filter
            filteredResults = filteredResults.filter(clinic =>
                // Randomly select some clinics to be 24h for mock purposes
                clinic.id % 3 === 0
            );
        }

        set({
            filteredClinics: filteredResults,
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
