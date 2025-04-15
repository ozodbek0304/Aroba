import { DataTable } from "@/components/ui/datatable"
import { useColumns } from "./columns"
import { useState } from "react"
import { CheckModal } from "./check-modal"
import DownloadAsExcel from "@/components/download-as-excel"
import { useGet } from "@/hooks/useGet"
import { useSearch } from "@tanstack/react-router"

const Contract = () => {
    const [open, setOpen] = useState(false)
    const [currentData, setCurrentData] = useState<MakeContractData>()

    const search: any = useSearch({ from: "/_main" })

    const { data, isLoading } = useGet<{
        total_pages: number
        results: MakeContractData[]
    }>("accountant/clients/", search, {
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    })

    async function handleForm(d: MakeContractData) {
        setOpen(true)
        setCurrentData(d)
    }

    return (
        <>
            <DataTable
                columns={useColumns({ handleForm })}
                data={data?.results}
                loading={isLoading}
                paginationProps={{ totalPages: data?.total_pages }}
                head={
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg sm:text-xl font-medium">
                            Shartnoma
                        </h3>
                        <DownloadAsExcel
                            url="accountant/clients-excel/"
                            name="Buxgalteriya-Shartnomalar"
                        />
                    </div>
                }
            />
            <CheckModal
                d={currentData as MakeContractData}
                open={open}
                setOpen={setOpen}
            />
        </>
    )
}

export default Contract
