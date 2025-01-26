import React from 'react';
import Link from 'next/link';
import { Search, Globe, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '../../shadcn/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../shadcn/dropdown-menu";

const Logo = () => (
    <Link href="/public" className="flex items-center">
        <span className="text-xl font-bold">Doc</span>
        <span className="text-xl font-bold text-green-500">finder</span>
    </Link>
);

const SearchInput = () => (
    <div className="relative w-full">
        <input
            type="text"
            placeholder="Врач, услуга, болезнь, клиника"
            className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-green-500 bg-green-50"
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
    </div>
);

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
        <header className="w-full border-b">
            <div className="container mx-auto px-4">
                {/* Top row - Logo and Actions */}
                <div className="flex items-center justify-between h-16">
                    <Logo />

                    {/* Desktop Navigation */}
                    <div className="flex items-center space-x-2">
                        <LanguageSelector />
                        <CitySelector />
                        <Button className="bg-green-500 hover:bg-green-600 text-white">
                            Войти
                        </Button>
                    </div>
                </div>

                {/* Bottom row - Search (visible on mobile) */}
                <div className="pb-4 ">
                    <SearchInput />
                </div>
            </div>
        </header>
    );
};

export default Header;
