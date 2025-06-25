// stores/cityContext.ts
import {create} from 'zustand';

interface SpecialityState {
    activeSpeciality: string;
    setActiveSpeciality: (speciality: string) => void;
}

export const useSpecialityStore = create<SpecialityState>((set, get) => ({
    activeSpeciality: '',

    setActiveSpeciality: (speciality: string) => {
        set({ activeSpeciality: speciality });
    },
}));
