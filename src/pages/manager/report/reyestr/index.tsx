import ParamTabs from "@/components/as-params/tabs"
import { DataTable } from "@/components/ui/datatable"
import { useColumns } from "./columns"
import { ParamCombobox } from "@/components/as-params/combobox"
import { useClients } from "@/constants/useClients"
import { usePlaces } from "@/constants/usePlaces"
import DownloadAsExcel from "@/components/download-as-excel"
import { useGet } from "@/hooks/useGet"
import { useSearch } from "@tanstack/react-router"
import { useState } from "react"
import ControlModal from "./control-modal"
import { usePaths } from "@/hooks/usePaths"

const Reyestr = () => {
    const [open, setOpen] = useState(false)
    const [current, setCurrent] = useState<any>()
    const search: any = useSearch({ from: "/_main" })
    const { data, isLoading } = useGet<{ total_pages: number; results: any[] }>(
        "checkout/summary/",
        { ...search, payment_type: search.type },
    )

    const canReyestr = !!usePaths().allPaths.includes("checkout/summary/")

    return (
        <>
            <DataTable
                columns={useColumns()}
                data={data?.results}
                loading={isLoading}
                onRowClick={(data) => {
                    setCurrent(data)
                    setOpen(true)
                }}
                paginationProps={{ totalPages: data?.total_pages || 1 }}
                head={
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <ParamTabs
                            paramName="payment_type"
                            options={[
                                {
                                    label: "Naqd",
                                    value: "cash",
                                },
                                {
                                    label: "Pul o'tkazish",
                                    value: "transfer",
                                },
                                {
                                    label: "Reyestr",
                                    value: "reyestr",
                                },
                            ]?.slice(0, canReyestr ? 3 : 2)}
                        />
                        <div className="flex flex-wrap items-center gap-2">
                            <ParamCombobox
                                options={useClients().clients}
                                paramName="client"
                                label="Buyurtmachi"
                            />
                            <ParamCombobox
                                options={usePlaces().places}
                                paramName="loading"
                                label="Qayerdan"
                            />
                            <ParamCombobox
                                options={usePlaces().places}
                                paramName="unloading"
                                label="Qayerga"
                            />
                            <ParamCombobox
                                options={[
                                    {
                                        label: "Naqd",
                                        value: "cash",
                                    },
                                    {
                                        label: "Pul o'tkazish",
                                        value: "transfer",
                                    },
                                ]?.slice(0, canReyestr ? 3 : 2)}
                                paramName="type"
                                label="Kirim turi"
                            />
                            <DownloadAsExcel
                                url="checkout/summary-excel/"
                                name="Menejer_reyestr"
                            />
                        </div>
                    </div>
                }
            />
            <ControlModal open={open} setOpen={setOpen} current={current} />
        </>
    )
}

export default Reyestr
