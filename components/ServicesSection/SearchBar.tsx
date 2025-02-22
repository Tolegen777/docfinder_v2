import {Search} from "lucide-react";
import React from "react";

export const SearchBar = () => (
    <div className="relative">
        <input
            type="text"
            placeholder="Поиск по услугам"
            className="w-full px-4 py-2 rounded-md border border-gray-200 bg-green-50 focus:outline-none focus:border-green-500"
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
    </div>
);
