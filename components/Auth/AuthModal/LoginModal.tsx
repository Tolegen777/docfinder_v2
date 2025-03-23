import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
} from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Eye, EyeOff } from "lucide-react";
import { formatPhoneNumber } from "@/shared/lib/formatters";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const [loginType, setLoginType] = useState<'phone' | 'email'>('phone');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        login: '+7 ',
        password: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Форматирование номера телефона, если выбран вход по телефону
        if (name === 'login' && loginType === 'phone') {
            setFormData(prev => ({
                ...prev,
                [name]: formatPhoneNumber(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Сбрасываем значение поля login при переключении типа входа
    const handleLoginTypeChange = (type: 'phone' | 'email') => {
        setLoginType(type);
        setFormData(prev => ({
            ...prev,
            login: type === 'phone' ? '+7 ' : ''
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[400px] p-6 rounded-lg">
                <div className="mb-6">
                    <h2 className="text-center text-xl font-medium mb-4">Вход</h2>
                    <div className="flex justify-center gap-8 relative">
                        <button
                            onClick={() => handleLoginTypeChange('phone')}
                            className={`text-sm pb-1 relative ${loginType === 'phone' ? 'text-green-600' : 'text-gray-500'}`}
                        >
                            По номеру телефона
                            {loginType === 'phone' && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600" />
                            )}
                        </button>
                        <button
                            onClick={() => handleLoginTypeChange('email')}
                            className={`text-sm pb-1 relative ${loginType === 'email' ? 'text-green-600' : 'text-gray-500'}`}
                        >
                            По email
                            {loginType === 'email' && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600" />
                            )}
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            type={loginType === 'phone' ? 'tel' : 'email'}
                            name="login"
                            value={formData.login}
                            onChange={handleInputChange}
                            className="h-12 rounded-lg bg-gray-50 border-gray-200 focus:border-green-600 focus:ring-green-600"
                            placeholder={loginType === 'phone' ? '+7' : 'Введите email'}
                        />
                    </div>

                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Пароль"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="h-12 rounded-lg bg-gray-50 border-gray-200 focus:border-green-600 focus:ring-green-600 pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium"
                    >
                        Войти
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default LoginModal;
