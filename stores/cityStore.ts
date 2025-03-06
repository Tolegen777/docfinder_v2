// stores/cityContext.ts
import { create } from 'zustand';
import {CitiesAPI, City} from "@/shared/api/cityApi";

interface CityState {
    cities: City[];
    currentCityId: number;
    loading: boolean;
    error: string | null;

    // Actions
    fetchCities: () => Promise<void>;
    setCurrentCity: (cityId: number) => void;
    getCurrentCityName: () => string;
}

export const useCityStore = create<CityState>((set, get) => ({
    cities: [],
    currentCityId: 1, // Default to first city (Алматы in most cases)
    loading: false,
    error: null,

    fetchCities: async () => {
        try {
            set({ loading: true, error: null });
            const cities = await CitiesAPI.getCities();
            set({
                cities,
                // If we haven't set a city id yet and cities are available, set the first one
                currentCityId: cities.length > 0 ? cities[0].id : 1,
                loading: false
            });
        } catch (error) {
            console.error('Error fetching cities:', error);
            set({
                error: 'Failed to fetch cities',
                loading: false
            });
        }
    },

    setCurrentCity: (cityId: number) => {
        set({ currentCityId: cityId });
    },

    getCurrentCityName: () => {
        const { cities, currentCityId } = get();
        const currentCity = cities.find(city => city.id === currentCityId);
        return currentCity ? currentCity.title : 'Алматы'; // Используем Алматы как дефолт
    }
}));
