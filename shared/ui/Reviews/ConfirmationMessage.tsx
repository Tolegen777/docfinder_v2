import React from 'react';
import {cn} from "@/lib/utils";

export const ConfirmationMessage = ({classname}: { classname?: string }) => {
    return (
        <div
            className={cn('flex items-center px-5 py-[7px] gap-2.5 bg-white rounded-[10px] border border-gray-200', classname)}>
      <span className="text-base font-normal text-gray-900">
        Прием в клинике подтвержден
      </span>
            <div className="flex items-center justify-center size-5 bg-primary rounded-full">
                <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </div>
        </div>
    );
};
