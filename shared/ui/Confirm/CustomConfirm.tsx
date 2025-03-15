import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/shadcn/alert-dialog';
import { useConfirmStore } from '@/shared/ui/Confirm/model/store/useConfirmStore';

export const CustomConfirm = () => {
    const { isOpen, options, setOpen } = useConfirmStore();
    const {
        title,
        message,
        action,
        okBtnText,
        cancelBtnText,
        showCloseButton,
        hideCancelButton,
    } = options;

    const handleConfirm = () => {
        action();
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setOpen}>
            <AlertDialogContent className="max-w-[600px] gap-0 space-y-6 p-12">
                <AlertDialogHeader>
                    <div className="mb-2 flex items-center justify-between">
                        <AlertDialogTitle className="heading-web-h4">
                            {title}
                        </AlertDialogTitle>
                        {/*{showCloseButton && (*/}
                        {/*    <CloseIcon*/}
                        {/*        icon={clearIcon}*/}
                        {/*        className="size-4 cursor-pointer text-gray-medium-1 hover:text-cool-black"*/}
                        {/*        onClick={handleClose}*/}
                        {/*    />*/}
                        {/*)}*/}
                    </div>
                    <AlertDialogDescription className="body-m-regular text-cool-black">
                        {message}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:flex-row">
                    <AlertDialogAction onClick={handleConfirm} className="w-20">
                        {okBtnText}
                    </AlertDialogAction>
                    {!hideCancelButton && (
                        <AlertDialogCancel className="w-20">
                            {cancelBtnText}
                        </AlertDialogCancel>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
