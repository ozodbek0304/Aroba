import OrderCard from "./order-card"
import Loading from "@/layouts/loading"
import useFilter from "@/hooks/useFilter"
import { ParamCombobox } from "@/components/as-params/combobox"
import { useClients } from "@/constants/useClients"
import { useSearch } from "@tanstack/react-router"
import { useSocket } from "@/hooks/useSocket"

const Orders = () => {
    const search: any = useSearch({ from: "/_main" })
    const { data, isLoading } = useSocket<Order[]>(
        `dispatchers/new-orders/`,
        "dispatcher-orders",
    )
    const filtered = useFilter<Order>(data)?.filter(
        (f) => !search.client || f.client == search.client,
    )

    return (
        <>
            <div className="head-div !justify-end flex-col">
                <ParamCombobox
                    paramName="client"
                    options={useClients().clients}
                    label="Buyurtmachi"
                    returnVal="label"
                />
            </div>
            <Loading loading={isLoading}>
                <div className="grid grid-cols-[repeat(auto-fill,_minmax(20.5rem,_auto))] gap-4 md:gap-6">
                    {filtered?.map((c) => <OrderCard key={c.id} c={c} />)}
                </div>
            </Loading>
        </>
    )
}

export default Orders
