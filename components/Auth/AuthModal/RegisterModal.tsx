import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
} from "../../shadcn/dialog";
import { Input } from "../../shadcn/input";
import { Button } from "../../shadcn/button";
import { Eye, EyeOff } from "lucide-react";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '+7',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
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
            <DialogContent className="max-w-[400px] p-6 rounded-lg">
                <div className="mb-6">
                    <h2 className="text-center text-xl font-medium">Регистрация</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="h-12 rounded-lg bg-gray-50 border-gray-200 focus:border-green-600 focus:ring-green-600"
                            placeholder="Имя"
                        />
                    </div>

                    <div>
                        <Input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="h-12 rounded-lg bg-gray-50 border-gray-200 focus:border-green-600 focus:ring-green-600"
                            placeholder="+7"
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

                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Повторите пароль"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="h-12 rounded-lg bg-gray-50 border-gray-200 focus:border-green-600 focus:ring-green-600 pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            {showConfirmPassword ? (
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
                        Зарегистрироваться
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RegisterModal;
