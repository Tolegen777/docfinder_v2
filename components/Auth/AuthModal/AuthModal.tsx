'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/shadcn/dialog';
import { Button } from '@/components/shadcn/button';
import {CheckCircle, Eye, EyeOff} from 'lucide-react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { useLogin, useRegister } from "@/shared/api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/shadcn/input";
import {toast} from "sonner";
import ResetPasswordModal from '@/components/Auth/ResetPasswordModal';

type AuthModalProps = {
    isOpen?: boolean;
    onClose?: () => void;
    defaultMode?: 'login' | 'register';
};

// Regex для валидации казахстанского номера телефона в формате +7 XXX XXX XXXX
const phoneRegex = /^\+7 [0-9]{3} [0-9]{3} [0-9]{4}$/;

// Схема валидации для логина
const loginSchema = z.object({
    phone_number: z.string().regex(phoneRegex, 'Введите корректный номер телефона'),
    password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

// Схема валидации для регистрации
const registerSchema = z.object({
    first_name: z.string().min(1, 'Введите имя'),
    phone_number: z.string().regex(phoneRegex, 'Введите корректный номер телефона'),
    login: z.string().optional(),
    password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
    confirm_password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
}).refine((data) => data.password === data.confirm_password, {
    message: "Пароли не совпадают",
    path: ["confirm_password"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

// Функция для форматирования телефонного номера
const formatPhoneNumber = (value: string): string => {
    if (!value) return '+7 ';

    // Удаляем все нецифровые символы
    const digits = value.replace(/\D/g, '');

    // Ограничиваем до 11 цифр (с кодом страны)
    const limitedDigits = digits.slice(0, 11);

    // Если первая цифра не 7, подставляем 7
    const normalizedDigits = limitedDigits.startsWith('7')
        ? limitedDigits
        : '7' + limitedDigits.slice(limitedDigits.startsWith('7') ? 1 : 0);

    // Форматируем номер
    let formattedNumber = '+7';

    if (normalizedDigits.length > 1) {
        formattedNumber += ' ';
        // Добавляем первые 3 цифры после кода
        if (normalizedDigits.length >= 4) {
            formattedNumber += normalizedDigits.slice(1, 4);
        } else {
            formattedNumber += normalizedDigits.slice(1);
        }
    }

    if (normalizedDigits.length > 4) {
        formattedNumber += ' ';
        // Добавляем следующие 3 цифры
        if (normalizedDigits.length >= 7) {
            formattedNumber += normalizedDigits.slice(4, 7);
        } else {
            formattedNumber += normalizedDigits.slice(4);
        }
    }

    if (normalizedDigits.length > 7) {
        formattedNumber += ' ';
        // Добавляем оставшиеся цифры
        formattedNumber += normalizedDigits.slice(7, 11);
    }

    return formattedNumber;
};

const AuthModal: React.FC<AuthModalProps> = ({
                                                 isOpen = false,
                                                 onClose,
                                                 defaultMode = 'login',
                                             }) => {
    const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);

    const login = useLogin();
    const register = useRegister();

    const loginForm = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            phone_number: '+7 ',
            password: '',
        }
    });

    const registerForm = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            first_name: '',
            phone_number: '+7 ',
            login: '',
            password: '',
            confirm_password: '',
        }
    });

    // Очищаем ошибки валидации при открытии/закрытии модального окна
    React.useEffect(() => {
        if (isOpen) {
            // Очищаем ошибки при открытии
            loginForm.clearErrors();
            registerForm.clearErrors();
        }
    }, [isOpen, loginForm, registerForm]);

    const onLoginSubmit = async (data: LoginFormValues) => {
        try {
            await login.mutateAsync(data);

            // Close modal on successful login
            if (onClose) {
                onClose();
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.non_field_errors?.join('') ?? 'Произошла ошибка при входе', {
                position: 'top-right',
                duration: 2000,
                className: 'alert-danger !bg-red-300 !text-white',
            });
        }
    };

    const onRegisterSubmit = async (data: RegisterFormValues) => {
        try {
            await register.mutateAsync({
                phone_number: data.phone_number,
                password: data.password,
                first_name: data.first_name,
            });

            // Switch to login mode after successful registration
            setMode('login');

            // Pre-fill login form with registration data
            loginForm.setValue('phone_number', data.phone_number);
            loginForm.setValue('password', data.password);

            // Show success message
            toast.success('Регистрация успешна! Теперь вы можете войти.', {
                position: 'top-right',
                duration: 3000,
                icon: <CheckCircle className="text-green-500" />,
            })
        } catch (error:any) {
            toast.error(error?.response?.data?.non_field_errors?.join('') ?? 'Произошла ошибка при регистраций', {
                position: 'top-right',
                duration: 2000,
                className: 'alert-danger !bg-red-300 !text-white',
            });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const switchToLogin = () => {
        setMode('login');
        setShowResetPassword(false);
        // Очищаем ошибки валидации при переходе
        registerForm.clearErrors();
    };

    const switchToRegister = () => {
        setMode('register');
        setShowResetPassword(false);
        // Очищаем ошибки валидации при переходе
        loginForm.clearErrors();
    };

    const handleResetPassword = () => {
        setShowResetPassword(true);
        // Очищаем ошибки валидации при переходе
        loginForm.clearErrors();
    };

    const handleBackToLogin = () => {
        setShowResetPassword(false);
        // Очищаем ошибки валидации при возврате
        loginForm.clearErrors();
    };

    return (
        <>
            <Dialog open={isOpen && !showResetPassword} onOpenChange={open => !open && onClose && onClose()}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="flex flex-row items-center justify-between">
                        <DialogTitle className="text-2xl font-bold">
                            {mode === 'login' ? 'Вход' : 'Регистрация'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="border-t my-2" />

                    {mode === 'login' ? (
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                            <div className="relative">
                                <Controller
                                    name="phone_number"
                                    control={loginForm.control}
                                    render={({ field }) => (
                                        <Input
                                            label="Номер телефона"
                                            className="bg-[#f3f5f6]"
                                            value={field.value}
                                            onChange={(e) => {
                                                const formattedValue = formatPhoneNumber(e.target.value);
                                                field.onChange(formattedValue);
                                            }}
                                            onBlur={field.onBlur}
                                        />
                                    )}
                                />
                                {loginForm.formState.errors.phone_number && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {loginForm.formState.errors.phone_number.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        label="Пароль"
                                        className="bg-[#f3f5f6] pr-10"
                                        {...loginForm.register('password')}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {loginForm.formState.errors.password && (
                                    <p className="text-sm text-red-500">
                                        {loginForm.formState.errors.password.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#00B834] hover:bg-[#00A02D] text-white"
                                disabled={login.isPending}
                            >
                                {login.isPending ? 'Загрузка...' : 'Войти'}
                            </Button>

                            {/* Кнопка "Забыли пароль?" */}
                            <div className="text-center">
                                <Button
                                    variant="link"
                                    className="p-0 h-auto text-[#00B834] text-sm"
                                    onClick={handleResetPassword}
                                >
                                    Забыли пароль?
                                </Button>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-gray-500">
                                    Нет аккаунта?{' '}
                                    <Button
                                        variant="link"
                                        className="p-0 h-auto text-[#00B834]"
                                        onClick={switchToRegister}
                                    >
                                        Зарегистрироваться
                                    </Button>
                                </p>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                            <div className="relative">
                                <Input
                                    label="Имя"
                                    className="bg-[#f3f5f6]"
                                    {...registerForm.register('first_name')}
                                />
                                {registerForm.formState.errors.first_name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {registerForm.formState.errors.first_name.message}
                                    </p>
                                )}
                            </div>

                            <div className="relative">
                                <Controller
                                    name="phone_number"
                                    control={registerForm.control}
                                    render={({ field }) => (
                                        <Input
                                            label="Номер телефона"
                                            className="bg-[#f3f5f6]"
                                            value={field.value}
                                            onChange={(e) => {
                                                const formattedValue = formatPhoneNumber(e.target.value);
                                                field.onChange(formattedValue);
                                            }}
                                            onBlur={field.onBlur}
                                        />
                                    )}
                                />
                                {registerForm.formState.errors.phone_number && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {registerForm.formState.errors.phone_number.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        label="Придумайте пароль *"
                                        required
                                        className="bg-[#f3f5f6] pr-10"
                                        {...registerForm.register('password')}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {registerForm.formState.errors.password && (
                                    <p className="text-sm text-red-500">
                                        {registerForm.formState.errors.password.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="relative">
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        label="Повторите пароль *"
                                        required
                                        className="bg-[#f3f5f6] pr-10"
                                        {...registerForm.register('confirm_password')}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                        onClick={toggleConfirmPasswordVisibility}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {registerForm.formState.errors.confirm_password && (
                                    <p className="text-sm text-red-500">
                                        {registerForm.formState.errors.confirm_password.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#00B834] hover:bg-[#00A02D] text-white"
                                disabled={register.isPending}
                            >
                                {register.isPending ? 'Загрузка...' : 'Зарегистрироваться'}
                            </Button>

                            <div className="text-center">
                                <p className="text-sm text-gray-500">
                                    Уже есть аккаунт?{' '}
                                    <Button
                                        variant="link"
                                        className="p-0 h-auto text-[#00B834]"
                                        onClick={switchToLogin}
                                    >
                                        Войти
                                    </Button>
                                </p>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Модальное окно сброса пароля */}
            <ResetPasswordModal
                isOpen={showResetPassword}
                onClose={() => setShowResetPassword(false)}
                onBackToLogin={handleBackToLogin}
            />
        </>
    );
};

export default AuthModal;
