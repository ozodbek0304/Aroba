import ParamTabs from "@/components/as-params/tabs"
import DownloadAsExcel from "@/components/download-as-excel"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/datatable"
import { useConfirm } from "@/hooks/useConfirm"
import { formatMoney } from "@/lib/format-money"
import { useSearch } from "@tanstack/react-router"
import { ColumnDef } from "@tanstack/react-table"
import { Check, Plus, Undo2 } from "lucide-react"
import { useState } from "react"
import AddSend from "./add-send"
import { useGet } from "@/hooks/useGet"
import { useRequest } from "@/hooks/useRequest"
import { useQueryClient } from "@tanstack/react-query"
import useCan from "@/hooks/useCan"
import { usePrompt } from "@/hooks/usePrompt"
import { toast } from "sonner"

const Checkout = () => {
    const [open, setOpen] = useState(false)
    const search: any = useSearch({ from: "/_main" })
    const confirm = useConfirm()
    const prompt = usePrompt()
    const queryClient = useQueryClient()

    const { put, isPending } = useRequest()

    const { data: send, isLoading } = useGet<{
        total_pages: number
        results: Send[]
    }>(
        "checkout/transactions/",
        { ...search, type: "income" },
        {
            refetchOnMount: true,
            refetchOnWindowFocus: true,
        },
    )

    const { data: receipt, isLoading: isReceiptLoading } = useGet<{
        total_pages: number
        results: Send[]
    }>(
        "checkout/transactions/",
        { ...search, type: "expense" },
        {
            refetchOnMount: true,
            refetchOnWindowFocus: true,
        },
    )

    async function handleAccept(id: number, status: boolean) {
        const isConfirmed =
            status && (await confirm({ title: "Tasdiqlansinmi?" }))
        const rejected = !status ? await prompt() : undefined
        if (isConfirmed || !!rejected) {
            await put(`checkout/transactions/${id}/`, {
                status: status ? "approved" : "cancelled",
                rejected,
            })
            queryClient.setQueryData(
                [
                    "checkout/transactions/",
                    { ...search, type: search.type || "income" },
                ],
                (oldData: { total_pages: number; results: Send[] }) => ({
                    ...oldData,
                    results: oldData?.results?.map((o) =>
                        o.id === id ?
                            {
                                ...o,
                                status: status ? "approved" : "cancelled",
                                rejected,
                            }
                        :   o,
                    ),
                }),
            )
            queryClient.invalidateQueries({
                queryKey: ["checkout/balance-info/"],
            })
            toast.success("Muvaffaqiyatli o'zgartirildi")
        }
    }

    const canAccept = useCan("checkout/transactions/$/")
    const canAddSend = useCan("checkout/transactions/")

    const columns: ColumnDef<any>[] = [
        {
            header: "№",
            cell: ({ row }) => row.index + 1,
        },
        {
            header: "Sana",
            cell: ({ row }) =>
                row.original?.created_at?.slice(0, 10)?.split("/").join("."),
        },
        {
            header: "Summa",
            cell: ({ row }) => formatMoney(row.original?.amount),
        },
        {
            header: "Izoh",
            accessorKey: "comment",
        },
        {
            header: "Qaytarish izohi",
            accessorKey: "rejected",
        },
        {
            header: " ",
            cell: ({ row }) =>
                canAccept && row.original?.status === "pending" ?
                    <div className="flex gap-2">
                        <Button
                            className="!bg-green-500"
                            icon={<Check width={16} />}
                            size="sm"
                            onClick={() => handleAccept(row.original.id, true)}
                        >
                            Tasdiqlash
                        </Button>
                        <Button
                            icon={<Undo2 width={16} />}
                            size="sm"
                            variant="destructive"
                            onClick={() => handleAccept(row.original.id, false)}
                        >
                            Qaytarish
                        </Button>
                    </div>
                : row.original?.status === "approved" ?
                    <Button size="sm" className="!bg-green-500">
                        Tasdiqlangan
                    </Button>
                :   <Button size="sm" variant="destructive">
                        Qaytarilgan
                    </Button>,
        },
    ]

    return (
        <>
            <DataTable
                columns={search.type === "expense" ? columns2 : columns}
                data={
                    search.type === "expense" ? receipt?.results : send?.results
                }
                paginationProps={{
                    totalPages:
                        search.type === "expense" ?
                            receipt?.total_pages
                        :   send?.total_pages,
                }}
                loading={isLoading || isReceiptLoading || isPending}
                head={
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <ParamTabs
                            paramName="type"
                            options={[
                                {
                                    label: "Kirim",
                                    value: "income",
                                },
                                {
                                    label: "Chiqim",
                                    value: "expense",
                                },
                            ]}
                        />
                        <div className="flex gap-x-4 gap-y-2 flex-wrap">
                            <DownloadAsExcel
                                name={
                                    search.type === "expense" ?
                                        "Chiqimlar"
                                    :   "Kirimlar"
                                }
                                url={
                                    search.type === "expense" ?
                                        "checkout/transactions-excel/?type=expense"
                                    :   "checkout/transactions-excel/?type=income"
                                }
                            />
                            {search.type === "expense" && canAddSend && (
                                <Button
                                    icon={<Plus width={20} />}
                                    onClick={() => setOpen(true)}
                                >
                                    Chiqim
                                </Button>
                            )}
                        </div>
                    </div>
                }
            />
            <AddSend open={open} setOpen={setOpen} />
        </>
    )
}

export default Checkout

const columns2: ColumnDef<any>[] = [
    {
        header: "№",
        cell: ({ row }) => row.index + 1,
    },
    {
        header: "Sana",
        cell: ({ row }) => row.original?.created_at,
    },
    {
        header: "Summa",
        cell: ({ row }) => formatMoney(row.original?.amount),
    },
    {
        header: "Izoh",
        accessorKey: "comment",
    },
    {
        header: "Qaytarish izohi",
        accessorKey: "rejected",
    },
    {
        header: "Status",
        cell: ({ row }) =>
            row.original.status === "pending" ?
                <Button size="sm">Kutilmoqda</Button>
            :   <Button size="sm" className="!bg-green-500">
                    Tasdiqlangan
                </Button>,
    },
]
