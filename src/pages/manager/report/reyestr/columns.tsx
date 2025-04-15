import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePrompt } from "@/hooks/usePrompt"
import { useRequest } from "@/hooks/useRequest"
import { formatMoney } from "@/lib/format-money"
import { useQueryClient } from "@tanstack/react-query"
import { useSearch } from "@tanstack/react-router"
import { ColumnDef } from "@tanstack/react-table"
import { Undo2 } from "lucide-react"
import { toast } from "sonner"

export const useColumns = (): ColumnDef<any>[] => {
    const queryClient = useQueryClient()
    const prompt = usePrompt()
    const search: any = useSearch({ from: "/_main" })

    const { post } = useRequest()
    async function undo(id: number, debt?: boolean) {
        const comment = await prompt()
        if (!comment) return
        toast.promise(
            post(
                debt ?
                    `checkout/rollback-paid-client-order/${id}/`
                :   `checkout/rollback-paid-order/${id}/`,
                { comment },
            ),
            {
                loading: "Qaytarilmoqda",
                success: () => {
                    queryClient.setQueryData(
                        [
                            "checkout/summary/",
                            { ...search, payment_type: search.type },
                        ],
                        (oldData: { total_pages: number; results: any[] }) => ({
                            ...oldData,
                            results: oldData.results.map((o: any) => {
                                if (o.id == id) {
                                    return {
                                        ...o,
                                        paid: !debt ? !o.paid : o.paid,
                                        client_paid:
                                            debt ?
                                                !o.client_paid
                                            :   o.client_paid,
                                    }
                                }
                                return o
                            }),
                        }),
                    )
                    queryClient.invalidateQueries({
                        queryKey: ["checkout/balance-info/"],
                    })
                    return "Muvaffaqiyatli qaytarildi"
                },
            },
        )
    }
    return [
        {
            header: "№",
            cell: ({ row }) => row.index + 1,
        },
        {
            header: "Buyurtmachi",
            accessorKey: "client",
        },
        {
            header: "Qayerdan",
            accessorKey: "loading",
        },
        {
            header: "Qayerga",
            accessorKey: "unloading",
        },
        {
            header: "Mashina raqami",
            accessorKey: "car_number",
        },
        {
            header: "Kirim",
            cell: ({ row }) => (
                <div className="flex items-center">
                    {formatMoney(row.original.income)}
                    {row.original.client_paid && (
                        <Button
                            icon={<Undo2 width={16} />}
                            variant="ghost"
                            size="icon"
                            className="!text-destructive"
                            onClick={() => undo(row.original.id, true)}
                        />
                    )}
                </div>
            ),
        },
        {
            header: "Chiqim",
            cell: ({ row }) => (
                <div className="flex items-center">
                    {formatMoney(row.original.total_amount)}
                    {row.original.paid && (
                        <Button
                            icon={<Undo2 width={16} />}
                            variant="ghost"
                            size="icon"
                            className="!text-destructive"
                            onClick={() => undo(row.original.id)}
                        />
                    )}
                </div>
            ),
        },
        {
            header: "Status",
            cell: ({ row }) =>
                row.original?.paid ?
                    <span className="text-green-500">To'landi</span>
                :   <span className="text-destructive">To'lanmagan</span>,
        },
        {
            header: "To'lov turi",
            cell: ({ row }) => (
                <Badge>
                    {row.original?.payment_type === "cash" ?
                        "Naqd"
                    :   "Pul o'tkazma"}
                </Badge>
            ),
        },
    ]
}
