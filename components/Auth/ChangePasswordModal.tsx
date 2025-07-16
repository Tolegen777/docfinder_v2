'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/shadcn/dialog';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useChangePassword } from '@/shared/api/authApi';

// Схема валидации для изменения пароля
const changePasswordSchema = z.object({
    current_password: z.string().min(1, 'Введите текущий пароль'),
    new_password: z.string().min(6, 'Новый пароль должен содержать минимум 6 символов'),
    confirm_new_password: z.string().min(6, 'Подтвердите новый пароль'),
}).refine((data) => data.new_password === data.confirm_new_password, {
    message: "Пароли не совпадают",
    path: ["confirm_new_password"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

type ChangePasswordModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                 }) => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const changePassword = useChangePassword();

    const form = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            current_password: '',
            new_password: '',
            confirm_new_password: '',
        }
    });

    // Очищаем форму и ошибки при открытии модального окна
    React.useEffect(() => {
        if (isOpen) {
            form.reset({
                current_password: '',
                new_password: '',
                confirm_new_password: '',
            });
            form.clearErrors();
            // Сбрасываем состояние видимости паролей
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
        }
    }, [isOpen, form]);

    const onSubmit = async (data: ChangePasswordFormValues) => {
        try {
            await changePassword.mutateAsync(data);

            toast.success('Пароль успешно изменен', {
                position: 'top-right',
                duration: 3000,
                icon: <CheckCircle className="text-green-500" />,
            });

            // Сбрасываем форму
            form.reset();

            // Закрываем модальное окно
            onClose();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.detail ||
                error?.response?.data?.message ||
                'Произошла ошибка при изменении пароля';

            toast.error(errorMessage, {
                position: 'top-right',
                duration: 3000,
            });
        }
    };

    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Изменить пароль
                    </DialogTitle>
                </DialogHeader>

                <div className="border-t my-2" />

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Текущий пароль */}
                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                type={showCurrentPassword ? "text" : "password"}
                                label="Текущий пароль"
                                className="bg-[#f3f5f6] pr-10"
                                {...form.register('current_password')}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                onClick={toggleCurrentPasswordVisibility}
                            >
                                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {form.formState.errors.current_password && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.current_password.message}
                            </p>
                        )}
                    </div>

                    {/* Новый пароль */}
                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                type={showNewPassword ? "text" : "password"}
                                label="Новый пароль"
                                className="bg-[#f3f5f6] pr-10"
                                {...form.register('new_password')}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                onClick={toggleNewPasswordVisibility}
                            >
                                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {form.formState.errors.new_password && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.new_password.message}
                            </p>
                        )}
                    </div>

                    {/* Подтверждение нового пароля */}
                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                label="Подтвердите новый пароль"
                                className="bg-[#f3f5f6] pr-10"
                                {...form.register('confirm_new_password')}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {form.formState.errors.confirm_new_password && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.confirm_new_password.message}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={onClose}
                        >
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-[#00B834] hover:bg-[#00A02D] text-white"
                            disabled={changePassword.isPending}
                        >
                            {changePassword.isPending ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePasswordModal;
