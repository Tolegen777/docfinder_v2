// stores/cityContext.ts
import {create} from 'zustand';
import {City} from "@/shared/api/cityApi";

interface CityState {
    currentCity: City | null;
    setCurrentCity: (city: City) => void;
}

export const useCityStore = create<CityState>((set, get) => ({
    currentCity: null, // Default to first city (Алматы in most cases)

    setCurrentCity: (city: City) => {
        set({ currentCity: city });
    },
}));
