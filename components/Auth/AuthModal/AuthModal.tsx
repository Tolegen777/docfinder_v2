import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/shadcn/dialog";
import { Input } from "@/shared/ui/shadcn/input";
import { Button } from "@/shared/ui/shadcn/button";
import { Eye, EyeOff } from "lucide-react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            phone: '',
            password: '',
            confirmPassword: ''
        };

        // Phone validation
        const phoneRegex = /^\+7\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Phone should be in format +7XXXXXXXXXX';
            isValid = false;
        }

        // Password validation
        if (formData.password.length < 6) {
            newErrors.password = 'Password should be at least 6 characters';
            isValid = false;
        }

        // Confirm password validation for registration
        if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // Here you would typically make your API call
            console.log('Form submitted:', formData);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {isLogin ? 'Вход' : 'Регистрация'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="tel"
                            name="phone"
                            placeholder="По номеру телефона"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full ${errors.phone ? 'border-red-500' : ''}`}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm">{errors.phone}</p>
                        )}
                    </div>

                    <div className="relative space-y-2">
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Пароль"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full pr-10 ${errors.password ? 'border-red-500' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password}</p>
                        )}
                    </div>

                    {!isLogin && (
                        <div className="space-y-2">
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Подтвердите пароль"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                            )}
                        </div>
                    )}

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </Button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-gray-600 hover:underline"
                        >
                            {isLogin ? 'По логину' : 'У меня уже есть аккаунт'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
