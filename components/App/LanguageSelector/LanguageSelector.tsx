import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/shared/ui/shadcn/dropdown-menu";
import {Button} from "@/shared/ui/shadcn/button";
import {ChevronDown, Globe} from "lucide-react";
import React from "react";

export const LanguageSelector = () => (
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
