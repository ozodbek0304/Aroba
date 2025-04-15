import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/datatable"
import { useRequest } from "@/hooks/useRequest"
import { useIsMutating, useQueryClient } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { Check, RefreshCw, Send, Undo2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { formatMoney } from "@/lib/format-money"
import { formatPhoneNumber } from "@/lib/format-phone-number"
import AudioPlayer from "./audio-player"
import FillModal from "./fill-modal"
import AddMoney from "./add-money"
import { useSearch } from "@tanstack/react-router"
import { useSocket } from "@/hooks/useSocket"
import useCan from "@/hooks/useCan"
import http from "@/lib/http"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useStatuses } from "@/constants/useStatuses"
import { useConfirm } from "@/hooks/useConfirm"

const FillOrder = () => {
    const search: any = useSearch({ from: "/_main" })
    const [open, setOpen] = useState(false)
    const [addMoney, setAddMoney] = useState(false)
    const [current, setCurrent] = useState<FillingOrder>()
    const { data, isLoading } = useSocket<{
        total_pages: number
        results: FillingOrder[]
    }>(
        "dispatchers/filling-orders/",
        "filling-orders",
        search,
        {},
        { isPaginated: true },
    )
    const isMutating = useIsMutating({ mutationKey: ["order/status_reject/"] })

    return (
        <>
            <DataTable
                data={data?.results || []}
                paginationProps={{ totalPages: data?.total_pages || 1 }}
                columns={useColumns({ setCurrent, setOpen, setAddMoney })}
                loading={(isLoading && !data) || !!isMutating}
            />
            <FillModal open={open} setOpen={setOpen} current={current} />
            <AddMoney
                open={addMoney}
                setOpen={setAddMoney}
                current={current as FillingOrder}
            />
        </>
    )
}

export default FillOrder

interface thisProps {
    setCurrent: (val: FillingOrder) => void
    setOpen: (val: boolean) => void
    setAddMoney: (val: boolean) => void
}

