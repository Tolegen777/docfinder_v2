// store/useServicesStore.ts
import { create } from 'zustand';

interface ServicesState {
    // Navigation state
    activeCategory: string;  // diagnostics, analysis и т.д.
    activeSubCategory: string; // mrt, kt и т.д.

    // Analysis filters state
    searchQuery: string;
    filters: {
        forKids: boolean;
        atHome: boolean;
        complex: boolean;
        express: boolean;
    };

    // Sidebar state
    activeAnalysisCategory: string;

    // Actions
    setActiveCategory: (category: string) => void;
    setActiveSubCategory: (subCategory: string) => void;
    setActiveAnalysisCategory: (category: string) => void;
    setSearchQuery: (query: string) => void;
    setFilter: (key: keyof ServicesState['filters'], value: boolean) => void;
    resetAll: () => void;
}

export const useServicesStore = create<ServicesState>((set) => ({
    // Initial state
    activeCategory: 'diagnostics',
    activeSubCategory: '',
    activeAnalysisCategory: 'blood-general',
    searchQuery: '',
    filters: {
        forKids: false,
        atHome: false,
        complex: false,
        express: false,
    },

    // Actions
    setActiveCategory: (category) => set({ activeCategory: category }),
    setActiveSubCategory: (subCategory) => set({ activeSubCategory: subCategory }),
    setActiveAnalysisCategory: (category) => set({ activeAnalysisCategory: category }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setFilter: (key, value) =>
        set((state) => ({
            filters: { ...state.filters, [key]: value }
        })),
    resetAll: () => set({
        activeCategory: 'diagnostics',
        activeSubCategory: '',
        activeAnalysisCategory: 'blood-general',
        searchQuery: '',
        filters: {
            forKids: false,
            atHome: false,
            complex: false,
            express: false,
        }
    })
}));
