import { useNavigate, useSearch } from "@tanstack/react-router"
import { useConfirm } from "@/hooks/useConfirm"
import { useRequest } from "@/hooks/useRequest"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { toast } from "sonner"
import { formatMoney } from "@/lib/format-money"
import DownloadAsExcel from "@/components/download-as-excel"
import { CollapsibleDataTable } from "@/components/collapsible-table"
import { useColumns } from "./columns"
import { useGet } from "@/hooks/useGet"
import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"

const CheckTransfer = () => {
    const search: any = useSearch({ from: "/_main" })
    const navigate = useNavigate()
    const confirm = useConfirm()
    const queryClient = useQueryClient()

    const total_amount = search?.total_amount
    const selecteds = search?.selecteds

    const { data, isLoading } = useGet<{
        total_pages: number
        results: Send[]
    }>(
        "accountant/invoice-orders/",
        { ...search, selecteds: undefined },
        {
            refetchOnMount: true,
            refetchOnWindowFocus: true,
        },
    )

    const { post, isPending } = useRequest()

    async function onSend() {
        const isConfirmed = await confirm({ title: "Tasdiqlansinmi?" })
        if (isConfirmed) {
            toast.promise(
                post(`accountant/create-invoice/`, { orders: selecteds }).then(
                    () => {
                        queryClient.invalidateQueries({
                            queryKey: [
                                "accountant/invoice-orders/",
                                { ...search, selecteds: undefined },
                            ],
                        })
                        navigate({
                            search: {
                                ...search,
                                selecteds: undefined,
                                total_amount: undefined,
                            },
                        })
                    },
                ),
                {
                    loading: "Yuborilmoqda",
                    success: "Muvaffaqiyatli yuborildi",
                },
            )
        }
    }

    useEffect(() => {
        navigate({
            search: {
                ...search,
                selecteds: undefined,
                total_amount: undefined,
            },
        })
    }, [])

    return (
        <CollapsibleDataTable
            columns={useColumns()}
            data={data?.results?.map((f) => ({
                ...f,
                subRows: f.invoices?.map((i) => ({
                    ...i,
                    subRows: i.to_orders,
                })),
            }))}
            loading={isLoading}
            paginationProps={{ totalPages: data?.total_pages }}
            head={
                <div className="flex flex-col md:flex-row md:items-center justify-between  gap-4">
                    <h3 className="text-lg sm:text-xl font-medium">
                        Hisob faktura
                    </h3>
                    <div className="flex gap-2 flex-col sm:flex-row">
                        <Button variant="secondary">
                            Jami qarzdorlik: {formatMoney(Number(total_amount))}
                        </Button>
                        <Button
                            icon={<Check width={18} />}
                            onClick={onSend}
                            disabled={!selecteds?.length || isPending}
                        >
                            Yuborish
                        </Button>
                        <DownloadAsExcel url="" name="" />
                    </div>
                </div>
            }
        />
    )
}

export default CheckTransfer
