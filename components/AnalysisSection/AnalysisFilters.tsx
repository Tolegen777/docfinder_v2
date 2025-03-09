import {Search} from "lucide-react";
import {Checkbox} from "@/components/shadcn/checkbox";
import {useServicesStore} from "@/shared/stores/useServicesStore";
import React from "react";

export const AnalysisFilters = () => {
    const { searchQuery, filters, setSearchQuery, setFilter } = useServicesStore();

    return (
        <div className="flex gap-6 items-center">
            <div className="relative flex-1 max-w-lg">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по анализам"
                    className="w-full px-4 py-2 rounded-md border border-gray-200 bg-green-50 focus:outline-none focus:border-green-500"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
            <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                        checked={filters.forKids}
                        onCheckedChange={(checked) => setFilter('forKids', checked as boolean)}
                    />
                    <span>Для детей</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox id="atHome"/>
                    <span>На дому</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox id="complex"/>
                    <span>Комплекс</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox id="express"/>
                    <span>Экспресс</span>
                </label>
            </div>
        </div>
    );
};
