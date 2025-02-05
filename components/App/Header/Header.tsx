'use client'
import React, {useState} from 'react';
import {ChevronDown, Globe, MapPin, Search} from 'lucide-react';
import {Button} from "../../shadcn/button";
import {Input} from "../../shadcn/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../../shadcn/dropdown-menu";
import Image from "next/image";
import logoImg from '../../../shared/assets/images/logo.png'
import {MaxWidthLayout} from "@/shared/ui/MaxWidthLayout";
import RegisterModal from "@/components/Auth/AuthModal/RegisterModal";

const LanguageSelector = () => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                className="flex items-center gap-2 h-9"
            >
                <Globe className="!size-7 text-primary"/>
                <span className="text-base">RU</span>
                <ChevronDown className="!size-5"/>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem>Русский</DropdownMenuItem>
            <DropdownMenuItem>Қазақша</DropdownMenuItem>
            <DropdownMenuItem>English</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

const CitySelector = () => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                className="flex items-center gap-2 h-9"
            >
                <MapPin className="!size-7 text-primary"/>
                <span className="text-base">Алматы</span>
                <ChevronDown className="!size-5"/>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem>Алматы</DropdownMenuItem>
            <DropdownMenuItem>Астана</DropdownMenuItem>
            <DropdownMenuItem>Шымкент</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

const SearchBar = () => {
    return <div className="w-full md:max-w-2xl relative">
        <div className="relative">
            <Input
                type="text"
                placeholder="Врач, услуга, болезнь, клиника"
                className="h-12 w-full pl-4 pr-10 py-2 bg-green-light-1 border-0 focus:ring-1 focus:ring-green-500"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
        </div>
    </div>
}

export const Header = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <header className="w-full border-b border-gray-200">
            <RegisterModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
            <MaxWidthLayout className="px-4 py-3">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <div className="text-xl font-semibold flex items-center gap-1">
                            <Image src={logoImg} alt="" className="w-[154px] h-[30px] md:w-[200px] md:h-[40px]"/>
                        </div>
                    </div>

                    {/* Search Bar - Full width on mobile, adaptive on desktop */}
                    <div className="w-full md:max-w-2xl order-3 md:order-2">
                        <SearchBar/>
                    </div>
                    {/* Right side controls */}
                    <div className="flex items-center gap-3 w-full md:w-auto md:ml-auto order-2 md:order-3">
                        <div className="flex items-center justify-between w-full">
                            <LanguageSelector/>
                            <CitySelector/>
                            <Button
                                className="h-12 bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => setIsAuthModalOpen(true)}
                            >
                                Войти
                            </Button>
                        </div>
                    </div>
                    </div>
                </MaxWidthLayout>
        </header>
);
};
