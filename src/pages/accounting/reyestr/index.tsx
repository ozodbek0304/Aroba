import DownloadAsExcel from "@/components/download-as-excel"
import { DataTable } from "@/components/ui/datatable"
import { useGet } from "@/hooks/useGet"
import { formatMoney } from "@/lib/format-money"
import { ColumnDef } from "@tanstack/react-table"

const Reyestr = () => {
    const { data, isLoading } = useGet<{ total_pages: number, results: Reyestr[] }>('accountant/finished-orders/')
    return (
        <div className="out-container">
            <DataTable columns={columns} data={data?.results} loading={isLoading} paginationProps={{ totalPages: data?.total_pages || 1 }} head={
                <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg sm:text-xl font-medium">Reyestr</h3>
                    <DownloadAsExcel url="accountant/finished-orders-excel/" name="Buxgalteriya-Reyestr" />
                </div>
            } />
        </div>
    )
}

export default Reyestr

const columns: ColumnDef<Reyestr>[] = [
    {
        header: "№",
        cell: ({ row }) => row.index + 1
    },
    {
        header: "Firma nomi",
        cell: ({ row }) => <div className="flex flex-col">{row.original?.client_name} <span className="text-muted-foreground">{row.original?.phone}</span></div>
    },
    {
        header: "Sana",
        cell: ({ row }) => row.original?.date?.split('/').join('.')
    },
    {
        header: "Qayerdan",
        accessorKey: 'loading'
    },
    {
        header: "Qayerga",
        accessorKey: "unloading"
    },
    {
        header: "Mashina raqami",
        accessorKey: "car_number"
    },
    {
        header: "Summa",
        cell: ({ row }) => formatMoney(row.original.income)
    }
]