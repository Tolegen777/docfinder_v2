import {ConfirmOptions, useConfirmStore} from '@/shared/ui/Confirm/model/store/useConfirmStore';

export const customConfirmAction = (options: ConfirmOptions) => {
    useConfirmStore.getState().showConfirm(options);
};
