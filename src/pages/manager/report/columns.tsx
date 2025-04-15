import { Button } from "@/components/ui/button"
import useCan from "@/hooks/useCan"
import { formatMoney } from "@/lib/format-money"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Check, ChevronDown, MoveRight } from "lucide-react"

export const useColumns2 = ({
    handlePay,
}: {
    handlePay: (id: number, type: "qarz" | "chiqim") => void
}): ColumnDef<any>[] => {
    return [
        {
            header: "№",
            cell: ({ row }) =>
                row.original.name ?
                    row.index + 1
                :   row.original.date?.split("/").join("."),
        },
        {
            header: "Buyurtmachi",
            cell: ({ row }) =>
                row.original?.name ?
                    row.original.name
                :   <div className="flex items-center gap-2">
                        {row.original.loading_name}{" "}
                        <MoveRight width={18} className="text-primary" />{" "}
                        {row.original.unloading_name}
                    </div>,
        },
        {
            header: " ",
            cell: ({ row }) =>
                row.original.name ? "" : row.original?.car_number,
        },
        {
            header: "Qarzdorlik",
            cell: ({ row }) =>
                row.original?.name ?
                    formatMoney(row.original?.amounts?.sum_income)
                :   formatMoney(
                        row.original.income,
                        `${!row.original?.invoice_status && "text-destructive"} ${row.original.invoice_status === "approved" && "text-green-500"} ${row.original.invoice_status === "pending" && "text-orange-400"}`,
                    ),
        },
        {
            header: "Chiqim",
            cell: ({ row }) =>
                row.original?.name ?
                    formatMoney(row.original?.amounts?.sum_total_amount)
                :   formatMoney(row.original.total_amount),
        },
        {
            header: " ",
            cell: ({ row }) =>
                row.getCanExpand() ?
                    <ChevronDown
                        className={cn(
                            "text-muted-foreground",
                            row.getIsExpanded() ? "rotate-0" : "-rotate-90",
                        )}
                    />
                :   !row.original?.paid && (
                        <Button
                            variant="ghost"
                            className="!text-green-500"
                            onClick={() =>
                                handlePay(row.original?.id, "chiqim")
                            }
                            icon={<Check width={18} />}
                        />
                    ),
        },
    ]
}

export const useColumns = ({
    handlePay,
}: {
    handlePay: (id: number, type: "qarz" | "chiqim") => void
}): ColumnDef<any>[] => {
    return [
        {
            header: "№",
            cell: ({ row }) =>
                row.original.name ?
                    row.index + 1
                :   row.original.date?.split("/").join("."),
        },
        {
            header: "Buyurtmachi",
            cell: ({ row }) => (row.original?.name ? row.original.name : ""),
        },
        {
            header: " ",
            cell: ({ row }) =>
                row.original.name ?
                    ""
                :   <div className="flex items-center gap-2">
                        {row.original.loading_name}{" "}
                        <MoveRight width={18} className="text-primary" />{" "}
                        {row.original.unloading_name}
                    </div>,
        },
        {
            header: " ",
            cell: ({ row }) =>
                row.original.name ? "" : row.original.car_number,
        },
        {
            header: "Qarzdorlik",
            cell: ({ row }) =>
                row.original?.name ?
                    formatMoney(row.original?.amounts?.sum_income)
                :   <div className="flex items-center">
                        {formatMoney(row.original?.income)}{" "}
                        {useCan("checkout/pay-cash-order/$/") &&
                            !row.original?.client_paid && (
                                <Button
                                    icon={<Check width={16} />}
                                    size="sm"
                                    className="!text-green-500"
                                    variant="ghost"
                                    onClick={() =>
                                        handlePay(row.original.id, "qarz")
                                    }
                                />
                            )}
                    </div>,
        },
        {
            header: "Chiqim",
            cell: ({ row }) =>
                row.original?.name ?
                    formatMoney(row.original?.amounts?.sum_total_amount)
                :   <div className="flex items-center">
                        {formatMoney(row.original.total_amount)}{" "}
                        {useCan("checkout/pay-cash-order/$/") &&
                            !row.original?.paid && (
                                <Button
                                    icon={<Check width={16} />}
                                    size="sm"
                                    className="!text-green-500"
                                    variant="ghost"
                                    onClick={() =>
                                        handlePay(row.original.id, "chiqim")
                                    }
                                />
                            )}
                    </div>,
        },
        {
            header: " ",
            cell: ({ row }) =>
                row.original.name && row.getCanExpand() ?
                    <ChevronDown
                        className={cn(
                            "text-muted-foreground",
                            row.getIsExpanded() ? "rotate-0" : "-rotate-90",
                        )}
                    />
                :   "",
        },
    ]
}
