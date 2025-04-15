import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { useStatuses } from "@/constants/useStatuses"
import useCan from "@/hooks/useCan"
import { useRequest } from "@/hooks/useRequest"
import { formatMoney } from "@/lib/format-money"
import { formatPhoneNumber } from "@/lib/format-phone-number"
import { cn } from "@/lib/utils"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ColumnDef } from "@tanstack/react-table"
import { ChevronDown, MoveRight } from "lucide-react"
import { toast } from "sonner"

export const useColumns = (): ColumnDef<any>[] => {
    const search: any = useSearch({ from: "/_main/_accounting/faktura" })
    const navigate = useNavigate()

    const { patch } = useRequest()
    const queryClient = useQueryClient()

    const selecteds = search?.selecteds
    const total_amount = search?.total_amount || 0
    async function handleSelect(id: number, amount: string) {
        if (selecteds?.includes(id)) {
            navigate({
                search: {
                    selecteds: selecteds?.filter((item: number) => item != id),
                    total_amount: total_amount - (Number(amount) || 0),
                } as any,
            })
        } else {
            navigate({
                search: {
                    selecteds: selecteds?.length ? [...selecteds, id] : [id],
                    total_amount: total_amount + (Number(amount) || 0),
                } as any,
            })
        }
    }

    function updateInvoice(id: number, status: string) {
        toast.promise(patch(`accountant/update-invoice/${id}/`, { status }), {
            loading: "O'zgartirilmoqda",
            success: () => {
                queryClient.invalidateQueries({
                    queryKey: [
                        "accountant/invoice-orders/",
                        { ...search, selecteds: undefined },
                    ],
                })
                return "Muvaffaqiyatli o'zgartirildi"
            },
        })
    }

    const hasAccess = useCan("accountant/update-invoice/$/")
    return [
        {
            header: "№",
            cell: ({ row }) =>
                row.original.accounting_phone ? row.index + 1
                : row.original?.loading_name ?
                    <Label
                        className="flex items-center gap-4"
                        htmlFor={`checkbox-${row.original?.id}`}
                    >
                        {!row.original?.invoice_id && (
                            <Checkbox
                                className="data-[state=checked]:bg-transparent data-[state=checked]:text-primary"
                                id={`checkbox-${row.original?.id}`}
                                onCheckedChange={() =>
                                    handleSelect(
                                        row.original?.id,
                                        row.original?.income,
                                    )
                                }
                                checked={selecteds?.includes(row.original?.id)}
                            />
                        )}
                        {row.original.loading_name}
                        <MoveRight width={18} className="text-primary" />
                        {row.original.unloading_name}
                    </Label>
                :   row.original.created_at?.slice(0, 10)?.split("-").join("."),
        },
        {
            header: "Firm nomi",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    {row.original.customer}{" "}
                    <span className="text-muted-foreground">
                        {row.original.inn}
                    </span>
                </div>
            ),
        },
        {
            header: "Buxgalter raqami",
            cell: ({ row }) =>
                row.original?.accounting_phone ?
                    formatPhoneNumber(row.original.accounting_phone) ||
                    row.original.inn
                :   row?.original?.car_number,
        },
        {
            header: "Jo'natilinmagan summa",
            cell: ({ row }) =>
                row.original?.name && formatMoney(row.original.amounts?.unsent),
        },
        {
            header: "Qarzdorlik",
            cell: ({ row }) =>
                row.original?.name ?
                    formatMoney(row.original.amounts?.pending)
                :   formatMoney(
                        row.original?.created_at ?
                            row.original.total_amount
                        :   row.original.income,
                    ),
        },
        {
            header: "To'lov qilingan",
            cell: ({ row }) =>
                row.original?.name &&
                formatMoney(row.original.amounts?.approved),
        },
        {
            header: " ",
            cell: ({ row }) =>
                row.getCanExpand() ?
                    <div className="flex gap-2 items-center justify-end">
                        {row.original?.status == "pending" && (
                            <DropdownMenu>
                                {hasAccess && (
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            size="sm"
                                            className="h-6"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Jarayonda <ChevronDown width={18} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                )}
                                <DropdownMenuContent
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                updateInvoice(
                                                    row.original.id,
                                                    "approved",
                                                )
                                            }
                                        >
                                            To'lov qilingan
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                updateInvoice(
                                                    row.original.id,
                                                    "cancelled",
                                                )
                                            }
                                        >
                                            Bekor qilish
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        {row.original?.status == "approved" && (
                            <DropdownMenu>
                                {hasAccess && (
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            size="sm"
                                            className="h-6 !bg-green-500"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            To'lov qilingan{" "}
                                            <ChevronDown width={18} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                )}
                                <DropdownMenuContent
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                updateInvoice(
                                                    row.original.id,
                                                    "pending",
                                                )
                                            }
                                        >
                                            Jarayonda
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                updateInvoice(
                                                    row.original.id,
                                                    "cancelled",
                                                )
                                            }
                                        >
                                            Bekor qilish
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        {!row.original?.status &&
                            !row.original?.accounting_phone && (
                                <Button
                                    size="sm"
                                    className="h-6"
                                    variant="destructive"
                                >
                                    Faktura berilmagan
                                </Button>
                            )}
                        <ChevronDown
                            className={cn(
                                "text-muted-foreground",
                                row.getIsExpanded() ? "rotate-0" : "-rotate-90",
                                row.original?.accounting_phone ?
                                    ""
                                :   "w-5 mr-2",
                            )}
                        />
                    </div>
                :   !row.original?.name && (
                        <Badge>
                            {
                                useStatuses()?.find(
                                    (f) => f.value == row.original?.status,
                                )?.label
                            }
                        </Badge>
                    ),
        },
    ]
}
