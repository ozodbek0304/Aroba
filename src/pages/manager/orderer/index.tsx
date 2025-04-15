import ParamTabs from "@/components/as-params/tabs"
import { CollapsibleDataTable } from "@/components/collapsible-table"
import { useGet } from "@/hooks/useGet"
import { useColumns, useColumns2 } from "./columns"
import AddOrderer from "./add-orderer"
import { useState } from "react"
import ControlRoute from "./control-route"
import { useSearch } from "@tanstack/react-router"
import useCan from "@/hooks/useCan"

const Orderer = () => {
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [current, setCurrent] = useState<ClientRoute>()

    const search: any = useSearch({ from: "/_main" })

    const { data, isLoading } = useGet<{ total_pages: number, results: Client[] }>('clients/', { ...search, type: search.type ? search.type : 'cash' }, { refetchOnMount: true, refetchOnWindowFocus: true })

    return (
        <div>
            <CollapsibleDataTable
                columns={search.type === 'transfer' ? useColumns2({ onAdd: () => setOpen2(true), onEdit: (val) => { setCurrent(val); setOpen2(true); } }) : useColumns({
                    onAdd: () => setOpen2(true), onEdit: (val) => {
                        setCurrent(val)
                        setOpen2(true)
                    }
                })}
                data={data?.results?.map((item) => ({ ...item, subRows: item.routes }))}
                paginationProps={{ totalPages: data?.total_pages || 1 }}
                loading={isLoading}
                head={
                    <div className="flex items-center justify-between">
                        <ParamTabs paramName="type" options={[
                            {
                                label: "Naqd",
                                value: 'cash'
                            },
                            {
                                label: "Pul o'tkazish",
                                value: 'transfer'
                            }
                        ]} />
                        {useCan('clients/') && <AddOrderer open={open} setOpen={setOpen} />}
                    </div>
                }
            />
            <ControlRoute open={open2} setOpen={setOpen2} current={current} />
        </div>
    )
}

export default Orderer
