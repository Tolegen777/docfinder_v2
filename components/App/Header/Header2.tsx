'use client'
import React from 'react';
import {ChevronDown, Globe, MapPin, Search} from 'lucide-react';
import { Button } from "../../shadcn/button";
import { Input } from "../../shadcn/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../../shadcn/dropdown-menu";
import Image from "next/image";
import logoImg from '../../../shared/assets/images/logo.png'
import searchIcon from '../../../shared/assets/icon/search.svg'

const LanguageSelector = () => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                className="flex items-center gap-2 h-9"
            >
                <Globe className="h-4 w-4" />
                <span>RU</span>
                <ChevronDown className="h-4 w-4" />
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
                <MapPin className="h-4 w-4" />
                <span>Алматы</span>
                <ChevronDown className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem>Алматы</DropdownMenuItem>
            <DropdownMenuItem>Астана</DropdownMenuItem>
            <DropdownMenuItem>Шымкент</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

const Header = () => {
    return (
        <header className="w-full border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <div className="text-xl font-semibold flex items-center gap-1">
                            <Image src={logoImg} alt="" className="w-[154px] h-[30px] md:w-[200px] md:h-[40px]"/>
                        </div>
                    </div>

                    {/* Search Bar - Full width on mobile, adaptive on desktop */}
                    <div className="w-full md:max-w-2xl relative">
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Врач, услуга, болезнь, клиника"
                                className="w-full pl-4 pr-10 py-2 bg-green-50/50 border-0 focus:ring-1 focus:ring-green-500"
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Image src={searchIcon} alt="" className={'text-red-400'}/>
                        </div>
                    </div>

                    {/* Right side controls */}
                    <div className="flex items-center gap-3 ml-auto">
                        <LanguageSelector />
                        <CitySelector />
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                            Войти
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
