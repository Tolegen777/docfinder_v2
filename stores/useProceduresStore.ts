// stores/useProceduresStore.ts
import { create } from 'zustand';

interface ProceduresState {
    activeCategoryId: number | null;
    activeSubCategoryId: number | null;
    setActiveCategory: (id: number | null) => void;
    setActiveSubCategory: (id: number | null) => void;
    reset: () => void;
}

export const useProceduresStore = create<ProceduresState>((set) => ({
    activeCategoryId: null,
    activeSubCategoryId: null,

    setActiveCategory: (id) => set(() => ({
        activeCategoryId: id,
        activeSubCategoryId: null // Сбрасываем активную подкатегорию при смене основной категории
    })),

    setActiveSubCategory: (id) => set(() => ({
        activeSubCategoryId: id
    })),

    reset: () => set(() => ({
        activeCategoryId: null,
        activeSubCategoryId: null
    })),
}));
