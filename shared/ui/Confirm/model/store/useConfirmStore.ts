import type { ReactNode } from 'react';
import { create } from 'zustand';

export interface ConfirmOptions {
    title?: string;
    message: string | ReactNode;
    action: () => void;
    okBtnText?: string;
    cancelBtnText?: string;
    showCloseButton?: boolean;
    hideCancelButton?: boolean;
    data?: unknown;
}

interface ConfirmStore {
    isOpen: boolean;
    options: ConfirmOptions;
    setOpen: (value: boolean) => void;
    showConfirm: (options: ConfirmOptions) => void;
}

export const useConfirmStore = create<ConfirmStore>((set) => ({
    isOpen: false,
    options: {
        title: 'Внимание!',
        message: '',
        action: () => {},
        okBtnText: 'Да',
        cancelBtnText: 'Нет',
        showCloseButton: false,
        hideCancelButton: false,
        data: undefined,
    },
    setOpen: (value) => set({ isOpen: value }),
    showConfirm: (options) =>
        set({
            isOpen: true,
            options: {
                ...useConfirmStore.getState().options,
                ...options,
            },
        }),
}));
