import React from 'react';
import Link from 'next/link';
import { Menu, Search, Globe, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from "@/components/shadcn/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";

interface LanguageOption {
    code: string;
    name: string;
}

const LANGUAGES: LanguageOption[] = [
    { code: 'RU', name: 'Русский' },
    { code: 'KZ', name: 'Қазақша' },
    { code: 'EN', name: 'English' },
];

const CITIES: string[] = [
    'Алматы',
    'Астана',
    'Шымкент',
    'Караганда',
    'Актобе',
];

const Logo = () => (
    <Link href="/public" className="flex items-center">
        <span className="text-xl font-bold">Doc</span>
        <span className="text-xl font-bold text-green-500">finder</span>
    </Link>
);

const SearchInput = () => (
    <div className="relative w-full max-w-2xl">
        <input
            type="text"
            placeholder="Врач, услуга, болезнь, клиника"
            className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-green-500 bg-green-50"
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
    </div>
);

const LanguageSelector = ({ isMobile = false }: { isMobile?: boolean }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                className={`flex items-center space-x-1 h-8 px-2 ${isMobile ? 'w-full justify-between' : ''}`}
            >
                <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>RU</span>
                </div>
                <ChevronDown className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isMobile ? "start" : "end"}>
            {LANGUAGES.map((lang) => (
                <DropdownMenuItem key={lang.code}>
                    {lang.name}
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
);

const CitySelector = ({ isMobile = false }: { isMobile?: boolean }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                className={`flex items-center space-x-1 h-8 px-2 ${isMobile ? 'w-full justify-between' : ''}`}
            >
                <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Алматы</span>
                </div>
                <ChevronDown className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isMobile ? "start" : "end"}>
            {CITIES.map((city) => (
                <DropdownMenuItem key={city}>
                    {city}
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
);

const LoginButton = ({ className = '' }: { className?: string }) => (
    <Button className={`bg-green-500 hover:bg-green-600 text-white ${className}`}>
        Войти
    </Button>
);

const MobileMenu = () => (
    <Sheet>
        <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
            </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px]">
            <SheetHeader>
                <SheetTitle>Меню</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-4 mt-8">
                <SearchInput />
                <div className="px-2">
                    <LanguageSelector isMobile />
                </div>
                <div className="px-2">
                    <CitySelector isMobile />
                </div>
                <LoginButton className="w-full" />
            </div>
        </SheetContent>
    </Sheet>
);

const DesktopNavigation = () => (
    <div className="hidden md:flex items-center space-x-4">
        <LanguageSelector />
        <CitySelector />
        <LoginButton />
    </div>
);

const Header = () => {
    return (
        <header className="w-full border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Logo />
                    </div>

                    <div className="hidden md:flex flex-1 mx-8">
                        <SearchInput />
                    </div>

                    <DesktopNavigation />

                    <div className="flex md:hidden items-center space-x-4">
                        <MobileMenu />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
