import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem, PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/shadcn/pagination";
import {cn} from "@/lib/utils";
import React, { useState, useEffect } from "react";

export const DoctorsPagination = ({
                                      currentPage,
                                      totalPages,
                                      onPageChange,
                                      onPrevNext
                                  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPrevNext: (page: number) => void;
}) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    let displayedPages = pages;

    // Логика для мобильных устройств
    if (isMobile) {
        if (totalPages <= 3) {
            displayedPages = pages;
        } else {
            // Показываем только текущую страницу и соседние (максимум 3 страницы)
            if (currentPage === 1) {
                displayedPages = [1, 2, -1, totalPages];
            } else if (currentPage === totalPages) {
                displayedPages = [1, -1, totalPages - 1, totalPages];
            } else {
                displayedPages = [1, -1, currentPage, -1, totalPages];
            }
        }
    } else {
        // Логика для десктопа (оригинальная)
        if (totalPages > 7) {
            if (currentPage <= 4) {
                displayedPages = [...pages.slice(0, 5), -1, totalPages];
            } else if (currentPage >= totalPages - 3) {
                displayedPages = [1, -1, ...pages.slice(totalPages - 5)];
            } else {
                displayedPages = [
                    1,
                    -1,
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    -1,
                    totalPages,
                ];
            }
        }
    }

    return (
        <div className="mt-8 mb-4">
            {/* Информация о странице на мобильных устройствах */}
            {isMobile && (
                <div className="text-center text-sm text-muted-foreground mb-4">
                    Страница {currentPage} из {totalPages}
                </div>
            )}

            <Pagination className={cn(isMobile && "scale-90")}>
                <PaginationContent className={cn(
                    "flex-wrap justify-center gap-1",
                    isMobile && "gap-0.5"
                )}>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onPrevNext(currentPage - 1);
                            }}
                            className={cn(
                                currentPage === 1 ? 'pointer-events-none opacity-50' : '',
                                'gap-1',
                                isMobile ? 'pl-1.5 text-xs' : 'pl-2.5'
                            )}
                        >
                            {isMobile ? 'Назад' : 'Назад'}
                        </PaginationPrevious>
                    </PaginationItem>

                    {displayedPages.map((pageNum, i) => (
                        pageNum === -1 ? (
                            <PaginationItem key={`ellipsis-${i}`}>
                                <PaginationEllipsis className={cn(
                                    isMobile && "h-8 w-8"
                                )} />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={pageNum}>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(pageNum);
                                    }}
                                    isActive={pageNum === currentPage}
                                    className={cn(
                                        isMobile && "h-8 w-8 text-xs",
                                        pageNum === currentPage && isMobile && "font-bold"
                                    )}
                                >
                                    {pageNum}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onPrevNext(currentPage + 1);
                            }}
                            className={cn(
                                currentPage === totalPages ? 'pointer-events-none opacity-50' : '',
                                'gap-1',
                                isMobile ? 'pr-1.5 text-xs' : 'pr-2.5'
                            )}
                        >
                            {isMobile ? 'Вперед' : 'Вперед'}
                        </PaginationNext>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};
