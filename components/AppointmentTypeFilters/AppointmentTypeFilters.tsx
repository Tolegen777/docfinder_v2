import {Button} from "@/components/shadcn/button";
import {ChevronDown, Home, User2, Video} from "lucide-react";
import React from "react";

export const AppointmentTypeFilters = () => {
    return (
        <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 overflow-auto">
                <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-white"
                >
                    Онлайн консультация
                    <Video className="w-4 h-4 text-primary" />
                </Button>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-white"
                >
                    Очный прием
                    <User2 className="w-4 h-4 text-primary" />
                </Button>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-white"
                >
                    Выезд на дом
                    <Home className="w-4 h-4 text-primary" />
                </Button>
            </div>
            <Button className="bg-primary hover:bg-green-600 text-white w-full md:w-auto">
                На карте
            </Button>
            <div className="ml-auto w-full md:w-auto">
                <Button
                    variant="outline"
                    className="flex items-center gap-2 justify-between bg-green-light-1 w-full md:w-[300px]"
                >
                    Сортировка
                    <ChevronDown className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};
