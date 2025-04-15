import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import {
    Pagination2,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "../ui/pagination2"
import { cn } from "@/lib/utils"
import { useNavigate, useSearch } from "@tanstack/react-router"
import Select from "../ui/select"

const ParamPagination: React.FC<PaginationProps> = ({
    totalPages = 1,
    page_sizes = [10, 25, 50, 75, 100],
    paramName = "page",
    pageSizeParamName = "page_size",
    disabled = false,
    changePageSize = true,
    PageSize = 25,
}) => {
    const navigate = useNavigate()
    const search: any = useSearch({ from: "/_main" }) as Record<
        string,
        string | undefined
    >

    let currentPage = parseInt(search[paramName] || "1", 10)
    currentPage =
        isNaN(currentPage) || currentPage < 1 ?
            1
            : Math.min(currentPage, totalPages)

    const childPages = window.innerWidth <= 640 ? 1 : 2

    const getPageNumbers = (): Array<number | string> => {
        const pages: Array<number | string> = []
        pages.push(1)

        if (currentPage <= childPages + 3) {
            for (let i = 2; i <= Math.min(childPages + 4, totalPages); i++) {
                pages.push(i)
            }
            if (totalPages > 5) pages.push("...")
        } else if (currentPage >= totalPages - 3) {
            if (totalPages > 5) pages.push("...")
            for (
                let i = Math.max(2, totalPages - (childPages + 3));
                i < totalPages;
                i++
            ) {
                pages.push(i)
            }
        } else {
            pages.push("...")
            for (
                let i = currentPage - childPages;
                i <= currentPage + childPages;
                i++
            ) {
                pages.push(i)
            }
            pages.push("...")
        }

        if (totalPages > 1) pages.push(totalPages)
        return pages
    }

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return
        navigate({
            search: { ...search, [paramName]: page },
        })
    }

    const handlePrevious = () => {
        handlePageChange(currentPage - 1)
    }

    const handleNext = () => {
        handlePageChange(currentPage + 1)
    }

    const pageNumbers =
        totalPages > 7 ? getPageNumbers() : (
            Array.from({ length: totalPages }, (_, i) => i + 1)
        )

    return (
        <div className="flex items-center gap-4">
            <Pagination2 className="w-auto m-0">
                <PaginationContent className="flex items-center gap-4">
                    <PaginationItem>
                        <Button
                            disabled={disabled || currentPage === 1 || totalPages < 2}
                            icon={<ChevronLeft width={20} />}
                            variant="ghost"
                            onClick={handlePrevious}
                            size="icon"
                            aria-label="Previous Page"
                            className={cn("w-7 h-7 mt-1 sm:m-0 sm:w-10 sm:h-10 !bg-primary border-none !text-primary-foreground", ((disabled || currentPage === 1) || totalPages < 2) && "cursor-not-allowed pointer-events-none !bg-secondary !text-secondary-foreground")}
                        />
                    </PaginationItem>
                    <div className="bg-secondary flex items-center rounded-md h-8">
                        {pageNumbers.map((page, index) =>
                            typeof page === "number" ?
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        isActive={page === currentPage}
                                        onClick={() => handlePageChange(page)}
                                        className={cn(
                                            "cursor-pointer hover:bg-transparent !text-primary",
                                            disabled &&
                                            "cursor-not-allowed pointer-events-none opacity-50",
                                            "w-7 h-7 sm:w-10 sm:h-10",
                                            currentPage === page && "!bg-primary border-none !text-primary-foreground shadow-pagination_shadow duration-0",
                                        )}
                                        aria-current={
                                            page === currentPage ? "page" : (
                                                undefined
                                            )
                                        }
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                                : <PaginationItem key={`ellipsis-${index}`}>
                                    <PaginationEllipsis
                                        className={cn(
                                            '!text-primary',
                                            disabled ?
                                                "cursor-not-allowed pointer-events-none opacity-50"
                                                : "",
                                            "w-4 sm:w-auto",
                                        )}
                                    />
                                </PaginationItem>,
                        )}
                    </div>
                    <PaginationItem>
                        <Button
                            disabled={disabled || currentPage === totalPages}
                            icon={<ChevronRight width={20} />}
                            variant="ghost"
                            onClick={handleNext}
                            size="icon"
                            aria-label="Next Page"
                            className={cn("w-7 h-7 mt-1 sm:m-0 sm:w-10 sm:h-10 !bg-primary border-none !text-primary-foreground", (disabled || currentPage === totalPages) && "cursor-not-allowed pointer-events-none !bg-secondary !text-secondary-foreground")}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination2>
            {changePageSize && (
                <Select
                    disabled={disabled}
                    className="w-20 h-8 sm:h-10"
                    label=""
                    options={page_sizes?.map((size) => ({
                        label: `${size}`,
                        value: `${size}`,
                    }))}
                    value={search[pageSizeParamName] || PageSize}
                    setValue={(value) =>
                        navigate({
                            search: {
                                ...search,
                                [pageSizeParamName]: +value,
                                [paramName]: 1,
                            },
                        })
                    }
                />
            )}
        </div>
    )
}

export default ParamPagination
