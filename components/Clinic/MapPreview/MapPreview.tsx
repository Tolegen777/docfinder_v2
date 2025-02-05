'use state'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '../../shadcn/dialog';
import { X } from 'lucide-react';

import {MaxWidthLayout} from "@/shared/ui/MaxWidthLayout";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import('./MapComponent'), {
    ssr: false,
    loading: () => <div className="w-full h-[400px] bg-gray-100 animate-pulse" />
});



const MapPreview = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <MaxWidthLayout className="py-4">
            <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-emerald-600 font-medium">20 клиник</span>
                    <span className="text-gray-900">в Алматы</span>
                </div>

                {/* Map Container */}
                <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden">
                    {!isOpen && (
                        <div className="absolute inset-0">
                            <MapComponent isPreview={true} />
                        </div>
                    )}

                    {/* Map Interaction Layer */}
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                               bg-white px-4 py-2 rounded-lg shadow-md
                               hover:bg-gray-50 transition-colors duration-200
                               text-gray-900 text-sm font-medium z-[400]">
                                Посмотреть на карте
                            </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl w-[90vw] h-[80vh] p-0">
                            <div className="relative h-full">
                                <MapComponent />
                                <DialogClose className="absolute top-4 right-4 z-[500]">
                                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50
                                   transition-colors duration-200">
                                        <X className="w-5 h-5 text-gray-600" />
                                    </button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </MaxWidthLayout>
    );
};

export default MapPreview;
