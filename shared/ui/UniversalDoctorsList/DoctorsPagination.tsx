import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem, PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/shadcn/pagination";
import {cn} from "@/lib/utils";
import React from "react";

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
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    let displayedPages = pages;

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

    return (
        <Pagination className="mt-8">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onPrevNext(currentPage - 1);
                        }}
                        className={cn(
                            currentPage === 1 ? 'pointer-events-none opacity-50' : '',
                            'gap-1 pl-2.5'
                        )}
                    >
                        Назад
                    </PaginationPrevious>
                </PaginationItem>

                {displayedPages.map((pageNum, i) => (
                    pageNum === -1 ? (
                        <PaginationItem key={`ellipsis-${i}`}>
                            <PaginationEllipsis />
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
                            'gap-1 pr-2.5'
                        )}
                    >
                        Вперед
                    </PaginationNext>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};
