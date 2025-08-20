import {create} from 'zustand';
import {City} from "@/shared/api/cityApi";

interface CityState {
    currentCity: City | null;
    setCurrentCity: (city: City) => void;
}

export const useCityStore = create<CityState>((set, get) => ({
    currentCity: {
        title: 'Шымкент',
        id: 3
    },

    setCurrentCity: (city: City) => {
        set({ currentCity: city });
    },
}));
