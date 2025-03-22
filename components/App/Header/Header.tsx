// src/components/Header/Header.tsx
'use client'
import React, { useState, useEffect } from 'react';
import {Search, UserCircle, LogOut, CheckCircle} from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import Image from 'next/image';
import logoImg from '@/shared/assets/images/logo.png';
import { MaxWidthLayout } from '@/shared/ui/MaxWidthLayout';
import AuthModal from '@/components/Auth/AuthModal/AuthModal';
import { LanguageSelector } from '@/components/App/LanguageSelector/LanguageSelector';
import { CitySelector } from '@/components/App/CitySelector/CitySelector';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu';
import {useAuthStore} from "@/shared/stores/authStore";
import {useCheckAuth} from "@/shared/api/authApi";
import {toast} from "sonner";
import {tokenService} from "@/shared/lib/tokenService";

const SearchBar = () => {
    return (
        <div className="w-full md:max-w-2xl relative">
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Врач, услуга, болезнь, клиника"
                    className="h-12 w-full pl-4 pr-10 py-2 bg-green-light-1 border-0 focus:ring-1 focus:ring-green-500"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
        </div>
    );
};

export const Header = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuthStore();
    const checkAuth = useCheckAuth();

    // Check authentication status on component mount
    useEffect(() => {
        const token = tokenService.getLocalAccessToken();
        if (token) {
            checkAuth.mutate();
        }
    }, []);

    return (
        <header className="w-full border-b border-gray-200">
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
            <MaxWidthLayout className="px-4 py-3">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <div className="text-xl font-semibold flex items-center gap-1">
                            <Image
                                src={logoImg}
                                alt="DocFinder"
                                className="w-[154px] h-[30px] md:w-[200px] md:h-[40px]"
                            />
                        </div>
                    </div>

                    {/* Search Bar - Full width on mobile, adaptive on desktop */}
                    <div className="w-full md:max-w-2xl order-3 md:order-2">
                        <SearchBar />
                    </div>

                    {/* Right side controls */}
                    <div className="flex items-center gap-3 w-full md:w-auto md:ml-auto order-2 md:order-3">
                        <div className="flex items-center justify-between w-full">
                            {/*<LanguageSelector />*/}
                            <CitySelector />

                            {isAuthenticated ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-12 gap-2">
                                            <UserCircle className="h-5 w-5" />
                                            <span className="hidden md:inline">{user?.first_name || 'Профиль'}</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <a href="/profile">Мой профиль</a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <a href="/appointments">Мои записи</a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <a href="/favorites">Избранное</a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-500" onClick={logout}>
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Выйти
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button
                                    className="h-12 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => setIsAuthModalOpen(true)}
                                >
                                    Войти
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </MaxWidthLayout>
        </header>
    );
};

export default Header;
