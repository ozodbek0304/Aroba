import { useStatuses } from "@/constants/useStatuses"
import { useSearch } from "@tanstack/react-router"
import { useState } from "react"
import OrderStatusCard from "./order-status-card"
import { useRequest } from "@/hooks/useRequest"
import Loading from "@/layouts/loading"
import ParamTabs from "@/components/as-params/tabs"
import { ParamCombobox } from "@/components/as-params/combobox"
import { ParamSelect } from "@/components/as-params/select"
import { useClients } from "@/constants/useClients"
import { useSocket } from "@/hooks/useSocket"
import ParamPagination from "@/components/as-params/pagination"

const OrderStatus = () => {
    const [selecteds, setSelecteds] = useState<number[]>([])

    const search: any = useSearch({ from: "/_main" })
    const { isPending } = useRequest()
    const { data, isFetching, isLoading } = useSocket<{
        results: Status[]
        total_pages: number
    }>(
        "managers/status-orders/",
        "status-orders",
        {
            ...search,
            status: search.status === "all" ? undefined : search.status,
        },
        {},
        { isPaginated: true },
    )

    return (
        <div className="space-y-4 relative">
            <div className="head-div">
                <div className="w-auto max-w-full overflow-y-hidden overflow-x-auto h-10 ">
                    <ParamTabs
                        options={useStatuses({ finish: false })}
                        paramName="status"
                        disabled={isFetching}
                    />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:w-max">
                    <ParamCombobox
                        options={useClients().clients}
                        paramName="client"
                        label="Buyurtmachi"
                        disabled={isFetching}
                    />
                    <ParamSelect
                        options={moneys}
                        paramName="payment_type"
                        label="To'lov turi"
                        className="w-full"
                        disabled={isFetching}
                    />
                </div>
            </div>
            <ParamPagination
                totalPages={data?.total_pages}
                disabled={isFetching}
            />
            <Loading loading={isLoading}>
                <div className="grid grid-cols-[repeat(auto-fill,_minmax(20.5rem,_auto))] gap-4 md:gap-6">
                    {data?.results?.map((d, i) => (
                        <OrderStatusCard
                            key={i}
                            c={d}
                            selecteds={selecteds}
                            setSelecteds={setSelecteds}
                            loading={isPending}
                        />
                    ))}
                </div>
            </Loading>
        </div>
    )
}

export default OrderStatus

const moneys = [
    {
        label: "Hammasi",
        value: "all-type",
    },
    {
        label: "Naqd",
        value: "cash",
    },
    {
        label: "Pul o'tkazma",
        value: "transfer",
    },
]
