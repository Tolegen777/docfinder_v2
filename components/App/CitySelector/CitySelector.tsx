'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/shadcn/dropdown-menu";
import { Button } from "@/components/shadcn/button";
import { ChevronDown, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { CitiesAPI, City } from "@/shared/api/cityApi";
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import {useCityStore} from "@/stores/cityStore";

const SELECTED_CITY_COOKIE = 'selectedCity';

export const CitySelector = () => {
    const { data: cities = [], isLoading } = useQuery<City[]>({
        queryKey: ['cities'],
        queryFn: CitiesAPI.getCities,
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    const {currentCity, setCurrentCity} = useCityStore()

    // Инициализация выбранного города при загрузке данных
    useEffect(() => {
        if (cities.length > 0) {
            const savedCityId = Number(Cookies.get(SELECTED_CITY_COOKIE));
            const city = cities.find(city => city.id === savedCityId) || cities[0];
            setCurrentCity(city);
        }
    }, [cities]);

    const handleCitySelect = (city: City) => {
        setCurrentCity(city);
        Cookies.set(SELECTED_CITY_COOKIE, String(city.id), {
            expires: 365,
            path: '/'
        });
    };

    if (isLoading) {
        return (
            <Button
                variant="ghost"
                className="flex items-center gap-2 h-9"
            >
                <MapPin className="!size-7 text-primary"/>
                <span className="text-base">Загрузка...</span>
                <ChevronDown className="!size-5"/>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 h-9"
                >
                    <MapPin className="!size-7 text-primary"/>
                    <span className="text-base">{currentCity?.title}</span>
                    <ChevronDown className="!size-5"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {cities.map((city) => (
                    <DropdownMenuItem
                        key={city.id}
                        onClick={() => handleCitySelect(city)}
                        className={currentCity?.id === city.id ? 'bg-accent' : ''}
                    >
                        {city.title}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