const useColumns = ({
    setOpen,
    setCurrent,
    setAddMoney,
}: thisProps): ColumnDef<FillingOrder>[] => {
    const search: any = useSearch({ from: "/_main" })
    const confirm = useConfirm()

    const { patch } = useRequest()
    const queryClient = useQueryClient()
    async function handleUndo(id: number) {
        toast.promise(
            http.get(`dispatchers/book-order/${id}/`).then(() => {
                queryClient.setQueryData(
                    ["dispatchers/filling-orders/", search],
                    (oldData: {
                        total_pages: number
                        results: FillingOrder[]
                    }) => ({
                        ...oldData,
                        results: oldData?.results?.filter((o) => o.id !== id),
                    }),
                )
            }),
            {
                loading: "Qaytarilmoqda",
                success: "Muvaffaqiyatli qaytarildi",
                error: (error) =>
                    error?.response?.data?.detail || "Xatolik yuz berdi",
            },
        )
    }

    const canChangeStatus = useCan("managers/status-orders/$/")

    async function changeStatus(id: number, status: string) {
        const isConfirmed =
            +status > 5 ? await confirm({ title: "Tasdiqlansinmi?" }) : true
        if (!isConfirmed) return
        await patch(`managers/status-orders/${id}/`, { status: status })
        queryClient.setQueryData(
            ["dispatchers/filling-orders/", search],
            (oldData: { total_pages: number; results: Status[] }) => ({
                ...oldData,
                results:
                    id == 9 ?
                        oldData?.results?.filter((o) => o.id !== id)
                    :   oldData?.results?.map((o) => {
                            if (o.id === id) {
                                return { ...o, status: status }
                            } else {
                                return o
                            }
                        }),
            }),
        )
        toast.success("Muvaffaqiyatli o'zgartirildi")
    }

    function onSend(phone: string,id:number) {
        toast.promise(http.get(`imb/send-contact/${phone}/${id}/`), {
            loading: "Yuborilmoqda",
            success: "Muvaffaqiyatli yuborildi",
            error: (error) =>
                error?.response?.data?.detail || "Xatolik yuz berdi",
        })
    }

    return [
        {
            header: "№",
            cell: ({ row }) => row.index + 1,
        },
        {
            header: "Buyurtmachi",
            cell: ({ row }) => row.original.client?.name,
        },
        {
            header: "Dispetcher",
            cell: ({ row }) =>
                (row.original?.dispatcher?.first_name || "") +
                " " +
                (row.original?.dispatcher?.last_name || ""),
        },
        {
            header: "Sana",
            accessorKey: "date",
        },
        {
            header: "Qayerdan",
            cell: ({ row }) => row.original.loading?.name,
        },
        {
            header: "Qayerga",
            cell: ({ row }) => row.original.unloading?.name,
        },
        {
            header: "Avto raqami",
            cell: ({ row }) => (
                <span className="text-nowrap">{row.original.car_number}</span>
            ),
        },
        {
            header: "Haydovchi raqami",
            cell: ({ row }) =>
                row.original.driver_phone && (
                    <a
                        href={`tel:${row.original.driver_phone}`}
                        className="text-nowrap"
                    >
                        {formatPhoneNumber(row.original.driver_phone)}
                    </a>
                ),
        },
        {
            header: "Summa",
            cell: ({ row }) => formatMoney(row.original.total_amount),
        },
        {
            header: "Holati",
            cell: ({ row }) => (
                <DropdownMenu>
                    {canChangeStatus && row.original.status != 2 && (
                        <DropdownMenuTrigger className="w-full">
                            <div className="rounded-md bg-secondary flex items-center justify-center gap-1.5 px-2 py-1 w-full text-primary">
                                <RefreshCw width={16} />{" "}
                                <span className="text-xs font-semibold text-nowrap">
                                    {
                                        useStatuses()?.find(
                                            (u) =>
                                                +u.value == row.original.status,
                                        )?.label
                                    }
                                </span>
                            </div>
                        </DropdownMenuTrigger>
                    )}
                    <DropdownMenuContent>
                        {useStatuses({
                            from: row.original.status?.toString(),
                            finish: false,
                        })?.map((u) => (
                            <DropdownMenuItem
                                key={u.value}
                                onClick={() =>
                                    changeStatus(row.original?.id, u.value)
                                }
                            >
                                {u.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
        {
            header: "Qo'shimcha summa",
            cell: ({ row }) =>
                row.original.extra_amount?.amount ?
                    <div className="flex flex-col items-start gap-1">
                        {formatMoney(row.original.extra_amount?.amount)}
                        {row.original.extra_amount?.comment ?
                            <span className="text-muted-foreground">
                                {row.original.comment}
                            </span>
                        :   <AudioPlayer
                                audioUrl={row.original.extra_amount?.file}
                            />
                        }
                    </div>
                :   useCan("managers/additional-amount/$/") && (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                                setAddMoney(true)
                                setCurrent(row.original)
                            }}
                        >
                            Qo'shib berish
                        </Button>
                    ),
        },
        {
            header: "Amallar",
            cell: ({ row }) =>
                row.original.status == 2 ?
                    <div className="flex">
                        {useCan("managers/rollback-order/$/") && (
                            <Button
                                icon={<Undo2 width={18} />}
                                variant="ghost"
                                size="icon"
                                className="!text-destructive"
                                onClick={() => handleUndo(row.original.id)}
                            />
                        )}
                        {useCan("dispatchers/fill-order/$/") && (
                            <Button
                                icon={<Check width={18} />}
                                variant="ghost"
                                size="icon"
                                className="!text-green-500"
                                onClick={() => {
                                    setOpen(true)
                                    setCurrent(row.original)
                                }}
                            />
                        )}
                    </div>
                :   <Button
                        variant="ghost"
                        icon={<Send width={18} />}
                        className="!text-primary"
                        onClick={() => onSend(row.original?.driver_phone || "",row.original.id)}
                    />,
        },
    ]
}
